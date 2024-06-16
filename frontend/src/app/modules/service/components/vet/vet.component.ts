import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { IValueCat } from '@models/cat.model';
import { Subscription, take } from 'rxjs';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute } from '@angular/router';
import { CatService } from '@services/cat/cat.service';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { IValue } from '@models/common.model';
import { ConstantsService } from '@services/constants/constants.service';
import { IStep } from '@models/step.model';
import { JsonPipe } from '@angular/common';

export enum FormMap {
  cat  = 'Кличка',
  telephone = 'Телефон для связи',
  email = 'Email для связи',
  anamnesis = 'Жалобы',
  doctor = 'Специалист',
  date = 'Дата',
  time = 'Время'
}

@Component({
  selector: 'app-vet',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent,
    JsonPipe
  ],
  templateUrl: './vet.component.html',
  styleUrl: './vet.component.scss'
})
export class VetComponent implements OnInit, OnDestroy {

  public form: UntypedFormGroup;
  public active: number;
  public optionsCat: IValueCat[] = [];
  public doctorOptions = this.constantService.doctorOptions;

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
    private catService: CatService,
    private constantService: ConstantsService,
  ) {
  }

  public ngOnInit(): void {
    this.constantService.getCatOptions().pipe(
      take(1)
    ).subscribe((res) => {
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
        telephone: ['', [Validators.required, Validators.pattern(/^[\d]{11}$/)]],
        email: ['', [Validators.email]]
      }),
      1: this.fb.group({
        anamnesis: ['', [Validators.required, Validators.max(256)]]
      }),
      2: this.fb.group({
        doctor: [this.doctorOptions[0], [Validators.required]],
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
