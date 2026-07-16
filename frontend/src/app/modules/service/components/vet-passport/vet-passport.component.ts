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
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export enum FormMapVet {
  petName = 'Кличка питомца',
  breed = 'Порода',
  age = 'Возраст (лет)',
  gender = 'Пол',
  chipNumber = 'Номер чипа',
  chipDate = 'Дата чипирования',
  chipClinic = 'Клиника чипирования',
}

interface IUploadedFile {
  file: File;
  url: string;
  name: string;
}

interface IVaccination {
  name: string;
  date: string;
  nextDate: string;
  veterinarian: string;
}

@Component({
  selector: 'app-vet-passport',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CheckInfoComponent,
    ThrobberComponent,
    DatePipe
  ],
  templateUrl: './vet-passport.component.html',
  styleUrl: './vet-passport.component.scss'
})
export class VetPassportComponent implements OnInit, OnDestroy {
  public loading = true;
  public submitting = false;
  public form!: UntypedFormGroup;
  public active: number = 0;

  public optionsPet: IValueCat[] = [];
  public avatarFile: IUploadedFile | null = null;

  public vaccinations: IVaccination[] = [];
  public reminders: any[] = [];
  public qrCodeUrl: string | null = null;

  public showVaccinationForm = false;
  public vaccinationForm!: UntypedFormGroup;

  public genderOptions = [
    { id: 'male', text: 'Мальчик' },
    { id: 'female', text: 'Девочка' },
    { id: 'unknown', text: 'Неизвестно' },
  ];

  private idService: string = 'vet-passport';
  private steps: IStep[] = [];
  private subscriptions: Subscription[] = [];

  // Моковые данные питомцев (заменить на реальный API запрос в будущем)
  private get mockPetsData(): Record<string, any> {
    return {
      '1': { petName: 'Барсик', breed: 'Мейн-кун', age: 3, gender: JSON.stringify(this.genderOptions[0]) },
      '2': { petName: 'Мурка', breed: 'Сиамская', age: 2, gender: JSON.stringify(this.genderOptions[1]) },
      '3': { petName: 'Рыжик', breed: 'Британская', age: 5, gender: JSON.stringify(this.genderOptions[0]) },
    };
  }

