//Временный файл

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
FormBuilder, FormControl,
ReactiveFormsModule,
UntypedFormGroup,
Validators
} from '@angular/forms';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { Subscription, take } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { IValueCat, TSex } from '@models/cat.model';
import { IStep } from '@models/step.model';
import { ThrobberComponent } from '@components/throbber/throbber.component';

export enum FormMap { // маппинг названия поля - значение
cat  = 'Кличка',
passport = 'Паспорт',
place = 'Адрес места бракосочетания',
date = 'Дата',
time = 'Время'
}

@Component({
selector: 'app-born',
standalone: true,
imports: [
ReactiveFormsModule,
CheckInfoComponent,
ThrobberComponent,
RouterModule,
],
templateUrl: '../new-family/new-family.component.html',
styleUrl: '../new-family/new-family.component.scss'
})
export class PassportComponent implements OnInit, OnDestroy {

public loading = true; // загружена ли информация для страницы
public notEnoughCats = false;
public form: UntypedFormGroup; // форма
public active: number; // активный шаг формы
public optionsCatM: IValueCat[]; // список котов
public optionsCatF: IValueCat[]; // список кошек

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
    private constantService: ConstantsService,
  ) {
  }

  public ngOnInit(): void {
    this.getCatsOptions();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    })
  }

  /**
   * Проверяем есть ли возможность использовать форму.
   * Запрашиваем отсортированных котов по полу
   */
  public getCatsOptions(): void {
    this.constantService.getCatOptionsBySex().pipe(
     take(1)
    ).subscribe(res => {
      if (!(res.male.length && res.female.length)) {
        this.notEnoughCats = true;
        this.loading = false;
      } else {
        this.optionsCatM = res.male;
        this.optionsCatF = res.female;
        this.prepareService();
      }
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
        cat: [JSON.stringify(this.optionsCatM[0]), [Validators.required]],
        passport: ['', [Validators.required, Validators.pattern(/^[\d]{4} [\d]{6}$/)]]
      }),
      1: this.fb.group({
        cat: [JSON.stringify(this.optionsCatF[0]), [Validators.required]],
        passport: ['', [Validators.required, Validators.pattern(/^([\d]{4} [\d]{6})$/)]]
      }),
      2: this.fb.group({
        place: ['', [Validators.required, Validators.pattern(/^[а-яА-ЯёЁ\d\s\.:\-,]+$/)]],
        date: ['', [Validators.required, this.dateValidator]],
        time: ['', [Validators.required]]
      })
    });

    // сеттим значение формы в сервис
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
   * @param index
   */
  public getItem(sex: TSex, index: number): string {
    if (sex === 'male') {
      return JSON.stringify(this.optionsCatM[index]);
    } else {
      return JSON.stringify(this.optionsCatF[index]);
    }
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
