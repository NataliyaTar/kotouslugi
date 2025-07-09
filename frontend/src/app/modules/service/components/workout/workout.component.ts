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

export enum FormMap { // маппинг названия поля - значение
  cat  = 'Кличка',
  fitness_club = 'Фитнес зал',
  membership_type = 'Тип абонемента',
  trainer_name = 'ФИО тренера',
  price = 'Стоимость абонемента',
  session_start = 'Начало занятия',
  session_end = 'Конец занятия',
  end_date = 'Дата окончания действия абонемента',
  created_at = 'Дата и время создания записи',
  updated_at = 'Дата и время последнего обновления'
}

@Component({
  selector: 'app-workout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent,
    JsonPipe,
    ThrobberComponent,
  ],
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.scss'
})

export class WorkoutComponent implements OnInit, OnDestroy{
  public loading = true;
  public form: UntypedFormGroup;
  public optionsCat: IValueCat[] = [];
  public active: number = 0; // Только первый шаг

  private idService: string; // мнемоника услуги
  private steps: IStep[]; // шаги формы
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private constantService: ConstantsService,
    private route: ActivatedRoute,
    private serviceInfo: ServiceInfoService
  ) {}

  ngOnInit(): void {
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

  private initForm(): void {
    this.form = this.fb.group({
      0: this.fb.group({
        cat: [JSON.stringify(this.optionsCat[0]), [Validators.required]]
      }),
      1: this.fb.group({
              membership_type: ['', [Validators.required]],
              trainer_name: ['', [Validators.required]]
            })
    });
  this.serviceInfo.servicesForms$.next({
    [this.idService]: this.form
  });
  this.loading = false;

  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  public getItem(type: 'cat', index: number): string {
    if (type === 'cat') {
      return JSON.stringify(this.optionsCat[index]);
    }
    return '';
  }
}
