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

export enum FormMap {
  cat = 'Котик',
  catName = 'Кличка котика',
  breed = 'Порода',
  age = 'Возраст',
  gender = 'Пол',
  distinctiveFeatures = 'Особые приметы',
  lastSeenDate = 'Дата пропажи',
  lastSeenPlace = 'Место пропажи',
  phone = 'Телефон для связи',
  additionalInfo = 'Дополнительная информация'
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
    CheckInfoComponent,
    ThrobberComponent,
    RouterModule,
  ],
  templateUrl: './missing-cat.component.html',
  styleUrl: './missing-cat.component.scss'
})
export class MissingCatComponent implements OnInit, OnDestroy {
  public loading = true;
  public notEnoughCats = false;
  public form!: UntypedFormGroup;
  public active: number = 0;
  public optionsCat: IValueCat[] = [];
  public uploadedPhotos: IUploadedFile[] = [];
  public isCatSelected: boolean = false;

  public genderOptions = [
    { id: 'male', text: 'Мальчик' },
    { id: 'female', text: 'Девочка' },
    { id: 'unknown', text: 'Неизвестно' }
  ];

  private breedMap: Record<string, string> = {
    'siamese': 'Сиамская',
    'british_shorthair': 'Британская короткошерстная',
    'maine_coon': 'Мейн-кун',
    'persian': 'Персидская',
    'sphinx': 'Сфинкс',
    'scottish_fold': 'Шотландская вислоухая',
    'russian_blue': 'Русская голубая',
    'munchkin': 'Манчкин'
  };

  private idService: string = 'missing-cat';
  private steps: IStep[] = [];
  private subscriptions: Subscription[] = [];

  public get getResult() {
    const rawValue = this.form.getRawValue();
    const previewValue = {
      ...rawValue,
      1: { ...rawValue[1] }
    };
    const result = this.serviceInfo.prepareDataForPreview(previewValue, this.steps, FormMap);
    return {
      ...result,
      'Фото': this.uploadedPhotos.length > 0 ? this.uploadedPhotos[0].url : null
    };
  }

  public get hasPhotos(): boolean {
    return this.uploadedPhotos.length > 0;
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private constantService: ConstantsService
  ) {}

  public ngOnInit(): void {
    this.getCatOptions();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(item => item.unsubscribe());
  }

  private getCatOptions(): void {
    this.constantService.getCatOptionsAll()
      .pipe(take(1))
      .subscribe((res: IValueCat[]) => {
        this.constantService.getCatOptionsFull()
          .pipe(take(1))
          .subscribe((fullRes: any[]) => {
            this.optionsCat = res.map((item, index) => ({
              id: item.id,
              text: item.text,
              breed: fullRes[index]?.breed || '',
              age: fullRes[index]?.age || '',
              sex: fullRes[index]?.sex || ''
            }));
            this.prepareService();
          });
      });
  }

  private prepareService(): void {
    this.route.data
      .pipe(take(1))
      .subscribe(res => {
        this.idService = res['idService'] || this.idService;

        this.serviceInfo.getSteps(this.idService)
          .pipe(take(1))
          .subscribe(res => {
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

  private dateValidator(control: FormControl) {
    if (!control.value) return null;

    const parts = control.value.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const selectedDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate > today ? { futureDate: true } : null;
  }

  private initForm(): void {
    this.form = this.fb.group({
      0: this.fb.group({
        cat: [''],
        catName: ['', [Validators.required]],
        breed: ['', [Validators.required]],
        age: ['', [Validators.required, Validators.min(1)]],
        gender: [JSON.stringify(this.genderOptions[0]), [Validators.required]],
        distinctiveFeatures: ['']
      }),
      1: this.fb.group({
        lastSeenDate: ['', [Validators.required, this.dateValidator]],
        lastSeenPlace: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
        additionalInfo: ['']
      })
    });

    this.isCatSelected = false;
    this.enableFields(true);

    this.form.get('0.cat')?.valueChanges.subscribe(value => {
      this.onCatSelect(value);
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });

    this.loading = false;
  }

  private fillCatData(cat: any): void {
    if (!cat) return;

    this.form.get('0.catName')?.setValue(cat.name || cat.text || '');

    let breedText = cat.breed || '';
    const mappedBreed = this.breedMap[breedText];
    if (mappedBreed) {
      breedText = mappedBreed;
    }
    this.form.get('0.breed')?.setValue(breedText);

    this.form.get('0.age')?.setValue(cat.age ?? '');
    this.form.get('0.gender')?.setValue(JSON.stringify(this.genderOptions[0]));

    if (cat.sex) {
      const genderOption = this.genderOptions.find(g => g.id === cat.sex);
      if (genderOption) {
        this.form.get('0.gender')?.setValue(JSON.stringify(genderOption));
      }
    }
  }

  public onCatSelect(value: string): void {
    if (!value) {
      this.isCatSelected = false;
      this.enableFields(true);
      this.form.get('0.catName')?.setValue('');
      this.form.get('0.breed')?.setValue('');
      this.form.get('0.age')?.setValue('');
      this.form.get('0.gender')?.setValue(JSON.stringify(this.genderOptions[0]));
      return;
    }

    try {
      const catData = JSON.parse(value);
      const selectedCat = this.optionsCat.find(cat => cat.id === catData.id);

      if (selectedCat) {
        this.isCatSelected = true;
        this.fillCatData(selectedCat);
        this.enableFields(false);
      } else {
        this.isCatSelected = false;
        this.enableFields(true);
      }
    } catch (e) {
      console.error('Ошибка парсинга данных котика', e);
      this.isCatSelected = false;
      this.enableFields(true);
    }
  }

  private enableFields(enabled: boolean): void {
    ['catName', 'breed', 'age', 'gender'].forEach(field => {
      const control = this.form.get(`0.${field}`);
      if (control) {
        enabled ? control.enable() : control.disable();
      }
    });
  }

  public getCatName(): string {
    const value = this.form.get('0.cat')?.value;
    if (!value) return 'Не выбран';

    try {
      const catData = JSON.parse(value);
      return catData.text || 'Не выбран';
    } catch {
      return 'Не выбран';
    }
  }

  public getGenderText(): string {
    const value = this.form.get('0.gender')?.value;
    if (!value) return '—';

    try {
      const genderData = JSON.parse(value);
      const option = this.genderOptions.find(g => g.id === genderData.id);
      return option ? option.text : '—';
    } catch {
      return '—';
    }
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  public getItem(type: 'cat' | 'gender', index: number): string {
    if (type === 'cat') {
      return JSON.stringify(this.optionsCat[index]);
    }
    if (type === 'gender') {
      return JSON.stringify(this.genderOptions[index]);
    }
    return '';
  }

  public onPhotosSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (const file of Array.from(input.files)) {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = e => {
            this.uploadedPhotos.push({
              file,
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

  public nextStep(): void {
    if (this.active < 2) {
      this.active++;
    }
  }

  public prevStep(): void {
    if (this.active > 0) {
      this.active--;
    }
  }

  public submitForm(): void {
    if (this.form.valid) {
      console.log('📝 Данные заявки:', this.form.getRawValue());
      alert('✅ Заявка успешно отправлена!');
      this.active = 0;
    } else {
      this.form.markAllAsTouched();
      alert('❌ Заполните все обязательные поля');
    }
  }
}
