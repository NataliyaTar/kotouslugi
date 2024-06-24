// Файл не трогаем

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder, FormControl,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { Subscription, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { IValueCat } from '@models/cat.model';
import { IStep } from '@models/step.model';
import { ThrobberComponent } from '@components/throbber/throbber.component';

export enum FormMap {
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
  ],
  templateUrl: './new-family.component.html',
  styleUrl: './new-family.component.scss'
})
export class NewFamilyComponent implements OnInit, OnDestroy {

  public loading = true; // загружена ли информация для страницы
  public form: UntypedFormGroup; // форма
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
    private constantService: ConstantsService,
  ) {
  }

  public ngOnInit(): void {
    // получаем список котов
    this.constantService.getCatOptions().pipe(
      take(1)
    ).subscribe(res => {
      this.optionsCat = res;

      // получаем мнемонику формы
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
    });
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    })
  }

  /**
   * Инициализация формы
   * @private
   */
  private initForm(): void {
    this.form = this.fb.group({
      0: this.fb.group({
        cat: [JSON.stringify(this.optionsCat[0]), [Validators.required]],
        passport: ['', [Validators.required, Validators.pattern(/^[\d]{4} [\d]{6}$/)]]
      }),
      1: this.fb.group({
        cat: [JSON.stringify(this.optionsCat[0]), [Validators.required]],
        passport: ['', [Validators.required, Validators.pattern(/^([\d]{4} [\d]{6})$/)]]
      }),
      2: this.fb.group({
        place: ['', [Validators.required, Validators.pattern(/^[а-яА-ЯёЁ\d\s\.:\-,]+$/)]],
        date: ['', [Validators.required]],
        time: ['', [Validators.required]]
      })
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });

    this.loading = false;
  }

  /**
   * Возвращает json в виде строки
   * @param index
   */
  public getItem(index: number): string {
    return JSON.stringify(this.optionsCat[index]);
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
