// Доделать второй и третий этап

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { IValueCat } from '@models/cat.model';
import { Subscription, take } from 'rxjs';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute } from '@angular/router';
import { CatService } from '@services/cat/cat.service';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { IStep } from '@models/step.model';
import { JsonPipe } from '@angular/common';
import { ThrobberComponent } from '@components/throbber/throbber.component';

export enum FormMap {
cat  = 'Кличка',
sex = 'Пол',
place_born = 'Место рождения',
reg_adress = 'Адрес регистарции',
children = 'Наличие котят',
selectedBank = 'Выбранный банк',
date_of_birth = 'Дата рождения',
time = 'Время'
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
templateUrl: './passport.component.html',
styleUrl: './passport.component.scss'
})
export class PassportComponent implements OnInit, OnDestroy {

public loading = true; // загружена ли информация для страницы
public form: UntypedFormGroup; // форма
public sexOptions = this.constantService.sexOptions; // список полов
public childOptions = this.constantService.childOptions; // есть дети или нет
public active: number; // активный шаг формы
public optionsCat: IValueCat[]; // список котов

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
        sex: [JSON.stringify(this.sexOptions[0]), [Validators.required]],
        date_of_birth: ['', [Validators.required, this.dateValidatorBirth]],
        place_born: ['', [Validators.required, Validators.pattern(/^[а-яА-ЯёЁ\d\s\.:\-,]+$/)]],
        reg_adress: ['', [Validators.required, Validators.pattern(/^[а-яА-ЯёЁ\d\s\.:\-,]+$/)]],
        children: [JSON.stringify(this.childOptions[0]), [Validators.required]]
      }),
      1: this.fb.group({
        selectedBank: ['', [Validators.required]]
      }),
      2: this.fb.group({
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
   * Кастомная валидация для даты рождения
   * @param control
   * @private
   */
  private dateValidatorBirth(control: FormControl) {
    if (new Date(control.value) !> new Date()) {
      return {minDate: true};
    }

    return false;
  }
  /**
   * Возвращает json в виде строки
   * @param type
   * @param index
   */
  public getItem(type: 'cat' | 'sex' | 'children', index: number): string {
    if (type === 'cat') {
      return JSON.stringify(this.optionsCat[index]);
    }
    if (type === 'sex') {
      return JSON.stringify(this.sexOptions[index]);
    }
    return JSON.stringify(this.childOptions[index]);
  }

  /**
   * Возвращает контрол формы
   * @param step
   * @param id
   */
  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  selectBank(bank: string): void {
    const control = this.getControl(1, 'selectedBank');
    control.setValue(bank);
    control.markAsTouched();
  }
}
