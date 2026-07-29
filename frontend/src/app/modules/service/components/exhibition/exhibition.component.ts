import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { IValueCat } from '@models/cat.model';
import { IExhibition } from '@models/exhibition.model';
import { IValue } from '@models/common.model';
import { Subscription, take } from 'rxjs';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute } from '@angular/router';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { ExhibitionService } from '@services/exhibition/exhibition.service';
import { IStep } from '@models/step.model';
import { ThrobberComponent } from '@components/throbber/throbber.component';

export enum FormMap {
  exhibition = 'Выставка',
  cat = 'Кличка',
  exhibitionClass = 'Класс участия',
  color = 'Окрас',
  telephone = 'Телефон для связи',
  email = 'Email для связи',
  documents = 'Документы',
  photos = 'Фотографии',
}

@Component({
  selector: 'app-exhibition',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CheckInfoComponent,
    ThrobberComponent,
  ],
  templateUrl: './exhibition.component.html',
  styleUrl: './exhibition.component.scss'
})
export class ExhibitionComponent implements OnInit, OnDestroy {

  public loading = true;
  public form: UntypedFormGroup;
  public active: number;
  public optionsCat: IValueCat[];
  public exhibitionOptions: IValue[] = [];

  public exhibitionClassOptions = [
    { id: 'kitten', text: 'Котята' },
    { id: 'junior', text: 'Юниоры' },
    { id: 'open', text: 'Открытый класс' },
    { id: 'veteran', text: 'Ветераны' },
  ];

  public reviewExhibitionId: number | null = null;
  public reviewRating = 5;
  public reviewComment = '';
  public reviewSubmitted = false;

  private idService: string;
  private steps: IStep[];
  private subscriptions: Subscription[] = [];

  public get getResult() {
    const rawValue = this.form.getRawValue();
    const previewValue = {
      ...rawValue,
      1: { ...rawValue[1] }
    };
    delete previewValue[1].agreement;

    return this.serviceInfo.prepareDataForPreview(previewValue, this.steps, FormMap);
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private constantService: ConstantsService,
    private exhibitionService: ExhibitionService,
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

      this.getExhibitionOptions();
    });
  }

  private getExhibitionOptions(): void {
    this.exhibitionService.getExhibitions().pipe(
      take(1)
    ).subscribe((res: IExhibition[]) => {
      this.exhibitionOptions = res.map(item => ({
        id: item.id,
        text: `${item.name} — ${item.date}, ${item.city}`
      }));

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
        exhibition: [JSON.stringify(this.exhibitionOptions[0]), [Validators.required]],
        cat: [JSON.stringify(this.optionsCat[0]), [Validators.required]],
        exhibitionClass: [JSON.stringify(this.exhibitionClassOptions[0]), [Validators.required]],
        color: ['', [Validators.required]],
        telephone: ['', [Validators.required, Validators.pattern(/^[\d]{11}$/)]],
        email: ['', [Validators.email]],
      }),
      1: this.fb.group({
        documents: ['', [Validators.required]], // TODO: подключить API — сейчас хранится только имя файла
        photos: [''], // TODO: подключить API
        agreement: [false, [Validators.requiredTrue]],
      }),
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });

    this.reviewExhibitionId = this.exhibitionOptions[0]?.id ?? null;
    this.loading = false;
  }

  public getItem(type: 'cat' | 'exhibition' | 'exhibitionClass', index: number): string {
    if (type === 'cat') {
      return JSON.stringify(this.optionsCat[index]);
    }
    if (type === 'exhibition') {
      return JSON.stringify(this.exhibitionOptions[index]);
    }
    return JSON.stringify(this.exhibitionClassOptions[index]);
  }

  // TODO: подключить апи — пока сохраняем только имена файлов, не сами файлы
  public onFilesSelected(event: Event, controlName: 'documents' | 'photos'): void {
    const input = event.target as HTMLInputElement;
    const names = input.files ? Array.from(input.files).map(f => f.name).join(', ') : '';
    this.getControl(1, controlName).setValue(names);
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  public submitReview(): void {
    if (!this.reviewExhibitionId) {
      return;
    }

    this.exhibitionService.submitReview(this.reviewExhibitionId, {
      exhibitionId: this.reviewExhibitionId,
      rating: this.reviewRating,
      comment: this.reviewComment,
    }).pipe(
      take(1)
    ).subscribe(() => {
      this.reviewSubmitted = true;
    });
  }

}
