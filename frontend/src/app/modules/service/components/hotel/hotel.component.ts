import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subscription, take } from 'rxjs';

import { OrderService } from '@services/order/order.service';
import { StepsComponent } from '@components/steps/steps.component';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ThrobberComponent } from '@components/throbber/throbber.component';

import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { HotelService, IBookingPayload } from '@services/hotel/hotel.service';
import { IStep } from '@models/step.model';

export enum FormMap {
  cat       = 'Котик',
  hotel     = 'Отель',
  startDate = 'Дата начала',
  endDate   = 'Дата окончания'
}

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    StepsComponent,
    CheckInfoComponent,
    ThrobberComponent
  ],
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.scss']
})
export class HotelComponent implements OnInit, OnDestroy {

  public loading = true;
  public notEnoughCats = false;

  public form!: FormGroup;
  public steps: IStep[] = [];
  public active: number = 0;

  public cats: any[] = [];
  public hotels: any[] = [];

  private idService: string = '';
  private subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private serviceInfo: ServiceInfoService,
    private hotelService: HotelService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.idService = this.route.snapshot.data['idService'];

    this.subs.push(
      this.serviceInfo.getSteps(this.idService).pipe(take(1)).subscribe({
        next: (steps) => {
          this.steps = steps.length ? steps : [
            { icon: 'pets.svg', title: 'Информация о котике', text: 'Заполните форму' },
            { icon: 'checklist.svg', title: 'Проверка информации', text: 'Проверьте заявку' }
          ];

          this.loadCatsAndHotels();
        },
        error: (err) => {
          this.steps = [
            { icon: 'pets.svg', title: 'Информация о котике', text: 'Заполните форму' },
            { icon: 'checklist.svg', title: 'Проверка информации', text: 'Проверьте заявку' }
          ];
          this.loadCatsAndHotels();
        }
      })
    );

    this.subs.push(
      this.serviceInfo.activeStep.subscribe(m => {
        this.active = m?.[this.idService] ?? 0;
      })
    );
  }

  private loadCatsAndHotels() {
    this.hotelService.getCatsAndHotels().pipe(take(1)).subscribe({
      next: ({ cats, hotels }) => {
        if (!cats.length || !hotels.length) {
          this.notEnoughCats = true;
          this.loading = false;
          return;
        }
        this.cats = cats;
        this.hotels = hotels;
        this.initForm();
        this.loading = false;
      },
      error: () => {
        this.notEnoughCats = true;
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private initForm(): void {
    this.form = this.fb.group({
      0: this.fb.group({
        cat: [this.cats[0]?.id || '', Validators.required],
        hotel: [this.hotels[0]?.id || '', Validators.required]
      }),
      1: this.fb.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required]
      }),
      2: this.fb.group({}) // preview пустая
    });

    // Регистрируем форму в сервисе
    this.serviceInfo.servicesForms$.next({
      ...this.serviceInfo.servicesForms$.value,
      [this.idService]: this.form
    });

  }

  public getControl(step: number, name: string): FormControl {
    return this.form.get(`${step}.${name}`) as FormControl;
  }

  public get getResult() {
    return this.serviceInfo.prepareDataForPreview(
      this.form.getRawValue(),
      this.steps,
      FormMap
    );
  }

  public isValidStep(): boolean {
    if (!this.form) return false;
    const stepControl = this.form.get(this.active.toString());
    if (!stepControl) return false;
    return stepControl.valid;
  }

  public next(): void {
    if (this.active < this.steps.length - 1) {
      this.active++;
      this.serviceInfo.setActiveStep(this.idService, this.active);
    }
  }

  public prev(): void {
    if (this.active > 0) {
      this.active--;
      this.serviceInfo.setActiveStep(this.idService, this.active);
    }
  }

  public save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const toLocal = (d: string) => `${d}T00:00:00`;

    const payload: IBookingPayload = {
      catId: raw[0].cat,
      hotelId: raw[0].hotel,
      recordStart: toLocal(raw[1].startDate),
      recordFinish: toLocal(raw[1].endDate)
    };

    this.hotelService.checkSpace(payload.hotelId, payload.recordStart, payload.recordFinish)
      .pipe(take(1))
      .subscribe(avail => {
        if (!avail) {
          alert('В выбранный отель нет свободных мест');
          return;
        }
        this.orderSave(payload);
      });
  }

  private orderSave(payload: IBookingPayload) {
    this.orderService.saveOrder(this.idService, this.form.getRawValue()).subscribe({
      next: () => {
        alert('Ваша заявка зарегистрирована');
        window.history.back();
      },
      error: () => {
        alert('Ошибка при сохранении заявки');
        window.history.back();
      }
    });
  }
}
