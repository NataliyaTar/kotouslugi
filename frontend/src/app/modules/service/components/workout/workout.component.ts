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
import {IFitness, IValueFitness} from "@models/fitness.model"
import { TrainerService } from '@services/trainer/trainer.service';
import { ITrainerOption, ITrainerGroupedByFitnessClub } from '@models/trainer.model';
import { NgIf, NgForOf } from '@angular/common';

export enum FormMap { // маппинг названия поля - значение
  cat  = 'Кличка',
  fitness_club = 'Фитнес зал',
  membership_type = 'Тип абонемента',
  trainer_name = 'Тренер',
  duration = 'Длительность абонемента',
  price = 'Цена'
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
  public fitnessFullList: IFitness[] = [];

  public trainerOptions: ITrainerGroupedByFitnessClub = {};
  public currentTrainers: ITrainerOption[] = [];

  ngOnInit(): void {
    this.getCatOption();

    this.constantService.getTrainerGroupedByFitnessClub().pipe(take(1)).subscribe(res => {
      this.trainerOptions = res;

      this.constantService.getFitnessOptionsAll().pipe(take(1)).subscribe(fitness => {
        this.optionsFitness = fitness;

        this.constantService.getFitnessRawList().pipe(take(1)).subscribe((fullList) => {
          this.fitnessFullList = fullList;


          this.initForm();

          // Подписка на изменение фитнес-клуба — цена и тренеры
          this.form.get('0.fitness_club')?.valueChanges.subscribe((fitnessId) => {
            const id = Number(fitnessId);
            this.currentTrainers = this.trainerOptions[id] || [];

            const selected = this.fitnessFullList.find(f => f.id === id);
            const price = selected?.price ?? null;

            this.form.get('1.price')?.setValue(price);
          });

          // Установка начального списка тренеров и цены
          const initialId = Number(this.form.get('0.fitness_club')?.value);
          this.currentTrainers = this.trainerOptions[initialId] || [];

          const initialSelected = this.fitnessFullList.find(f => f.id === initialId);
          const initialPrice = initialSelected?.price ?? null;
          this.form.get('1.price')?.setValue(initialPrice);
        });
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
        duration: ['', Validators.required],
        price: [null],
        trainer_name: ['', Validators.required] // будет валидироваться позже
      })
    });
    // динамическая валидация для trainer_name в зависимости от membership_type
      this.form.get('1.membership_type')?.valueChanges.subscribe(value => {
        if (value === '2' || value === '3') { // если "персональный" или "групповой"
          this.form.get('1.trainer_name')?.setValidators(Validators.required);
        } else {
          this.form.get('1.trainer_name')?.clearValidators();
        }
        this.form.get('1.trainer_name')?.updateValueAndValidity();
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

  public get getResult() {
      return this.serviceInfo.prepareDataForPreview(this.form.getRawValue(), this.steps, FormMap);
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
