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
    CheckInfoComponent,
    ThrobberComponent,
  ],
  templateUrl: './exhibition.component.html',
  styleUrl: './exhibition.component.scss'
})
export class ExhibitionComponent implements OnInit, OnDestroy {

  public loading = true; // загружена ли информация для страницы
  public form: UntypedFormGroup; // форма
  public active: number; // активный шаг формы
  public optionsCat: IValueCat[]; // список котов

  // TODO: подключить API — список выставок пока захардкожен, эндпоинта на бэке ещё нет
  public exhibitionOptions = [
    { id: 1, text: 'Международная выставка «Кубок Пушистых» — 15.08.2026, Москва' },
    { id: 2, text: 'Выставка WCF «Мурлыка» — 02.09.2026, Санкт-Петербург' },
    { id: 3, text: 'Монопородная выставка TICA «Сиамский стиль» — 20.09.2026, Казань' },
  ];

  public exhibitionClassOptions = [
    { id: 'kitten', text: 'Котята' },
    { id: 'junior', text: 'Юниоры' },
    { id: 'open', text: 'Открытый класс' },
    { id: 'veteran', text: 'Ветераны' },
  ];

  private idService: string; // мнемоника услуги
  private steps: IStep[]; // шаги формы
  private subscriptions: Subscription[] = [];

  /**
   * Возвращает преобразованное значение формы для отображения заполненных данных.
   * Согласие с правилами (checkbox) в предпросмотр не выводим — булево "true" пользователю ни о чём не говорит.
   */
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

    this.loading = false;
  }

  /**
   * Возвращает json в виде строки
   * @param type
   * @param index
   */
  public getItem(type: 'cat' | 'exhibition' | 'exhibitionClass', index: number): string {
    if (type === 'cat') {
      return JSON.stringify(this.optionsCat[index]);
    }
    if (type === 'exhibition') {
      return JSON.stringify(this.exhibitionOptions[index]);
    }
    return JSON.stringify(this.exhibitionClassOptions[index]);
  }

  /**
   * Запоминаем имена выбранных файлов в контроле формы (для превью и валидации).
   * Сама отправка бинарных файлов на бэкенд — отдельная задача (TODO: подключить API),
   * т.к. текущий общий OrderService.saveOrder умеет отправлять только JSON.
   * @param event
   * @param controlName
   */
  public onFilesSelected(event: Event, controlName: 'documents' | 'photos'): void {
    const input = event.target as HTMLInputElement;
    const names = input.files ? Array.from(input.files).map(f => f.name).join(', ') : '';
    this.getControl(1, controlName).setValue(names);
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
