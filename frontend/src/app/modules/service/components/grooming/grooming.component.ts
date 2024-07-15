import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators} from "@angular/forms";
import {CheckInfoComponent} from "@components/check-info/check-info.component";
import {JsonPipe} from "@angular/common";
import {ThrobberComponent} from "@components/throbber/throbber.component";
import {IValueCat} from "@models/cat.model";
import {IStep} from "@models/step.model";
import {Subscription, take} from "rxjs";
import {ServiceInfoService} from "@services/servise-info/service-info.service";
import {ActivatedRoute} from "@angular/router";
import {CatService} from "@services/cat/cat.service";
import {ConstantsService} from "@services/constants/constants.service";

export enum FormMap {
  cat  = 'Кличка',
  telephone = 'Телефон для связи',
  email = 'Email для связи',
  groomer = 'Мастер',
  date = 'Дата',
  time = 'Время'
}

@Component({
  selector: 'app-grooming',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent,
    JsonPipe,
    ThrobberComponent,
  ],
  templateUrl: './grooming.component.html',
  styleUrl: './grooming.component.scss'
})

export class GroomingComponent implements OnInit, OnDestroy {

  public loading = true; // загружена ли информация для страницы
  public form: UntypedFormGroup; // форма
  public active: number; // активный шаг формы
  public optionsCat: IValueCat[]; // список котов
  public groomerOptions = this.constantService.groomerOptions; // список имен мастеров
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
  ) {
  }

  public ngOnInit(): void {
    this.getCatOption();
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
        telephone: ['', [Validators.required, Validators.pattern(/^[\+]?\d{1}\s[\(]\d{3}[\)]\s\d{3}[\-]\d{2}[\-]\d{2}$/)]],
        email: ['', [Validators.email, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)]]
      }),
      1: this.fb.group({
        groomer: [JSON.stringify(this.groomerOptions[0]), [Validators.required]],
        date: ['', [Validators.required, this.dateValidator]],
        time: ['', [Validators.required]]
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
  private dateValidator(control: FormControl) {
    if (new Date(control.value) < new Date()) {
      return {minDate: true};
    }

    return false;
  }

  /**
   * Возвращает json в виде строки
   * @param type
   * @param index
   */
  public getItem(type: 'cat' | 'groom', index: number): string {
    if (type === 'cat') {
      return JSON.stringify(this.optionsCat[index]);
    }

    return JSON.stringify(this.groomerOptions[index]);
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
