import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { IValueCat } from '@models/cat.model';
import { IGroomer, IGroomingAppointment, IGroomingSalon, IGroomingSlot } from '@models/grooming.model';
import { IStep } from '@models/step.model';
import { ConstantsService } from '@services/constants/constants.service';
import { GroomingService } from '@services/grooming/grooming.service';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { Subscription, take } from 'rxjs';

export enum FormMap {
  cat = 'Котик',
  salonId = 'Салон',
  packageType = 'Пакет услуг',
  visitDate = 'Дата посещения',
  visitTime = 'Время посещения',
  ownerContact = 'Контакт владельца',
  groomerId = 'Грумер',
  notes = 'Комментарий'
}

@Component({
  selector: 'app-grooming-booking',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CheckInfoComponent,
    ThrobberComponent
  ],
  templateUrl: './grooming-booking.component.html',
  styleUrl: './grooming-booking.component.scss'
})
export class GroomingBookingComponent implements OnInit, OnDestroy {
  public loading = true;
  public form: UntypedFormGroup;
  public active: number;
  public optionsCat: IValueCat[] = [];
  public salons: IGroomingSalon[] = [];
  public groomers: IGroomer[] = [];
  public slots: IGroomingSlot[] = [];
  public selectedSalon: IGroomingSalon | null = null;
  public appointments: IGroomingAppointment[] = [];
  public reviewAppointmentId = '';
  public reviewRating = 5;
  public reviewComment = '';
  public reviewOpened = false;
  public appointmentsLoading = false;
  public reviewSuccess = '';
  public reviewError = '';

  private idService: string;
  private steps: IStep[] = [];
  private subscriptions: Subscription[] = [];

  public get getResult() {
    return this.serviceInfo.prepareDataForPreview(this.form.getRawValue(), this.steps, FormMap);
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private constantService: ConstantsService,
    private groomingService: GroomingService
  ) {}

  public ngOnInit(): void {
    this.constantService.getCatOptionsAll().pipe(take(1)).subscribe((cats: IValueCat[]) => {
      this.optionsCat = cats || [];
      this.prepareService();
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(item => item.unsubscribe());
  }

  private prepareService(): void {
    this.route.data.pipe(take(1)).subscribe(res => {
      this.idService = res['idService'];
      this.serviceInfo.getSteps(this.idService).pipe(take(1)).subscribe(steps => {
        this.steps = steps;
      });
      this.subscriptions.push(
        this.serviceInfo.activeStep.subscribe(active => {
          this.active = active?.[this.idService] || 0;
        })
      );
      this.initForm();
      this.loadSalons();
      this.loading = false;
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      0: this.fb.group({
        cat: [this.optionsCat[0] ? JSON.stringify(this.optionsCat[0]) : '', [Validators.required]],
        salonId: ['', [Validators.required]],
        packageType: ['Полный уход', [Validators.required, Validators.maxLength(64)]],
        visitDate: ['', [Validators.required]],
        visitTime: ['', [Validators.required]],
        ownerContact: ['', [Validators.required, Validators.pattern(/^[\d]{11}$/)]]
      }),
      1: this.fb.group({
        groomerId: [''],
        notes: ['', [Validators.maxLength(256)]]
      })
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });
  }

  private loadSalons(): void {
    this.groomingService.getSalons().pipe(take(1)).subscribe(list => {
      this.salons = list || [];
      const firstSalon = this.salons[0];
      if (firstSalon) {
        this.getControl(0, 'salonId').setValue(String(firstSalon.id));
        this.onSalonOrDateChange();
      }
    });
  }

  private loadAppointments(): void {
    this.appointmentsLoading = true;
    this.reviewError = '';
    const cat = this.getSelectedCat();
    if (!cat) {
      this.appointments = [];
      this.appointmentsLoading = false;
      return;
    }
    this.groomingService.getAppointments(cat.id).pipe(take(1)).subscribe(list => {
      this.appointments = (list || []).filter(item => this.canReviewAppointment(item));
      this.appointmentsLoading = false;

      if (this.reviewAppointmentId && !this.appointments.some(item => String(item.id) === this.reviewAppointmentId)) {
        this.reviewAppointmentId = '';
      }
    }, () => {
      this.appointmentsLoading = false;
      this.reviewError = 'Не удалось загрузить посещения для отзыва';
    });
  }

  public onCatChange(): void {
    this.reviewSuccess = '';
    this.reviewError = '';
    this.loadAppointments();
  }

  public onSalonOrDateChange(): void {
    const salonId = Number(this.getControl(0, 'salonId').value);
    this.selectedSalon = this.salons.find(item => item.id === salonId) || null;
    const groomerControl = this.getControl(1, 'groomerId');
    groomerControl.setValue('');
    if (this.selectedSalon?.providesGroomers) {
      groomerControl.setValidators([Validators.required]);
    } else {
      groomerControl.clearValidators();
    }
    groomerControl.updateValueAndValidity();
    this.groomers = [];
    this.slots = [];

    if (!salonId) {
      return;
    }

    this.groomingService.getGroomers(salonId).pipe(take(1)).subscribe(items => {
      this.groomers = items || [];
    });

    const visitDate = this.getControl(0, 'visitDate').value;
    if (!visitDate) {
      return;
    }
    this.groomingService.getSlots(salonId, visitDate).pipe(take(1)).subscribe(items => {
      this.slots = (items || []).filter(slot => slot.available);
      const first = this.slots[0];
      if (first) {
        this.getControl(0, 'visitTime').setValue(first.time);
      } else {
        this.getControl(0, 'visitTime').setValue('');
      }
    });
  }

  public isGroomerRequired(): boolean {
    return !!this.selectedSalon?.providesGroomers;
  }

  public submitReview(): void {
    this.reviewSuccess = '';
    this.reviewError = '';
    if (!this.reviewAppointmentId) {
      this.reviewError = 'Выберите посещение для отзыва';
      return;
    }
    if (!this.reviewComment.trim()) {
      this.reviewError = 'Добавьте комментарий к отзыву';
      return;
    }
    this.groomingService.submitReview(Number(this.reviewAppointmentId), this.reviewRating, this.reviewComment)
      .pipe(take(1))
      .subscribe(() => {
        this.reviewSuccess = 'Отзыв отправлен в салон и сохранен в базе портала';
        this.reviewAppointmentId = '';
        this.reviewComment = '';
      }, () => {
        this.reviewError = 'Не удалось отправить отзыв. Попробуйте еще раз';
      });
  }

  public toggleReview(): void {
    this.reviewOpened = !this.reviewOpened;
    this.reviewSuccess = '';
    this.reviewError = '';
    if (this.reviewOpened) {
      this.loadAppointments();
    }
  }

  public canReviewAppointment(appointment: IGroomingAppointment): boolean {
    if (appointment.status !== 'SALON_CONFIRMED' || !appointment.visitDate) {
      return false;
    }
    const visit = new Date(appointment.visitDate);
    visit.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return visit < today;
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  public toJson(value: unknown): string {
    return JSON.stringify(value);
  }

  public getSelectedCatId(): number | null {
    const cat = this.getSelectedCat();
    return cat?.id ?? null;
  }

  private getSelectedCat(): IValueCat | null {
    try {
      return JSON.parse(this.getControl(0, 'cat').value);
    } catch {
      return null;
    }
  }
}
