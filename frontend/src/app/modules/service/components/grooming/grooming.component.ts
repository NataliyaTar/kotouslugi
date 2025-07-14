
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { IValueCat } from '@models/cat.model';
import { Subscription } from 'rxjs';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute } from '@angular/router';
import { CatService } from '@services/cat/cat.service';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { IStep } from '@models/step.model';
import { JsonPipe } from '@angular/common';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { NgIf } from '@angular/common';

export enum FormMapGrooming {
  cat = 'Кличка',
  telephone = 'Телефон для связи',
  email = 'Email для связи',
  service = 'Выберите услугу',
  date = 'Дата',
  time = 'Время'
}

@Component({
  selector: 'app-grooming',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent,
    JsonPipe,
    ThrobberComponent,
        NgIf
  ],
  templateUrl: './grooming.component.html',
  styleUrls: ['./grooming.component.scss']
})
export class GroomingComponent implements OnInit, OnDestroy {

  public loading = true;
  public form: UntypedFormGroup;
  public active: number;
  public optionsCat: IValueCat[];
  public serviceOptions = this.constantService.groomingOptions;

  private idService: string;
  private steps: IStep[];
  private subscriptions: Subscription[] = [];

  public get getResult() {
    return this.serviceInfo.prepareDataForPreview(this.form.getRawValue(), this.steps, FormMapGrooming);
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private catService: CatService,
    private constantService: ConstantsService
  ) {}

  public ngOnInit(): void {
    this.getCatOption();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(item => item.unsubscribe());
  }

  private getCatOption(): void {
    this.constantService.getCatOptionsAll().subscribe((res: IValueCat[]) => {
      this.optionsCat = res;
      this.prepareService();
    });
  }

  private prepareService(): void {
    this.route.data.subscribe(res => {
      this.idService = res['idService'];

      this.serviceInfo.getSteps(this.idService).subscribe(res => {
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

  private initForm(): void {
    this.form = this.fb.group({
      0: this.fb.group({
        cat: [JSON.stringify(this.optionsCat[0]), [Validators.required]],
        telephone: ['', [Validators.required, Validators.pattern(/^[\d]{11}$/)]],
        email: ['', [Validators.email]]
      }),
      1: this.fb.group({
        service: ['', [Validators.required]]
      }),
      2: this.fb.group({
        date: ['', [Validators.required, this.dateValidator]],
        time: ['', [Validators.required]]
      })
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });

    this.loading = false;
  }

  private dateValidator = (control: FormControl) => {
    if (new Date(control.value) < new Date()) {
      return { minDate: true };
    }
    return null;
  };

  public getItem(type: 'cat' | 'service', index: number): string {
    if (type === 'cat') {
      return JSON.stringify(this.optionsCat[index]);
    }
    return JSON.stringify(this.serviceOptions[index]);
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  // Перейти к следующему шагу
  public nextStep(): void {
    if (this.active < 3 && this.form.get(this.active.toString())?.valid) {
      this.serviceInfo.setActiveStep(this.idService, this.active + 1);
    }
  }

  // Перейти к предыдущему шагу
  public prevStep(): void {
    if (this.active > 0) {
      this.serviceInfo.setActiveStep(this.idService, this.active - 1);
    }
  }

  // Подтвердить запись
  public submitForm(): void {
    if (this.form.valid) {
      const formData = this.form.getRawValue();

      // Сохраняем данные в localStorage (симуляция бэкенда)
      const savedRequests = JSON.parse(localStorage.getItem('groomingRequests') || '[]');
      savedRequests.push(formData);
      localStorage.setItem('groomingRequests', JSON.stringify(savedRequests));

      // Переход на последний шаг (подтверждение)
      this.serviceInfo.setActiveStep(this.idService, 3);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
