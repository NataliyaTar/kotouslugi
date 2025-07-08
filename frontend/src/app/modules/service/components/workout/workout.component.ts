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

export class WorkoutComponent implements OnInit {
  public loading = true;
  public form: UntypedFormGroup;
  public optionsCat: IValueCat[] = [];
  public active: number = 0; // Только первый шаг

  private idService: string; // мнемоника услуги
  private steps: IStep[]; // шаги формы
  private subscriptions: Subscription[] = [];

  public membershipTypes = [
      { id: 1, name: 'Йога' },
      { id: 2, name: 'Бокс' },
      { id: 3, name: 'Аэробика' }
    ];

    public trainers = [
      { id: 1, name: 'Иванов И.И.' },
      { id: 2, name: 'Петров П.П.' },
      { id: 3, name: 'Сидоров С.С.' }
    ];
  constructor(
    private fb: FormBuilder,
    private constantService: ConstantsService
  ) {}

  ngOnInit(): void {
    this.loadCatOptions();
  }

  private loadCatOptions(): void {
    this.constantService.getCatOptionsAll().pipe(
      take(1)
    ).subscribe({
      next: (cats) => {
        this.optionsCat = cats;
        this.initForm();
        this.loading = false;
      },
      error: (err) => {
        console.error('Ошибка загрузки котов:', err);
        this.loading = false;
      }
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
