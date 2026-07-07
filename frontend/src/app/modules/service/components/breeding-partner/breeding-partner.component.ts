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

  public loading = true; // загружена ли информация для страницы
  public form: UntypedFormGroup; // форма
  public active: number; // активный шаг формы
  public optionsCat: IValueCat[]; // список котов
  public breedOptions = this.constantService.breedOptions; // список пород (переиспользуем существующий справочник)

  private idService: string; // мнемоника услуги
  private steps: IStep[]; // шаги формы
  private subscriptions: Subscription[] = [];

  /**
   * Возвращает преобразованное значение формы для отображения заполненных данных.
   * Чекбокс "только с родословной" — реальный критерий поиска (в отличие от чекбокса
   * согласия в exhibition.component.ts), поэтому показываем его, но не как булево
   * true/false, а человеческим "Да"/"Нет".
   */
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

  /**
   * Запрашиваем отформатированный список котов
   */
  private getCatOption(): void {
    this.constantService.getCatOptionsAll().pipe(
      take(1)
    ).subscribe((res: IValueCat[]) => {
      this.optionsCat = res;

      this.prepareService();
    });
  }

  /**
   * Получаем мнемонику формы, запрашиваем шаги формы
   * @private
   */
  private prepareService(): void {
    this.route.data.pipe(
      take(1)
    ).subscribe(res => {
      this.idService = res['idService'];

      // запрашиваем шаги формы
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

  /**
   * Инициализация формы
   * @private
   */
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

  /**
   * Возвращает json в виде строки
   * @param type
   * @param index
   */
  public getItem(type: 'cat' | 'breed', index: number): string {
    if (type === 'cat') {
      return JSON.stringify(this.optionsCat[index]);
    }
    return JSON.stringify(this.breedOptions[index]);
  }

  /**
   * Запоминаем имена выбранных файлов в контроле формы (для превью и валидации).
   * Сама отправка бинарных файлов на бэкенд — отдельная задача (TODO: подключить API).
   * @param event
   */
  public onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const names = input.files ? Array.from(input.files).map(f => f.name).join(', ') : '';
    this.getControl(0, 'photos').setValue(names);
  }

  /**
   * Возвращает контрол формы
   * @param step
   * @param id
   */
  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

}
