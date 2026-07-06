import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { IValueCat } from '@models/cat.model';
import { IGroomingAppointment } from '@models/grooming.model';
import { IStep } from '@models/step.model';
import { ConstantsService } from '@services/constants/constants.service';
import { GroomingService } from '@services/grooming/grooming.service';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { Subscription, take } from 'rxjs';

enum FormMap {
  cat = 'Котик',
  appointmentId = 'Посещение',
  rating = 'Оценка',
  comment = 'Комментарий'
}

@Component({
  selector: 'app-grooming-review',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent,
    ThrobberComponent
  ],
  templateUrl: './grooming-review.component.html',
  styleUrl: './grooming-review.component.scss'
})
export class GroomingReviewComponent implements OnInit, OnDestroy {
  public loading = true;
  public form: UntypedFormGroup;
  public active: number;
  public optionsCat: IValueCat[] = [];
  public appointments: IGroomingAppointment[] = [];

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
      this.reloadAppointments();
      this.loading = false;
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      0: this.fb.group({
        cat: [this.optionsCat[0] ? JSON.stringify(this.optionsCat[0]) : '', [Validators.required]],
        appointmentId: ['', [Validators.required]]
      }),
      1: this.fb.group({
        rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
        comment: ['', [Validators.required, Validators.maxLength(512)]]
      })
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });
  }

  public reloadAppointments(): void {
    const cat = this.getSelectedCat();
    this.appointments = [];
    this.getControl(0, 'appointmentId').setValue('');
    if (!cat) {
      return;
    }
    this.groomingService.getAppointments(cat.id).pipe(take(1)).subscribe(list => {
      this.appointments = (list || []).filter(item => item.status === 'SALON_CONFIRMED');
      const first = this.appointments[0];
      if (first) {
        this.getControl(0, 'appointmentId').setValue(String(first.id));
      }
    });
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  public toJson(value: unknown): string {
    return JSON.stringify(value);
  }

  private getSelectedCat(): IValueCat | null {
    try {
      return JSON.parse(this.getControl(0, 'cat').value);
    } catch {
      return null;
    }
  }
}
