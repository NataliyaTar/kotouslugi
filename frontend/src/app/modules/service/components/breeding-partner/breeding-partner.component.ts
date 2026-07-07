import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { IValueCat } from '@models/cat.model';
import { Subscription, take } from 'rxjs';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute } from '@angular/router';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { IStep } from '@models/step.model';
import { ThrobberComponent } from '@components/throbber/throbber.component';

export enum FormMap {
  cat = 'Кличка',
  city = 'Город',
  color = 'Окрас',
  pedigreeNumber = 'Номер родословной',
  photos = 'Фотографии',
  partnerBreed = 'Порода партнёра',
  partnerAge = 'Возраст партнёра',
  partnerCity = 'Город партнёра',
  partnerPedigreeRequired = 'Только с родословной',
  comment = 'Комментарий',
}

@Component({
  selector: 'app-breeding-partner',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent,
    ThrobberComponent,
  ],
  templateUrl: './breeding-partner.component.html',
  styleUrl: './breeding-partner.component.scss'
})
export class BreedingPartnerComponent implements OnInit, OnDestroy {

  public loading = true;
  public form: UntypedFormGroup;
  public active: number;
  public optionsCat: IValueCat[];
  public breedOptions = this.constantService.breedOptions;

  private idService: string;
  private steps: IStep[];
  private subscriptions: Subscription[] = [];

  public get getResult() {
    const rawValue = this.form.getRawValue();
    const previewValue = {
      ...rawValue,
      1: { ...rawValue[1] }
    };
    previewValue[1].partnerPedigreeRequired = previewValue[1].partnerPedigreeRequired ? 'Да' : 'Нет';

    return this.serviceInfo.prepareDataForPreview(previewValue, this.steps, FormMap);
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
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    })
  }

  private getCatOption(): void {
    this.constantService.getCatOptionsAll().pipe(
      take(1)
    ).subscribe((res: IValueCat[]) => {
      this.optionsCat = res;

      this.prepareService();
    });
  }

  private prepareService(): void {
    this.route.data.pipe(
      take(1)
    ).subscribe(res => {
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
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      0: this.fb.group({
        cat: [JSON.stringify(this.optionsCat[0]), [Validators.required]],
        city: ['', [Validators.required]],
        color: ['', [Validators.required]],
        pedigreeNumber: [''],
        photos: [''], // TODO: подключить API — сейчас хранится только имя файла
      }),
      1: this.fb.group({
        partnerBreed: [JSON.stringify(this.breedOptions[0]), [Validators.required]],
        partnerAge: ['', [Validators.required]],
        partnerCity: ['', [Validators.required]],
        partnerPedigreeRequired: [false],
        comment: [''],
      }),
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });

    this.loading = false;
  }

  public getItem(type: 'cat' | 'breed', index: number): string {
    if (type === 'cat') {
      return JSON.stringify(this.optionsCat[index]);
    }
    return JSON.stringify(this.breedOptions[index]);
  }

  // Реальная отправка файлов на бэкенд — отдельная задача (TODO: подключить API):
  // текущий общий OrderService.saveOrder умеет отправлять только JSON, поэтому пока
  // сохраняем в контрол только имена файлов (для превью и валидации)
  public onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const names = input.files ? Array.from(input.files).map(f => f.name).join(', ') : '';
    this.getControl(0, 'photos').setValue(names);
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

}
