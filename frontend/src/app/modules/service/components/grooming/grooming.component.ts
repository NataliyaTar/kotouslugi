import { Component, OnDestroy, OnInit } from '@angular/core';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { IValueCat } from '@models/cat.model';
import { Subscription } from 'rxjs';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute } from '@angular/router';
import { ConstantsService } from '@services/constants/constants.service';
import { IStep } from '@models/step.model';
import { ThrobberComponent } from '@components/throbber/throbber.component';

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
    ThrobberComponent,
    CheckInfoComponent
  ],
  templateUrl: './grooming.component.html',
  styleUrls: ['./grooming.component.scss']
})
export class GroomingComponent implements OnInit, OnDestroy {

  public loading = true;
  public form!: UntypedFormGroup;
  public active: number = 0;
  public optionsCat: IValueCat[] = [];
  public serviceOptions: { id: number, description: string }[] = [];

  private idService!: string;
  private steps: IStep[] = [];
  private subscriptions: Subscription[] = [];

  public get getResult() {
    return this.serviceInfo.prepareDataForPreview(this.form.getRawValue(), this.steps, FormMapGrooming);
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private constantService: ConstantsService
  ) {}

  public ngOnInit(): void {
    this.getCatOption();
    this.getServiceOptions();
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

  private getServiceOptions(): void {
    this.serviceInfo.getBookingServices().subscribe((res: any[]) => {
      this.serviceOptions = res.map(item => ({ id: item.id, description: item.description }));
    });
  }

  private prepareService(): void {
    this.route.data.subscribe(res => {
      this.idService = res['idService'];

      this.subscriptions.push(
        this.serviceInfo.activeStep.subscribe(state => {
          this.active = state?.[this.idService] || 0;
        })
      );

      this.serviceInfo.getSteps(this.idService).subscribe(res => {
        this.steps = res;
      });

      this.initForm();

      const forms: Record<string, UntypedFormGroup> = {};
      forms[this.idService] = this.form;

      this.serviceInfo.servicesForms$.next(forms);

      this.loading = false;
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      0: this.fb.group({
        cat: [JSON.stringify(this.optionsCat[0]), [Validators.required]],
        telephone: ['', [Validators.required, Validators.pattern(/^[\d]{11}$/)]],
        email: ['', [Validators.required, Validators.email]]
      }),
      1: this.fb.group({
        service: [null, [Validators.required]]
      }),
      2: this.fb.group({
        date: ['', [Validators.required, this.dateValidator]],
        time: ['', [Validators.required]]
      })
    });
  }

  private dateValidator = (control: FormControl): { [key: string]: boolean } | null => {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime())) {
      return { invalidDate: true };
    }

    if (selectedDate < today) {
      return { minDate: true };
    }

    return null;
  };

  public getItem(type: 'cat' | 'service', index: number): any {
    return type === 'cat'
      ? JSON.stringify(this.optionsCat[index])
      : this.serviceOptions[index].id;
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }
}