  public get getResult() {
    const rawValue = this.form.getRawValue();
    const result = this.serviceInfo.prepareDataForPreview(rawValue, this.steps, FormMapVet);

    return {
      ...result,
      'Фото': this.avatarFile ? this.avatarFile.name : 'Не загружено',
      'Вакцинации': this.vaccinations.length > 0
        ? this.vaccinations.map(v => `${v.name} (${v.date})`).join('; ')
        : 'Нет записей',
      'QR-код': this.qrCodeUrl ? 'Сгенерирован' : 'Не сгенерирован'
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
    this.initVaccinationForm();
    this.getPetOptions();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(item => item.unsubscribe());
  }

  private initVaccinationForm(): void {
    this.vaccinationForm = this.fb.group({
      name: ['', [Validators.required]],
      date: ['', [Validators.required]],
      nextDate: ['', [Validators.required]],
      veterinarian: ['', [Validators.required]]
    });
  }

  private getPetOptions(): void {
    this.constantService.getCatOptionsAll().pipe(take(1)).subscribe((res: IValueCat[]) => {
      this.optionsPet = res;
      this.prepareService();
    });
  }

  private prepareService(): void {
    this.route.data.pipe(take(1)).subscribe(res => {
      this.idService = res['idService'] || this.idService;

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
    const defaultGender = JSON.stringify(this.genderOptions[0]);

    this.form = this.fb.group({
      0: this.fb.group({
        pet: [''],
        petName: ['', [Validators.required]],
        breed: ['', [Validators.required]],
        age: ['', [Validators.required, Validators.min(0), Validators.max(30)]],
        gender: [defaultGender, [Validators.required]],
      }),
      1: this.fb.group({
        chipNumber: ['', [Validators.pattern(/^\d{15}$/)]],
        chipDate: [''],
        chipClinic: [''],
      }),
      2: this.fb.group({
        notes: ['']
      })
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });

    this.loading = false;
  }

  // ✅ ИСПРАВЛЕННЫЙ ОБРАБОТЧИК ВЫБОРА ПИТОМЦА
  public onPetSelected(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;

    if (!value) {
      // Очищаем поля, если выбрано "Не выбран"
      this.form.get('0.petName')?.setValue('');
      this.form.get('0.breed')?.setValue('');
      this.form.get('0.age')?.setValue('');
      this.form.get('0.gender')?.setValue(JSON.stringify(this.genderOptions[0]));
      return;
    }

    try {
      // Парсим JSON значение из option
      const petData = JSON.parse(value);
      const petId = String(petData.id);

      // Ищем данные в моках
      const mockData = this.mockPetsData[petId];

      if (mockData) {
        // Если данные есть, подставляем всё
        this.form.get('0.petName')?.setValue(mockData.petName);
        this.form.get('0.breed')?.setValue(mockData.breed);
        this.form.get('0.age')?.setValue(mockData.age);
        this.form.get('0.gender')?.setValue(mockData.gender);
      } else {
        // Если моковых данных нет, хотя бы подставим имя из выпадающего списка, чтобы они совпадали!
        this.form.get('0.petName')?.setValue(petData.text || '');
        this.form.get('0.breed')?.setValue('');
        this.form.get('0.age')?.setValue('');
        this.form.get('0.gender')?.setValue(JSON.stringify(this.genderOptions[0]));
      }
    } catch (e) {
      console.error('Ошибка парсинга данных питомца', e);
    }
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  public getVaccinationControl(id: string): FormControl {
    return this.vaccinationForm.get(id) as FormControl;
  }

  public getItem(type: 'pet' | 'gender', index: number): string {
    if (type === 'pet') {
      return JSON.stringify(this.optionsPet[index]);
    }
    if (type === 'gender') {
      return JSON.stringify(this.genderOptions[index]);
    }
    return '';
  }

  public nextStep(): void {
    const currentStepGroup = this.form.get(`${this.active}`) as UntypedFormGroup;
    if (currentStepGroup && currentStepGroup.invalid) {
      currentStepGroup.markAllAsTouched();
      return;
    }

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

  public onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.avatarFile = {
            file: file,
            url: e.target?.result as string,
            name: file.name
          };
        };
        reader.readAsDataURL(file);
      }
    }
    input.value = '';
  }

  public removePhoto(): void {
    this.avatarFile = null;
  }

  public showAddVaccinationForm(): void {
    this.showVaccinationForm = true;
    this.vaccinationForm.reset();
  }

  public cancelVaccinationForm(): void {
    this.showVaccinationForm = false;
  }

  public saveVaccination(): void {
    if (this.vaccinationForm.valid) {
      const vaccination = this.vaccinationForm.value;
      this.vaccinations.push({
        name: vaccination.name,
        date: vaccination.date,
        nextDate: vaccination.nextDate,
        veterinarian: vaccination.veterinarian
      });
      this.showVaccinationForm = false;
      this.vaccinationForm.reset();
    } else {
      this.vaccinationForm.markAllAsTouched();
    }
  }

  public removeVaccination(index: number): void {
    this.vaccinations.splice(index, 1);
  }

  public generateQR(): void {
    const passportData = JSON.stringify(this.getResult);
    const encodedData = encodeURIComponent(passportData);
    this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedData}`;
  }

  public submitForm(): void {
    if (this.form.valid) {
      this.submitting = true;
      const formData = new FormData();

      const formValue = this.form.getRawValue();
      const payload = {
        ...formValue,
        vaccinations: this.vaccinations,
        reminders: this.reminders,
        qrCodeGenerated: !!this.qrCodeUrl
      };

      formData.append('data', JSON.stringify(payload));

      if (this.avatarFile) {
        formData.append('photo', this.avatarFile.file, this.avatarFile.name);
      }

      this.http.post('/api/vet-passport', formData).subscribe({
        next: (response) => {
          this.submitting = false;
          alert('✅ Ветеринарный паспорт успешно сохранен!');
          console.log('Ответ сервера:', response);
          this.router.navigate(['/vet-passport/view']);
        },
        error: (err) => {
          this.submitting = false;
          console.error('Ошибка отправки:', err);
          alert('❌ Ошибка при сохранении паспорта. Попробуйте позже.');
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
