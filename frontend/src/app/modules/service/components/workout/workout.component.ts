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
import {IValueFitness} from "@models/fitness.model"
import { TrainerService } from '@services/trainer/trainer.service';
import { ITrainerOption, ITrainerGroupedByFitnessClub } from '@models/trainer.model';
import { NgIf, NgForOf } from '@angular/common';

export enum FormMap { // маппинг названия поля - значение
  cat  = 'Кличка',
  fitness_club = 'Фитнес зал',
}

@Component({
  selector: 'app-workout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent,
    JsonPipe,
    ThrobberComponent,
    NgIf,
    NgForOf,
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

  public optionsFitness: IValueFitness[] = [];
  public trainerOptions: ITrainerGroupedByFitnessClub = {};
  public currentTrainers: ITrainerOption[] = [];

  ngOnInit(): void {
    this.getCatOption();
    this.constantService.getTrainerGroupedByFitnessClub().pipe(take(1)).subscribe(res => {
      this.trainerOptions = res;

      this.constantService.getFitnessOptionsAll().pipe(take(1)).subscribe(fitness => {
        this.optionsFitness = fitness;

        this.initForm();

        // Подписка после того, как есть trainerOptions и form
        this.form.get('0.fitness_club')?.valueChanges.subscribe(fitnessId => {
          const id = Number(fitnessId);
          this.currentTrainers = this.trainerOptions[id] || [];
        });

        // Можно сразу установить начальный список тренеров
        const initialId = Number(this.form.get('0.fitness_club')?.value);
        this.currentTrainers = this.trainerOptions[initialId] || [];
      });
    });
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
        this.constantService.getFitnessOptionsAll().pipe(take(1)).subscribe(fitness => {
              this.optionsFitness = fitness;
              this.initForm();
        });
      });
    }

  private initForm(): void {
    this.form = this.fb.group({
      0: this.fb.group({
        cat: [JSON.stringify(this.optionsCat[0]), Validators.required],
        fitness_club: [this.optionsFitness[0]?.id || null, Validators.required]
      }),
      1: this.fb.group({
        membership_type: ['', Validators.required],
        trainer_name: [''] // будет валидироваться позже
      })
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });

    //Вот здесь подписка на выбор фитнес-клуба:
    this.form.get('0.fitness_club')?.valueChanges.subscribe((fitnessId) => {
      this.currentTrainers = this.trainerOptions[fitnessId] || [];

      // Если выбрано "персональный" или "групповой" тип — можно активировать поле с тренерами
      const membership = this.form.get('1.membership_type')?.value;
      if (membership === '2' || membership === '3') {
        this.form.get('1.trainer_name')?.setValidators(Validators.required);
      } else {
        this.form.get('1.trainer_name')?.clearValidators();
      }
      this.form.get('1.trainer_name')?.updateValueAndValidity();
    });

    this.loading = false;
  }



  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  public getItem(type: 'cat' | 'fitness', index: number): string {
    if (type === 'cat') {
      return JSON.stringify(this.optionsCat[index]);
    }
    // Для fitness просто возвращаем ID, так как это число
    return this.optionsFitness[index]?.id.toString() || '';
  }
}
