import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { IValueCat } from '@models/cat.model';
import { ERelationMap, IPassportDetail } from '@models/passport.model';
import { Subscription, take } from 'rxjs';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute } from '@angular/router';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { IStep } from '@models/step.model';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { PassportService } from '@services/passport/passport.service';
import { RouterModule } from '@angular/router';

export enum FormMap {
  cat = 'Кличка',
  chipNumber = 'Номер чипа',
  kennelName = 'Питомник',
  vaccineName = 'Вакцина',
  drugBatchCode = 'Код партии препарата',
  vaccinationDate = 'Дата прививки',
  veterinarian = 'Ветеринар',
  clinic = 'Клиника',
  relativesSummary = 'Родственные связи',
  diagnosis = 'Диагноз',
  treatment = 'Лечение',
  recordDate = 'Дата записи',
  recovered = 'Выздоровел'
}

@Component({
  selector: 'app-animal-passport',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CheckInfoComponent,
    ThrobberComponent,
  ],
  templateUrl: './animal-passport.component.html',
  styleUrl: './animal-passport.component.scss'
})
export class AnimalPassportComponent implements OnInit, OnDestroy {

  public loading = true;
  public form: UntypedFormGroup;
  public active: number;
  public optionsCat: IValueCat[];
  public relationOptions: { id: string; text: string }[] = [
    { id: 'FATHER', text: ERelationMap.FATHER },
    { id: 'MOTHER', text: ERelationMap.MOTHER },
    { id: 'CHILD', text: ERelationMap.CHILD },
    { id: 'SIBLING', text: ERelationMap.SIBLING },
  ];
  public existingPassport: IPassportDetail;

  private idService: string;
  private steps: IStep[];
  private subscriptions: Subscription[] = [];

  public get getResult() {
    const raw = this.form.getRawValue();
    const previewRaw = {
      ...raw,
      2: {
        ...raw[2],
        relativesSummary: this.getRelativesPreview()
      }
    };
    delete previewRaw[2].relatives;
    return this.serviceInfo.prepareDataForPreview(previewRaw, this.steps, FormMap);
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private constantService: ConstantsService,
    private passportService: PassportService,
  ) {}

  public ngOnInit(): void {
    this.getCatOption();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(item => item.unsubscribe());
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
        cat: [JSON.stringify(this.optionsCat[0]), [Validators.required]],
        chipNumber: ['', [Validators.required, Validators.maxLength(32)]],
        kennelName: ['', [Validators.maxLength(128)]],
      }),
      1: this.fb.group({
        vaccineName: ['', [Validators.required, Validators.maxLength(128)]],
        drugBatchCode: ['', [Validators.maxLength(32)]],
        vaccinationDate: ['', [Validators.required]],
        veterinarian: ['', [Validators.maxLength(128)]],
        clinic: ['', [Validators.maxLength(128)]],
      }),
      2: this.fb.group({
        relatives: this.fb.array([this.createRelativeGroup()]),
      }),
      3: this.fb.group({
        diagnosis: [''],
        treatment: ['', [Validators.maxLength(256)]],
        recordDate: [''],
        recovered: [false],
      }),
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });

    this.loadExistingPassport();
    this.loading = false;
  }

  private loadExistingPassport(): void {
    const catValue = this.getSelectedCat();
    if (!catValue) {
      return;
    }
    this.passportService.getPassportByCat(catValue.id).pipe(take(1)).subscribe(passport => {
      this.existingPassport = passport;
    });
  }

  public onCatChange(): void {
    this.clearSelfRelations();
    this.loadExistingPassport();
  }

  private getSelectedCat(): IValueCat | null {
    try {
      return JSON.parse(this.getControl(0, 'cat').value);
    } catch {
      return this.optionsCat?.[0] ?? null;
    }
  }

  public getItem(type: 'cat' | 'relation', index: number): string {
    if (type === 'cat') {
      return JSON.stringify(this.optionsCat[index]);
    }
    return JSON.stringify(this.relationOptions[index]);
  }

  public toJson(value: unknown): string {
    return JSON.stringify(value);
  }

  public getRelativeOptions(): IValueCat[] {
    const selectedCat = this.getSelectedCat();
    if (!selectedCat) {
      return this.optionsCat ?? [];
    }
    return (this.optionsCat ?? []).filter(option => option.id !== selectedCat.id);
  }

  public get relativesArray(): FormArray {
    return this.form.get('2.relatives') as FormArray;
  }

  public addRelative(): void {
    this.relativesArray.push(this.createRelativeGroup());
  }

  public removeRelative(index: number): void {
    if (this.relativesArray.length === 1) {
      this.relativesArray.at(0).patchValue({
        relativeCat: '',
        relationType: JSON.stringify(this.relationOptions[0])
      });
      return;
    }
    this.relativesArray.removeAt(index);
  }

  private createRelativeGroup(): UntypedFormGroup {
    return this.fb.group({
      relativeCat: [''],
      relationType: [JSON.stringify(this.relationOptions[0])],
    });
  }

  private getRelativesPreview(): string {
    const values = this.relativesArray.getRawValue() as Array<{ relativeCat: string; relationType: string }>;
    const lines = values
      .map(item => {
        if (!item?.relativeCat) {
          return '';
        }
        const relative = this.parseJson<{ text?: string }>(item.relativeCat);
        const relation = this.parseJson<{ text?: string }>(item.relationType);
        if (!relative?.text) {
          return '';
        }
        return `${relation?.text ?? 'Родство'}: ${relative.text}`;
      })
      .filter(Boolean);

    return lines.length ? lines.join('; ') : '-';
  }

  private clearSelfRelations(): void {
    const selectedCat = this.getSelectedCat();
    if (!selectedCat) {
      return;
    }
    this.relativesArray.controls.forEach(control => {
      const relativeRaw = control.get('relativeCat')?.value as string;
      const relative = this.parseJson<IValueCat>(relativeRaw);
      if (relative?.id === selectedCat.id) {
        control.patchValue({ relativeCat: '' });
      }
    });
  }

  private parseJson<T>(value: string): T | null {
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }
}
