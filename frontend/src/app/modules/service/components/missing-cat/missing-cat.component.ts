import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription, take } from 'rxjs';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { IStep } from '@models/step.model';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { IValueCat } from '@models/cat.model';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export enum FormMap {
  cat = 'Котик',
  catName = 'Кличка котика',
  breed = 'Порода',
  color = 'Окрас',
  age = 'Возраст (месяцев)',
  gender = 'Пол',
  distinctiveFeatures = 'Особые приметы',
  lastSeenDate = 'Дата пропажи',
  lastSeenPlace = 'Место пропажи',
  mapLocation = 'Местоположение на карте',
  phone = 'Телефон для связи',
  additionalInfo = 'Дополнительная информация',
  status = 'Статус заявки'
}

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
    CommonModule,
    CheckInfoComponent,
    ThrobberComponent,
  ],
  templateUrl: './missing-cat.component.html',
  styleUrl: './missing-cat.component.scss'
})
export class MissingCatComponent implements OnInit, OnDestroy {
  public loading = true;
  public submitting = false;
  public form: UntypedFormGroup;
  public active: number = 0;
  public optionsCat: IValueCat[] = [];
  public uploadedPhotos: IUploadedFile[] = [];
  public uploadedDocuments: IUploadedFile[] = [];


  public genderOptions = [
    { id: 'male', text: 'Мальчик' },
    { id: 'female', text: 'Девочка' },
    { id: 'unknown', text: 'Неизвестно' },
  ];


  public statusOptions = [
    { id: 'searching', text: 'В поиске' },
    { id: 'found', text: 'Найден' },
    { id: 'closed', text: 'Закрыта (без результата)' },
  ];

  private idService: string;
  private steps: IStep[];
  private subscriptions: Subscription[] = [];


  public mapCenter = { lat: 55.751244, lng: 37.618423 };
  public mapZoom = 12;
  public markerPosition: { lat: number, lng: number } | null = null;

  public get getResult() {
    const rawValue = this.form.getRawValue();
    const result = this.serviceInfo.prepareDataForPreview(rawValue, this.steps, FormMap);

    return {
      ...result,
      'Фотографии': this.uploadedPhotos.length > 0 ? `${this.uploadedPhotos.length} фото загружено` : 'Не загружено'
    };
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private router: Router,
    private constantService: ConstantsService,
    private http: HttpClient,
  ) {}

  public ngOnInit(): void {
    this.getCatOptions();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(item => item.unsubscribe());
  }

  private getCatOptions(): void {
    this.constantService.getCatOptionsAll().pipe(
      take(1)
    ).subscribe((res: IValueCat[]) => {
      this.optionsCat = res;
      this.prepareService();
    });
  }

  private prepareService(): void {
    this.route.data.pipe(take(1)).subscribe(res => {
      this.idService = res['idService'];

      this.serviceInfo.getSteps(this.idService).pipe(take(1)).subscribe(res => {
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
        mapLocation: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern(/^[\d]{11}$/)]],
        additionalInfo: [''],
      }),
      2: this.fb.group({
        status: [JSON.stringify(this.statusOptions[0]), [Validators.required]],
      }),
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });

    this.loading = false;
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

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

  public nextStep(): void {
    if (this.active < 3) {
      this.active++;
      this.serviceInfo.setActiveStep(this.idService, this.active);
    }
  }

  public prevStep(): void {
    if (this.active > 0) {
      this.active--;
      this.serviceInfo.setActiveStep(this.idService, this.active);
    }
  }



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

  public removePhoto(index: number): void {
    this.uploadedPhotos.splice(index, 1);
  }



  public onMapClick(event: any): void {
    if (event && event.coords) {
      this.markerPosition = {
        lat: event.coords.lat,
        lng: event.coords.lng
      };
      this.form.get('1.mapLocation')?.setValue(`${this.markerPosition.lat}, ${this.markerPosition.lng}`);
    }
  }

  public openMap(): void {
    // Открываем карту в новом окне (для выбора координат)
    window.open('https://yandex.ru/maps', '_blank');
  }



  public submitForm(): void {
    if (this.form.valid) {
      this.submitting = true;
      const formData = new FormData();


      const formValue = this.form.getRawValue();
      formData.append('data', JSON.stringify(formValue));


      this.uploadedPhotos.forEach((item, index) => {
        formData.append(`photo_${index}`, item.file);
      });


      this.uploadedDocuments.forEach((item, index) => {
        formData.append(`document_${index}`, item.file);
      });


      this.http.post('/api/missing-cat', formData).subscribe({
        next: (response) => {
          this.submitting = false;
          alert('✅ Заявка о пропавшем котике успешно отправлена!');
          console.log('Ответ сервера:', response);
          this.router.navigate(['/missing-cat-list']);
        },
        error: (err) => {
          this.submitting = false;
          console.error('Ошибка отправки:', err);
          alert(' Ошибка при отправке заявки. Попробуйте позже.');
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }


  public get hasPhotos(): boolean {
    return this.uploadedPhotos.length > 0;
  }
}
