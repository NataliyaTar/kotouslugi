import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { ICat, IValueCat } from '@models/cat.model';
import { Subscription, take } from 'rxjs';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute } from '@angular/router';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { CatService } from '@services/cat/cat.service';
import { IStep } from '@models/step.model';
import { ThrobberComponent } from '@components/throbber/throbber.component';

export enum FormMap {
  cat = 'Кличка',
  city = 'Город',
  hasPedigree = 'Есть родословная',
  photos = 'Фотографии',
  targetBreed = 'Порода партнёра',
  targetCity = 'Город партнёра',
  minAge = 'Возраст партнёра от',
  maxAge = 'Возраст партнёра до',
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

  // TODO: пока хардкод, для вида — подбора партнёров как функции не существует
  public mockCandidates = [
    { id: 1, name: 'Барсик', photo: 'cat.png', breed: 'Мейн-кун', age: 3, city: 'Москва' },
    { id: 2, name: 'Мурка', photo: 'cat2.png', breed: 'Британская короткошёрстная', age: 2, city: 'Санкт-Петербург' },
    { id: 3, name: 'Рыжик', photo: 'awww.png', breed: 'Сфинкс', age: 4, city: 'Казань' },
  ];
  public selectedMockCandidateIds = new Set<number>();
  public sentMockRequestIds = new Set<number>();

  private idService: string;
  private steps: IStep[];
  private subscriptions: Subscription[] = [];

  public get getResult() {
    const rawValue = this.form.getRawValue();
    const previewValue = {
      ...rawValue,
      0: { ...rawValue[0] }
    };
    previewValue[0].hasPedigree = previewValue[0].hasPedigree ? 'Да' : 'Нет';
    previewValue[0].photos = this.truncateFileName(previewValue[0].photos);

    return this.serviceInfo.prepareDataForPreview(previewValue, this.steps, FormMap);
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private constantService: ConstantsService,
    private catService: CatService,
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
    this.catService.getCatList().pipe(
      take(1)
    ).subscribe((res: ICat[]) => {
      this.optionsCat = res.map(item => ({ id: item.id, text: item.name }));

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
        hasPedigree: [false],
        photos: [''], // TODO: подключить API — сейчас хранится только имя файла
      }),
      1: this.fb.group({
        targetBreed: [JSON.stringify(this.breedOptions[0]), [Validators.required]],
        targetCity: ['', [Validators.required]],
        minAge: ['', [Validators.required]],
        maxAge: ['', [Validators.required]],
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

  // TODO: подключить апи — пока сохраняем только имена файлов, не сами файлы
  public onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const names = input.files ? Array.from(input.files).map(f => f.name).join(', ') : '';
    this.getControl(0, 'photos').setValue(names);
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  // Показываем короткое имя, чтобы длинное/странное имя файла не ломало вёрстку —
  // сама форма при этом хранит полное имя без изменений
  public getFileNameDisplay(step: number, id: string): string {
    return this.truncateFileName(this.getControl(step, id).value) || ' ';
  }

  private truncateFileName(value: string): string {
    if (!value) {
      return '';
    }
    return value.length > 30 ? `${value.slice(0, 20)}…${value.slice(-6)}` : value;
  }

  public toggleMockCandidate(id: number): void {
    if (this.selectedMockCandidateIds.has(id)) {
      this.selectedMockCandidateIds.delete(id);
    } else {
      this.selectedMockCandidateIds.add(id);
    }
  }

  public sendMockRequests(): void {
    this.selectedMockCandidateIds.forEach(id => this.sentMockRequestIds.add(id));
    this.selectedMockCandidateIds.clear();
  }

}
