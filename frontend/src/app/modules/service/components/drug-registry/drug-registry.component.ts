import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription, take } from 'rxjs';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute } from '@angular/router';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { IStep } from '@models/step.model';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { DrugService } from '@services/drug/drug.service';
import { IDrugVerification } from '@models/drug.model';
import { DatePipe } from '@angular/common';

export enum FormMap {
  batchCode = 'Код партии',
  verificationResult = 'Результат проверки',
  reportDescription = 'Описание нарушения',
  reporterContact = 'Контакт для связи'
}

@Component({
  selector: 'app-drug-registry',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent,
    ThrobberComponent,
    DatePipe,
  ],
  templateUrl: './drug-registry.component.html',
  styleUrl: './drug-registry.component.scss'
})
export class DrugRegistryComponent implements OnInit, OnDestroy {

  public loading = true;
  public form: UntypedFormGroup;
  public active: number;
  public verificationResult: IDrugVerification;
  public verifying = false;

  private idService: string;
  private steps: IStep[];
  private subscriptions: Subscription[] = [];

  public get getResult() {
    const raw = this.form.getRawValue();
    if (this.verificationResult && raw[0]) {
      raw[0].verificationResult = this.verificationResult.message;
    }
    return this.serviceInfo.prepareDataForPreview(raw, this.steps, FormMap);
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private drugService: DrugService,
  ) {}

  public ngOnInit(): void {
    this.prepareService();
  }

  public ngOnDestroy() {
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
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      0: this.fb.group({
        batchCode: ['', [Validators.required, Validators.maxLength(32)]],
      }),
      1: this.fb.group({
        reportDescription: ['', [Validators.maxLength(512)]],
        reporterContact: ['', [Validators.pattern(/^[\d]{11}$/)]],
      }),
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });

    this.loading = false;
  }

  public verifyDrug(): void {
    const code = this.getControl(0, 'batchCode').value;
    if (!code) {
      return;
    }
    this.verifying = true;
    this.drugService.verifyBatch(code).pipe(take(1)).subscribe(result => {
      this.verificationResult = result;
      this.verifying = false;
    }, () => {
      this.verifying = false;
    });
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  public getStatusClass(): string {
    if (!this.verificationResult) {
      return '';
    }
    if (this.verificationResult.registered) {
      return 'status-ok';
    }
    if (this.verificationResult.status === 'RECALLED' || this.verificationResult.status === 'EXPIRED') {
      return 'status-warn';
    }
    return 'status-error';
  }
}
