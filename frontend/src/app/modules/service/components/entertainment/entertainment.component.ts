import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder, FormControl,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import {pipe, Subscription, take} from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { IValueCat, TSex } from '@models/cat.model';
import { IStep } from '@models/step.model';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import {CurrencyPipe, DatePipe, JsonPipe} from "@angular/common";
import {CatService} from "@services/cat/cat.service";
import {IPlace} from "@models/place.model";
import {IServices} from "@models/event_services.model";
import {IAvailableTime} from "@models/available_time.model";


export enum FormMap {
  cat = 'Кличка',
  telephone = 'Телефон для связи',
  email = 'Email для связи',
  place = 'Место',
  event = 'Мероприятие',
  visitDatetime = 'Время посещения',
  price = 'Стоимость услуги'
}

@Component({
  selector: 'app-entertainment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent,
    JsonPipe,
    ThrobberComponent,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './entertainment.component.html',
  styleUrl: './entertainment.component.scss'
})

export class EntertainmentComponent implements OnInit, OnDestroy {

  public loading = true; // загружена ли информация для страницы
  public form: UntypedFormGroup; // форма
  public active: number; // активный шаг формы
  public optionsCat: IValueCat[]; // список котов
  public placeOptions: IPlace[]; // список доступных мест для посещения
  public eventOptions: IServices[]; //список мероприятий
  public availableSlotsOptions: string[]; //список доступных времени
  public price: string; //цена услуги

  private idService: string; // мнемоника услуги
  private steps: IStep[]; // шаги формы
  private subscriptions: Subscription[] = [];

  /**
   * Возвращает преобразованное значение формы для отображения заполненных данных
   */
  public get getResult() {
    const data = structuredClone(this.form.getRawValue());

    if (data[1]?.visitDatetime) {
      data[1].visitDatetime = this.formatDate(data[1].visitDatetime);
    }

    return this.serviceInfo.prepareDataForPreview(data, this.steps, FormMap);
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private constantService: ConstantsService,
  ) {
  }

  public ngOnInit(): void {
    this.getCatOption();
    this.getPlacesOption();
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

  /*
  * Запрашиваем отформатированный список мест развлечений
  * */

  private getPlacesOption(): void {
    this.constantService.getPlaceOptionsAll().pipe(
      take(1)).subscribe((res: IPlace[]) => {
        this.placeOptions = res;

      }
    )
  }

  //Метод получения списка меропритий
  private getEventsOptionsAll(eventID: number): void {
    this.constantService.getEventsOptionsAll(eventID).pipe(
      take(1)).subscribe((res: IServices[]) => {

        this.eventOptions = res;
      }
    )
  }

  //Метод получения списка возможного времени посещения
  private getAvailableSlotsOption(placeID: number): void {
    this.constantService.getAvailableTimeListAll(placeID).pipe(
      take(1)).subscribe((res: IAvailableTime) => {

        this.availableSlotsOptions = res.availableSlots.split(',');

        this.price = `${res.price} ₽`;

        this.getControl(1, 'price').setValue(this.price);
    }
    )
  }

  public formatDate(date: string): string {
    if (!date) {
      return '';
    }

    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
        telephone: ['', [Validators.required, Validators.pattern(/^[\d]{11}$/)]],
        email: ['', [Validators.email]]
      }),
      1: this.fb.group(
        {
          place: ['', [Validators.required]],
          event:['', [Validators.required]],
          visitDatetime: ['', [Validators.required]],
          price:[''],
        }
      )
    });

    this.subscriptions.push(
      this.getControl(1, 'place').valueChanges.subscribe(value => {
        this.getControl(1, 'event').reset();
        this.getControl(1, 'visitDatetime').reset();

        this.eventOptions = [];
        this.availableSlotsOptions = [];
        this.price = '';

        this.getControl(1, 'price').setValue('');

        const place = JSON.parse(value);

        this.getEventsOptionsAll(place.id);
      })
    );

    this.subscriptions.push(
      this.getControl(1, 'event').valueChanges.subscribe(value => {
        this.getControl(1, 'visitDatetime').reset();

        this.availableSlotsOptions = [];
        this.price = '';

        this.getControl(1, 'price').setValue('');

        if (!value) return;

        const event = JSON.parse(value);

        this.getAvailableSlotsOption(event.id);
      })
    );

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });

    this.loading = false;
  }

  /**
   * Возвращает json в виде строки
   * @param type
   * @param index
   */
  public getItem(type: 'cat' | 'place' | 'event' | 'visitDatetime', index: number): string {
      if (type === 'cat') return JSON.stringify(this.optionsCat[index]);

      /*Получаем список всех мест*/
      else if (type === 'place') {
        return JSON.stringify({
          text: this.placeOptions[index].name,
          ...this.placeOptions[index]
        });
      }

      else if (type === 'event') {
        return JSON.stringify({
          text: this.eventOptions[index].name,
          ...this.eventOptions[index]
        });
      }

    return this.availableSlotsOptions[index];
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
