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
import { CatService } from '@services/cat/cat.service';
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
    this.getCatOption();

    this.constantService
      .getTrainerGroupedByFitnessClub()
      .pipe(take(1))
      .subscribe((res) => {
        this.trainerOptions = res;

        this.constantService
          .getFitnessOptionsAll()
          .pipe(take(1))
          .subscribe((fitness) => {
            this.optionsFitness = fitness;

            this.constantService
              .getFitnessRawList()
              .pipe(take(1))
              .subscribe((fullList) => {
                this.fitnessFullList = fullList;

                this.initForm();

                // подписка на изменение клуба
                this.form
                  .get('0.fitness_club')
                  ?.valueChanges.subscribe((fitnessId) => {
                    const id = JSON.parse(fitnessId)?.id;
                    this.currentTrainers = this.trainerOptions[id] || [];

                    const selected = this.fitnessFullList.find(
                      (f) => f.id === id
                    );
                    const price = selected?.price ?? null;

                    this.form.get('1.price')?.setValue(price);
                  });

                // установка начального тренера и цены
                const initialFitnessId = JSON.parse(
                  this.form.get('0.fitness_club')?.value
                )?.id;

                this.currentTrainers =
                  this.trainerOptions[initialFitnessId] || [];

                const initialSelected = this.fitnessFullList.find(
                  (f) => f.id === initialFitnessId
                );
                this.form.get('1.price')?.setValue(initialSelected?.price);
              });
          });
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private getCatOption(): void {
    this.constantService
      .getCatOptionsAll()
      .pipe(take(1))
      .subscribe((res: IValueCat[]) => {
        this.optionsCat = res;
        this.prepareService();
      });
  }

  private prepareService(): void {
    this.route.data.pipe(take(1)).subscribe((res) => {
      this.idService = res['idService'];

      this.serviceInfo
        .getSteps(this.idService)
        .pipe(take(1))
        .subscribe((res) => {
          this.steps = res;
        });

      this.subscriptions.push(
        this.serviceInfo.activeStep.subscribe((res) => {
          this.active = res?.[this.idService] || 0;
        })
      );

      this.constantService
        .getFitnessOptionsAll()
        .pipe(take(1))
        .subscribe((fitness) => {
          this.optionsFitness = fitness;
          this.initForm();
        });
    });
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
    });

    // валидация trainer_name
    this.form
      .get('1.membership_type')
      ?.valueChanges.subscribe((membershipType) => {
        const trainerCtrl = this.form.get('1.trainer_name');
        if (membershipType === 'Групповой' || membershipType === 'Персональный') {
          trainerCtrl?.setValidators(Validators.required);
        } else {
          trainerCtrl?.clearValidators();
        }
        trainerCtrl?.updateValueAndValidity();
      });

    this.form
      .get('1.membership_type')
      ?.valueChanges.subscribe((membershipType) => {
      const trainerCtrl = this.form.get('1.trainer_name');
      if (membershipType === 'Групповой' || membershipType === 'Персональный') {
        trainerCtrl?.setValidators(Validators.required);
      } else {
        trainerCtrl?.clearValidators();
        trainerCtrl?.reset('');
      }
      trainerCtrl?.updateValueAndValidity();
    });

    // сериализация выбранного тренера при изменении
    this.form.get('1.trainer_name')?.valueChanges.subscribe((value) => {
      if (value && typeof value !== 'string') {
        this.form
          .get('1.trainer_name')
          ?.setValue(JSON.stringify(value), { emitEvent: false });
      }
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form,
    });

    this.loading = false;
  }

  public get getResult() {
    const rawData = this.form.getRawValue();

    if (rawData[1]?.membership_type === 'Свободный') {
      delete rawData[1].trainer_name;
    }

    return this.serviceInfo.prepareDataForPreview(
      rawData,
      this.steps,
      FormMap
    );
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  getItem(type: 'cat' | 'fitness' | 'trainer', index: number): string {
    if (type === 'cat') {
      return JSON.stringify(this.optionsCat[index]); // без `.value`
    }
    if (type === 'fitness') {
      return JSON.stringify(this.optionsFitness[index]);
    }
    if (type === 'trainer') {
      return JSON.stringify(this.currentTrainers[index]);
    }
    return '';
  }


}
