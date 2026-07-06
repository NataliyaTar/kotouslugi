import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
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
import { PassportViewComponent } from '@components/passport-view/passport-view.component';

export enum FormMap {
  cat = 'Кличка',
  chipNumber = 'Номер чипа',
  kennelName = 'Питомник',
  vaccineName = 'Вакцина',
  drugBatchCode = 'Код партии препарата',
  vaccinationDate = 'Дата прививки',
  veterinarian = 'Ветеринар',
  clinic = 'Клиника',
  relativeCat = 'Родственник',
  relationType = 'Тип родства',
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
    FormsModule,
    CheckInfoComponent,
    ThrobberComponent,
    PassportViewComponent,
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
  public searchQuery = '';
  public searchResults: IPassportDetail[] = [];
  public viewPassport: IPassportDetail;
  public searching = false;
  public searched = false;
  public searchError = '';

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
        relativeCat: [this.optionsCat.length > 1 ? JSON.stringify(this.optionsCat[1]) : ''],
        relationType: [JSON.stringify(this.relationOptions[0])],
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

  public searchPassport(): void {
    const query = this.searchQuery.trim();
    if (!query) {
      return;
    }
    if (!/^\d+$/.test(query)) {
      this.searchError = 'Поиск доступен только по номеру паспорта или номеру чипа (цифры)';
      this.searchResults = [];
      this.viewPassport = null;
      this.searched = false;
      return;
    }
    this.searchError = '';

    this.searching = true;
    this.searched = false;
    this.viewPassport = null;
    this.searchResults = [];

    this.passportService.searchPassports(query).pipe(take(1)).subscribe({
      next: results => {
        this.searchResults = results || [];
        this.searched = true;
        this.searching = false;
        if (this.searchResults.length === 1) {
          this.viewPassport = this.searchResults[0];
        }
      },
      error: () => {
        this.searchResults = [];
        this.searched = true;
        this.searching = false;
      }
    });
  }

  public selectPassport(passport: IPassportDetail): void {
    this.viewPassport = passport;
  }

  public clearSearch(): void {
    this.searchQuery = '';
    this.searchError = '';
    this.searchResults = [];
    this.viewPassport = null;
    this.searched = false;
  }

  public onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchPassport();
    }
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

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }
}
