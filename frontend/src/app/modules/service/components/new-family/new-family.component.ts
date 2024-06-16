import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder, FormControl,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { Subscription, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { IValueCat } from '@models/cat.model';
import { IStep } from '@models/step.model';

export enum FormMap {
  cat  = 'Кличка',
  passport = 'Паспорт',
  place = 'Адрес места бракосочетания',
  date = 'Дата',
  time = 'Время'
}

@Component({
  selector: 'app-born',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent,
  ],
  templateUrl: './new-family.component.html',
  styleUrl: './new-family.component.scss'
})
export class NewFamilyComponent implements OnInit, OnDestroy {

  public form: UntypedFormGroup;
  public active: number;
  public optionsCat: IValueCat[];

  private idService: string;
  private steps: IStep[];
  private subscriptions: Subscription[] = [];

  public get getResult() {
    return this.serviceInfo.prepareData(this.form.getRawValue(), this.steps, FormMap);
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private constantService: ConstantsService,
  ) {
  }

  public ngOnInit(): void {
    this.constantService.getCatOptions().pipe(
      take(1)
    ).subscribe(res => {
      this.optionsCat = res;
    });

    this.subscriptions.push(
      this.route.data.subscribe(res => {
        this.idService = res['idService'];

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
      })
    );
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    })
  }

  private initForm(): void {
    this.form = this.fb.group({
      0: this.fb.group({
        cat: [this.optionsCat[0], [Validators.required]],
        passport: ['', [Validators.required, Validators.pattern(/^[\d]{4} [\d]{6}$/)]]
      }),
      1: this.fb.group({
        cat: [this.optionsCat[0], [Validators.required]],
        passport: ['', [Validators.required, Validators.pattern(/^([\d]{4} [\d]{6})$/)]]
      }),
      2: this.fb.group({
        place: ['', [Validators.required, Validators.pattern(/^[а-яА-ЯёЁ\d\s\.:\-,]+$/)]],
        date: ['', [Validators.required]],
        time: ['', [Validators.required]]
      })
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

}
