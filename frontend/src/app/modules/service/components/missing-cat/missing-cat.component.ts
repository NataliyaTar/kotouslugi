import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder, FormControl,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { Subscription, take } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { IValueCat } from '@models/cat.model';
import { IStep } from '@models/step.model';
import { ThrobberComponent } from '@components/throbber/throbber.component';

export enum FormMap { // маппинг названия поля - значение
  cat = 'Котик',
  catName = 'Кличка котика',
  breed = 'Порода',
  color = 'Окрас',
  age = 'Возраст',
  gender = 'Пол',
  distinctiveFeatures = 'Особые приметы',
  lastSeenDate = 'Дата пропажи',
  lastSeenPlace = 'Место пропажи',
  phone = 'Телефон для связи',
  additionalInfo = 'Дополнительная информация',
  status = 'Статус заявки'
}

// Интерфейс для загруженных файлов
interface IUploadedFile {
  file: File;
  url: string;
  name: string;
}

@Component({
  selector: 'app-missing-cat',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent,
    ThrobberComponent,
    RouterModule,
  ],
  templateUrl: './missing-cat.component.html',
  styleUrl: './missing-cat.component.scss'
})
export class MissingCatComponent implements OnInit, OnDestroy {
  public loading = true; // загружена ли информация для страницы
  public notEnoughCats = false; // достаточно ли котиков для услуги
  public form: UntypedFormGroup; // форма
  public active: number; // активный шаг формы
  public optionsCat: IValueCat[]; // список котов
  public uploadedPhotos: IUploadedFile[] = []; // загруженные фотографии

  // Варианты пола
  public genderOptions = [
    { id: 'male', text: 'Мальчик' },
    { id: 'female', text: 'Девочка' },
    { id: 'unknown', text: 'Неизвестно' },
  ];

  // Варианты статуса заявки
  public statusOptions = [
    { id: 'searching', text: 'В поиске' },
    { id: 'found', text: 'Найден' },
    { id: 'closed', text: 'Закрыта (без результата)' },
  ];

  private idService: string; // мнемоника услуги
  private steps: IStep[]; // шаги формы
  private subscriptions: Subscription[] = [];

  /**
   * Возвращает преобразованное значение формы для отображения заполненных данных
   */
  public get getResult() {
    return this.serviceInfo.prepareDataForPreview(this.form.getRawValue(), this.steps, FormMap);
  }

  /**
   * Проверяет, есть ли загруженные фотографии
   */
  public get hasPhotos(): boolean {
    return this.uploadedPhotos.length > 0;
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private constantService: ConstantsService,
  ) {}

  public ngOnInit(): void {
    this.getCatOptions();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    });
  }

  /**
   * Проверяем есть ли возможность использовать форму.
   * Запрашиваем список котов
   */
  public getCatOptions(): void {
    this.constantService.getCatOptionsAll().pipe(
      take(1)
    ).subscribe(res => {
      if (!res.length) {
        this.notEnoughCats = true;
        this.loading = false;
      } else {
        this.optionsCat = res;
        this.prepareService();
      }
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
    const defaultCat = this.optionsCat.length > 0 ? JSON.stringify(this.optionsCat[0]) : '';

    this.form = this.fb.group({
      0: this.fb.group({
        cat: [defaultCat],
        catName: ['', [Validators.required]],
        breed: ['', [Validators.required]],
        color: ['', [Validators.required]],
        age: ['', [Validators.required, Validators.min(1), Validators.max(240)]],
        gender: [JSON.stringify(this.genderOptions[0]), [Validators.required]],
        distinctiveFeatures: [''],
      }),
      1: this.fb.group({
        lastSeenDate: ['', [Validators.required]],
        lastSeenPlace: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern(/^[\d]{11}$/)]],
        additionalInfo: [''],
      }),
      2: this.fb.group({
        status: [JSON.stringify(this.statusOptions[0]), [Validators.required]],
      }),
    });

    // сеттим значение формы в сервис
    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });

    this.loading = false;
  }

  /**
   * Возвращает json в виде строки
   * @param index
   */
  public getItem(type: 'cat' | 'gender' | 'status', index: number): string {
    if (type === 'cat') {
      return JSON.stringify(this.optionsCat[index]);
    }
    if (type === 'gender') {
      return JSON.stringify(this.genderOptions[index]);
    }
    if (type === 'status') {
      return JSON.stringify(this.statusOptions[index]);
    }
    return '';
  }

  /**
   * Возвращает контрол формы
   * @param step
   * @param id
   */
  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  /**
   * Запоминаем выбранные файлы и отображаем превью
   */
  public onPhotosSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.uploadedPhotos.push({
              file: file,
              url: e.target?.result as string,
              name: file.name
            });
          };
          reader.readAsDataURL(file);
        }
      }
    }
    input.value = '';
  }

  /**
   * Удаляет фотографию по индексу
   */
  public removePhoto(index: number): void {
    this.uploadedPhotos.splice(index, 1);
  }
}
