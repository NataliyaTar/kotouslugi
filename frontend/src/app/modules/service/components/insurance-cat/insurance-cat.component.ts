import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { IValueCat } from '@models/cat.model';
import { IInsurance } from '@models/insurance.model';
import { Subscription, take } from 'rxjs';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute } from '@angular/router';
import { CatService } from '@services/cat/cat.service';
import { InsuranceService } from '@services/insurance/insurance.service';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { IStep } from '@models/step.model';
import { JsonPipe } from '@angular/common';
import { ThrobberComponent } from '@components/throbber/throbber.component';

export enum FormMap {
  cat  = 'Кличка',
  telephone = 'Телефон для связи',
  email = 'Email для связи',
  company = 'Страховая компания',
  category = 'Категория страхования',
  duration = 'Длительность страховки',
  date = 'Дата',
  cash = 'Стоимость'
}

@Component({
  selector: 'app-vet',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent,
    JsonPipe,
    ThrobberComponent,
  ],
  templateUrl: './insurance-cat.component.html',
  styleUrl: './insurance-cat.component.scss'
})
export class InsuranceCatComponent  implements OnInit, OnDestroy {

  public loading = true; // загружена ли информация для страницы
  public form: UntypedFormGroup; // форма
  public active: number; // активный шаг формы
  public optionsCat: IValueCat[]; // список котов
  public optionsInsurance: IInsurance[]; // список страховой компании
  public CompaniesOptions = this.constantService.CompaniesOptions; // список страховой компании
  public CategoriesOptions = this.constantService.CategoriesOptions; // список категории страхования
  private idService: string; // мнемоника услуги
  private steps: IStep[]; // шаги формы
  private subscriptions: Subscription[] = [];
  /**
   * Возвращает преобразованное значение формы для отображения заполненных данных
   */
  public get getResult() {
    return this.serviceInfo.prepareDataForPreview(this.form.getRawValue(), this.steps, FormMap);
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private catService: CatService,
    private constantService: ConstantsService,
    private insuranceService: InsuranceService,
  ){
  }

  public ngOnInit(): void {
    this.getCatOption();
    this.getInsuranceOption();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    })
  }

  /**
   * Запрашиваем отформатированный список котов
   */
  private getCatOption(): void {
    this.constantService.getCatOptionsAll().pipe(
      take(1)
    ).subscribe((res: IValueCat[]) => {
      this.optionsCat = res;
      this.prepareService();
    });
  }
  /**
   * Запрашиваем цены страховых компаний
   */
  private getInsuranceOption(): void {
    this.insuranceService.getInsuranceList().pipe(
       take(1)
    ).subscribe((res: IInsurance[]) => {
       this.optionsInsurance = res;
       //this.loading = false;
       this.prepareService();
    });
  }

  /**
   * Получаем мнемонику формы, запрашиваем шаги формы
   * @private
   */
  private prepareService(): void {
    this.route.data.pipe(
      take(1)
    ).subscribe(res => {
      this.idService = res['idService'];

      // запрашиваем шаги формы
      this.serviceInfo.getSteps(this.idService).pipe(
        take(1)
      ).subscribe(res => {
        this.steps = res;
      });

      this.subscriptions.push(
        this.serviceInfo.activeStep.subscribe(res => {
          this.active = res?.[this.idService] || 0;
        })
      );

      this.initForm();
    });
  }

  /**
   * Инициализация формы
   * @private
   */
  private initForm(): void {
    this.form = this.fb.group({
      0: this.fb.group({
        cat: [JSON.stringify(this.optionsCat[0]), [Validators.required]],
        telephone: ['', [Validators.required, Validators.pattern(/^[\d]{11}$/)]],
        email: ['', [Validators.email]]
      }),
      1: this.fb.group({
        company: [JSON.stringify(this.CompaniesOptions[0]), [Validators.required]],
        category: [JSON.stringify(this.CategoriesOptions[0]), [Validators.required]],
        duration: ['', [Validators.required, Validators.pattern(/^\d{1,3}$/)]],
        cash: ['', [Validators.required, Validators.pattern(/^\d{1,5}$/)]],
        date: ['', [Validators.required, this.dateValidator]]
      })
    });
    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });

    this.loading = false;
  }

  /**
   * Кастомная валидация для даты
   * @param control
   * @private
   */
  private dateValidator(control: FormControl): { [key: string]: boolean } | null {
      if (control.value && new Date(control.value) < new Date()) {
          return { minDate: true };
      }
      return null;
  }

  /**
   * Возвращает json в виде строки
   * @param type
   * @param index
   */
  public getItem(type: 'cat' | 'company' | 'category', index: number): string {
    if (type === 'cat') {
      return JSON.stringify(this.optionsCat[index]);
    }
     if (type === 'category') {
          return JSON.stringify(this.CategoriesOptions[index]);
     }
    return JSON.stringify(this.CompaniesOptions[index]);
  }

  /**
   * Возвращает контрол формы
   * @param step
   * @param id
   */
  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

}
