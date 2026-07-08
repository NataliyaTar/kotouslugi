import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { IValueCat } from '@models/cat.model';
import { Subscription, take } from 'rxjs';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute } from '@angular/router';
import { ConstantsService } from '@services/constants/constants.service';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { IStep } from '@models/step.model';

export enum FormMap {
  cat           = 'Кличка',
  ownerPhone    = 'Телефон владельца',
  ownerEmail    = 'Email владельца',
  passportNumber = 'Серия и номер',
  issueDate     = 'Дата выдачи',
  chipNumber    = 'Номер чипа',
  specialMarks  = 'Особые отметки',
  photoUrl      = 'Ссылка на фото',
}

@Component({
  selector: 'app-passport',
  standalone: true,
  imports: [ReactiveFormsModule, CheckInfoComponent, ThrobberComponent],
  templateUrl: './passport.component.html',
  styleUrl: './passport.component.scss'
})
export class PassportComponent implements OnInit, OnDestroy {

  public loading = true;
  public form: UntypedFormGroup;
  public active: number;
  public optionsCat: IValueCat[];

  private idService: string;
  private steps: IStep[];
  private subscriptions: Subscription[] = [];

  public get getResult() {
    return this.serviceInfo.prepareDataForPreview(this.form.getRawValue(), this.steps, FormMap);
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private constantService: ConstantsService,
  ) {}

  public ngOnInit(): void {
    this.getCatOption();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private getCatOption(): void {
    this.constantService.getCatOptionsAll().pipe(take(1)).subscribe((res: IValueCat[]) => {
      this.optionsCat = res;
      this.prepareService();
    });
  }

  private prepareService(): void {
    this.route.data.pipe(take(1)).subscribe(res => {
      this.idService = res['idService'];

      this.serviceInfo.getSteps(this.idService).pipe(take(1)).subscribe(steps => {
        this.steps = steps;
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
      }),
      1: this.fb.group({
        ownerPhone: ['', [Validators.required, Validators.pattern(/^[\d]{11}$/)]],
        ownerEmail: ['', [Validators.email]],
      }),
      2: this.fb.group({
        passportNumber: ['', [Validators.required, Validators.pattern(/^[\d]{4} [\d]{6}$/)]],
        issueDate:      ['', [Validators.required, this.issueDateValidator]],
        chipNumber:     [''],
        specialMarks:   [''],
        photoUrl:       [''],
      }),
    });

    this.serviceInfo.servicesForms$.next({ [this.idService]: this.form });
    this.loading = false;
  }

  /**
   * Дата выдачи не должна быть в будущем
   */
  private issueDateValidator(control: FormControl) {
    if (control.value && new Date(control.value) > new Date()) {
      return { futureDate: true };
    }
    return null;
  }

  public getItem(index: number): string {
    return JSON.stringify(this.optionsCat[index]);
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }
}
