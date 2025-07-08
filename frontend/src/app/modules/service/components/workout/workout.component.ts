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

export class WorkoutComponent{}
