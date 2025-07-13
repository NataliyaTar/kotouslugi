import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { IValueCat } from '@models/cat.model';
import { Subscription, take } from 'rxjs';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute } from '@angular/router';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { IStep } from '@models/step.model';
import { JsonPipe } from '@angular/common';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { IFitness, IValueFitness } from '@models/fitness.model';
import {
  ITrainerOption,
  ITrainerGroupedByFitnessClub,
} from '@models/trainer.model';
import { NgIf, NgForOf } from '@angular/common';

export enum FormMap {
  cat = 'Кличка',
  fitness_club = 'Фитнес зал',
  membership_type = 'Тип абонемента',
  trainer_name = 'Тренер',
  duration = 'Длительность абонемента',
  price = 'Цена',
  telephone = 'Телефон для связи',
  email = 'Email для связи',
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
  styleUrl: './workout.component.scss',
})
export class WorkoutComponent implements OnInit, OnDestroy {
  public loading = true;
  public form: UntypedFormGroup;
  public optionsCat: IValueCat[] = [];
  public optionsFitness: IValueFitness[] = [];
  public fitnessFullList: IFitness[] = [];

  public active = 0;
  public trainerOptions: ITrainerGroupedByFitnessClub = {};
  public currentTrainers: ITrainerOption[] = [];
  public filteredTrainers: ITrainerOption[] = [];

  private idService: string;
  private steps: IStep[];
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private constantService: ConstantsService,
    private route: ActivatedRoute,
    private serviceInfo: ServiceInfoService
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(take(1)).subscribe((res) => {
      this.idService = res['idService'];

      this.serviceInfo.getSteps(this.idService).pipe(take(1)).subscribe((steps) => {
        this.steps = steps;

        this.subscriptions.push(
          this.serviceInfo.activeStep.subscribe((res) => {
            this.active = res?.[this.idService] || 0;
          })
        );

        this.constantService.getCatOptionsAll().pipe(take(1)).subscribe((cats) => {
          this.optionsCat = cats;

          this.constantService.getTrainerGroupedByFitnessClub().pipe(take(1)).subscribe((trainers) => {
            this.trainerOptions = trainers;

            this.constantService.getFitnessOptionsAll().pipe(take(1)).subscribe((fitnessOptions) => {
              this.optionsFitness = fitnessOptions;

              this.constantService.getFitnessRawList().pipe(take(1)).subscribe((fullList) => {
                this.fitnessFullList = fullList;

                this.initForm();

                this.form.get('0.fitness_club')?.valueChanges.subscribe((fitnessId) => {
                  const id = JSON.parse(fitnessId)?.id;
                  this.currentTrainers = this.trainerOptions[id] || [];
                  this.filterTrainersByMembershipType();
                  this.updateTotalPrice();
                });

                const initialFitnessId = JSON.parse(this.form.get('0.fitness_club')?.value)?.id;
                this.currentTrainers = this.trainerOptions[initialFitnessId] || [];
                this.updateTotalPrice();

                this.form.get('1.membership_type')?.valueChanges.subscribe(() => {
                  this.filterTrainersByMembershipType();
                  this.updateTotalPrice();
                });

                this.form.get('1.trainer_name')?.valueChanges.subscribe((value) => {
                  if (value && typeof value !== 'string') {
                    this.form.get('1.trainer_name')?.setValue(JSON.stringify(value), { emitEvent: false });
                    return;
                  }
                  this.updateTotalPrice();
                });
              });
            });
          });
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private initForm(): void {
    const defaultCat = this.optionsCat[0];
    const defaultFitness = this.optionsFitness[0];

    this.form = this.fb.group({
      0: this.fb.group({
        cat: [JSON.stringify(defaultCat), Validators.required],
        fitness_club: [JSON.stringify(defaultFitness), Validators.required],
      }),
      1: this.fb.group({
        membership_type: ['', Validators.required],
        duration: ['', Validators.required],
        trainer_name: ['', Validators.required],
        price: [null],
      }),
      2: this.fb.group({
        telephone: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
        email: ['', [Validators.email]],
      }),
    });

    this.form.get('1.membership_type')?.valueChanges.subscribe((membershipType) => {
      const trainerCtrl = this.form.get('1.trainer_name');
      if (membershipType === 'Групповой' || membershipType === 'Персональный') {
        trainerCtrl?.setValidators(Validators.required);
      } else {
        trainerCtrl?.clearValidators();
        trainerCtrl?.reset('');
      }
      trainerCtrl?.updateValueAndValidity();
    });

    this.form.get('1.trainer_name')?.valueChanges.subscribe((value) => {
      if (value && typeof value !== 'string') {
        this.form.get('1.trainer_name')?.setValue(JSON.stringify(value), { emitEvent: false });
      }
    });
    this.form.get('1.duration')?.valueChanges.subscribe(() => {
      this.updateTotalPrice();
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form,
    });

    this.loading = false;
  }

  private getBaseFitnessPrice(): number {
    const fitnessValue = this.form.get('0.fitness_club')?.value;
    const fitnessId = fitnessValue ? JSON.parse(fitnessValue).id : null;
    const selected = this.fitnessFullList.find(f => f.id === fitnessId);
    return selected?.price || 0;
  }

  private getTrainerPrice(): number {
    const trainerValue = this.form.get('1.trainer_name')?.value;
    try {
      const trainer = trainerValue ? JSON.parse(trainerValue) : null;
      return trainer?.membership_price || 0;
    } catch {
      return 0;
    }
  }
  private getDurationMultiplier(): number {
    const duration = this.form.get('1.duration')?.value;
    switch (duration) {
      case '3 месяца':
        return 1.25;
      case '6 месяцев':
        return 1.5;
      case '12 месяцев':
        return 2;
      default:
        return 1; // 1 месяц или неизвестное значение
    }
  }


  private updateTotalPrice(): void {
    const fitnessPrice = this.getBaseFitnessPrice();
    const trainerPrice = this.getTrainerPrice();
    const multiplier = this.getDurationMultiplier();

    const total = Math.round((fitnessPrice + trainerPrice) * multiplier);
    const formatted = `${total} ₽`;

    this.form.get('1.price')?.setValue(formatted);
  }


  private filterTrainersByMembershipType(): void {
    const membershipType = this.form.get('1.membership_type')?.value;
    if (!membershipType) {
      this.filteredTrainers = [];
      return;
    }

    this.filteredTrainers = this.currentTrainers.filter(
      trainer => trainer.membership_type === membershipType
    );

    const currentTrainer = JSON.parse(this.form.get('1.trainer_name')?.value || 'null');
    if (currentTrainer && !this.filteredTrainers.some(t => t.id === currentTrainer.id)) {
      this.form.get('1.trainer_name')?.reset();
    }
  }

  public get getResult() {
    const rawData = this.form.getRawValue();
    if (rawData[1]?.membership_type === 'Свободный') {
      delete rawData[1].trainer_name;
    }
    return this.serviceInfo.prepareDataForPreview(rawData, this.steps, FormMap);
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  getItem(type: 'cat' | 'fitness' | 'trainer', index: number): string {
    if (type === 'trainer') {
      return JSON.stringify(this.filteredTrainers[index]);
    }
    if (type === 'cat') {
      return JSON.stringify(this.optionsCat[index]);
    }
    if (type === 'fitness') {
      return JSON.stringify(this.optionsFitness[index]);
    }
    return '';
  }
}

