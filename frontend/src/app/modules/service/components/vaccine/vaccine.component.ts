import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { IValueCat } from '@models/cat.model';
import { IVaccineType } from '@models/vaccine.model';
import { Subscription, take } from 'rxjs';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute } from '@angular/router';
import { CatService } from '@services/cat/cat.service';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { VaccineService } from '@services/vaccine/vaccine.service';
import { IStep } from '@models/step.model';
import { JsonPipe } from '@angular/common';
import { ThrobberComponent } from '@components/throbber/throbber.component';

export enum FormMap {
  cat = 'Кличка',
  telephone = 'Телефон для связи',
  email = 'Email для связи',
  indications = 'Показания к вакцинации',
  typeOfVaccine = 'Тип вакцинации',
  date = 'Дата',
  time = 'Время'
}

@Component({
  selector: 'app-vaccine',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent,
    JsonPipe,
    ThrobberComponent,
  ],
  templateUrl: './vaccine.component.html',
  styleUrl: './vaccine.component.scss'
})
export class VaccineComponent implements OnInit, OnDestroy {

  public loading = true; // загружена ли информация для страницы
  public form: UntypedFormGroup; // форма
  public active: number; // активный шаг формы
  public optionsCat: IValueCat[]; // список котов
  public typeOfVaccineOptions: IVaccineType[]; // список вакцин

  private idService: string; // мнемоника услуги
  private steps: IStep[]; // шаги формы
  private subscriptions: Subscription[] = [];

  private catOptionsLoaded = false; // флаг загрузки опций котов
  private vaccineOptionsLoaded = false; // флаг загрузки опций вакцин
  private stepsLoaded = false; // флаг загрузки шагов

  /**
   * Возвращает преобразованное значение формы для отображения заполненных данных
   */
  public get getResult() {
    return this.serviceInfo.prepareDataForPreview(this.form.getRawValue(), this.steps, FormMap);
  }

  public getTransformedResult(): any {
    const rawValue = this.form.getRawValue();
    const transformedValue = { ...rawValue };

    if (transformedValue[2] && transformedValue[2].typeOfVaccine) {
      try {
        const vaccine = JSON.parse(transformedValue[2].typeOfVaccine);
        transformedValue[2].typeOfVaccine = vaccine.name;
      } catch (error) {
        console.error('Error parsing vaccine JSON:', error);
        transformedValue[2].typeOfVaccine = 'Unknown vaccine';
      }
    }

    return this.serviceInfo.prepareDataForPreview(transformedValue, this.steps, FormMap);
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private catService: CatService,
    private constantService: ConstantsService,
    private vaccineService: VaccineService
  ) {
  }

  public ngOnInit(): void {
    this.getCatOption();
    this.getVaccineOptions();
    this.prepareService();
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
      this.catOptionsLoaded = true;
      this.checkAllDataLoaded();
    });
  }

  /**
  * Запрашиваем список вакцин с сервера
  */
  private getVaccineOptions(): void {
    this.vaccineService.getVaccineTypes().pipe(
      take(1)
    ).subscribe((res: IVaccineType[]) => {
      this.typeOfVaccineOptions = res;
      this.vaccineOptionsLoaded = true;
      this.checkAllDataLoaded();
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
        this.stepsLoaded = true;
        this.checkAllDataLoaded();
      });

      this.subscriptions.push(
        this.serviceInfo.activeStep.subscribe(res => {
          this.active = res?.[this.idService] || 0;
        })
      );
    });
  }

  /**
   * Проверка загрузки всех данных перед инициализацией формы
   * @private
   */
  private checkAllDataLoaded(): void {
    if (this.catOptionsLoaded && this.vaccineOptionsLoaded && this.stepsLoaded) {
      this.initForm();
    }
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
        indications: ['', [Validators.required, Validators.max(256)]]
      }),
      2: this.fb.group({
        typeOfVaccine: [JSON.stringify(this.typeOfVaccineOptions[0]), [Validators.required]],
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
      return { minDate: true };
    }

    return false;
  }

  /**
   * Возвращает json в виде строки
   * @param type
   * @param index
   */
  public getItem(type: 'cat' | 'typeOfVaccine', index: number): string {
    if (type === 'cat') {
      return JSON.stringify(this.optionsCat[index]);
    } else if (type === 'typeOfVaccine') {
      return JSON.stringify(this.typeOfVaccineOptions[index]);
    }
    return '';
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
