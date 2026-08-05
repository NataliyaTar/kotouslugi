import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators, ValidationErrors } from '@angular/forms';
import { Subscription, take } from 'rxjs';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { IStep } from '@models/step.model';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { IValueCat, ICat } from '@models/cat.model';
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

function vaccinationDatesValidator(group: UntypedFormGroup): ValidationErrors | null {
  const date = group.get('date')?.value;
  const nextDate = group.get('nextDate')?.value;
  if (date && nextDate) {
    if (new Date(nextDate) < new Date(date)) {
      return { nextDateBeforeDate: true };
    }
  }
  return null;
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
  public catsData: ICat[] = [];
  public avatarFile: IUploadedFile | null = null;

  public vaccinations: IVaccination[] = [];
  public reminders: any[] = [];
  public qrCodeUrl: string | null = null;
  public today = new Date().toISOString().split('T')[0];

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



      public get getResult(): any[][] {
        const rawValue = this.form.getRawValue();

        // Формируем массив массивов, который ожидает CheckInfoComponent
        const formattedData: any[][] = [];

        // ШАГ 1: Данные питомца (берём напрямую из rawValue[0])
        const step1Data: any[] = [];
        const petData = rawValue[0];

        if (petData?.petName) {
          step1Data.push({ name: 'Кличка питомца', value: petData.petName });
        }
        if (petData?.breed) {
          step1Data.push({ name: 'Порода', value: petData.breed });
        }
        if (petData?.age !== null && petData?.age !== undefined && petData?.age !== '') {
          step1Data.push({ name: 'Возраст (лет)', value: petData.age });
        }
        if (petData?.gender) {
          try {
            const genderObj = typeof petData.gender === 'string' ? JSON.parse(petData.gender) : petData.gender;
            step1Data.push({ name: 'Пол', value: genderObj?.text || 'Не указан' });
          } catch (e) {
            step1Data.push({ name: 'Пол', value: 'Не указан' });
          }
        }
        formattedData.push(step1Data);

        // ШАГ 2: Чипирование (берём напрямую из rawValue[1])
        const step2Data: any[] = [];
        const chipData = rawValue[1];

        if (chipData?.chipNumber) {
          step2Data.push({ name: 'Номер чипа', value: chipData.chipNumber });
        }
        if (chipData?.chipDate) {
          step2Data.push({ name: 'Дата чипирования', value: chipData.chipDate });
        }
        if (chipData?.chipClinic) {
          step2Data.push({ name: 'Клиника чипирования', value: chipData.chipClinic });
        }
        formattedData.push(step2Data);

        // ШАГ 3: Вакцинации
        const step3Data: any[] = [];
        step3Data.push({
          name: 'Вакцинации',
          value: this.vaccinations.length > 0
            ? this.vaccinations.map(v => `${v.name} (${v.date})`).join('; ')
            : 'Нет записей'
        });
        formattedData.push(step3Data);

        // ШАГ 4: QR-код
        const step4Data: any[] = [];
        step4Data.push({
          name: 'QR-код',
          value: this.qrCodeUrl ? 'Сгенерирован' : 'Не сгенерирован'
        });
        formattedData.push(step4Data);

        return formattedData;
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
      veterinarian: ['', [Validators.required, Validators.pattern(/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/)]]
    }, { validators: vaccinationDatesValidator });
  }

  private getPetOptions(): void {
    this.constantService.getCatOptionsFull().pipe(take(1)).subscribe((cats: ICat[]) => {
      this.catsData = cats;
      this.optionsPet = cats.map(cat => ({ id: cat.id, text: cat.name }));
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
          chipNumber: ['', [Validators.required, Validators.pattern(/^\d{15}$/)]],
          chipDate: ['', [Validators.required]],
          chipClinic: ['', [Validators.required]],
        }),
        2: this.fb.group({
          notes: ['']
        }),
        3: this.fb.group({
          // Пустая группа для 4-го шага (проверка и QR-код)
        })
      });

      this.serviceInfo.servicesForms$.next({
        [this.idService]: this.form
      });

      this.loading = false;
    }

    // Метод для обновления валидаторов полей чипирования
    private updateChipValidators(chipNumber: string): void {
      const chipDateControl = this.getControl(1, 'chipDate');
      const chipClinicControl = this.getControl(1, 'chipClinic');

      if (chipNumber && chipNumber.trim().length > 0) {
        // Если номер чипа введён — делаем поля обязательными
        chipDateControl.setValidators([Validators.required]);
        chipClinicControl.setValidators([Validators.required]);
      } else {
        // Если номер чипа пустой — убираем обязательность
        chipDateControl.clearValidators();
        chipClinicControl.clearValidators();
      }

      // Обновляем статус валидации
      chipDateControl.updateValueAndValidity();
      chipClinicControl.updateValueAndValidity();
    }

  // Выбор зарегестрированного питомца
  public onPetSelected(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;

    if (!value) {
      // «Не выбран» — разблокируем поля и очищаем их
      this.getControl(0, 'petName').enable();
      this.getControl(0, 'breed').enable();
      this.getControl(0, 'age').enable();
      this.getControl(0, 'gender').enable();

      this.form.get('0.petName')?.setValue('');
      this.form.get('0.breed')?.setValue('');
      this.form.get('0.age')?.setValue('');
      this.form.get('0.gender')?.setValue(JSON.stringify(this.genderOptions[0]));
      return;
    }

    try {
      const petOption = JSON.parse(value);
      const cat = this.catsData.find(c => c.id === petOption.id);

      if (cat) {
        // Подставляем данные из реестра
        this.form.get('0.petName')?.setValue(cat.name);
        this.form.get('0.breed')?.setValue(this.getBreedText(cat.breed));
        this.form.get('0.age')?.setValue(Number(cat.age));
        this.form.get('0.gender')?.setValue(JSON.stringify(this.getGenderObject(cat.sex)));

        // Блокируем поля — данные зарегистрированного питомца менять нельзя
        this.getControl(0, 'petName').disable();
        this.getControl(0, 'breed').disable();
        this.getControl(0, 'age').disable();
        this.getControl(0, 'gender').disable();
      }
    } catch (e) {
      console.error('Ошибка при выборе питомца', e);
    }
  }

  private getBreedText(breedKey: string): string {
    const map: Record<string, string> = {
      'siamese': 'Сиамская',
      'british_shorthair': 'Британская короткошёрстная',
      'maine_coon': 'Мейн-кун',
      'persian': 'Персидская',
      'sphinx': 'Сфинкс',
      'scottish_fold': 'Шотландская вислоухая',
      'russian_blue': 'Русская голубая',
      'munchkin': 'Манчкин'
    };
    return map[breedKey] || breedKey;
  }

  private getGenderObject(sex: string): { id: string; text: string } {
    return this.genderOptions.find(g => g.id === sex) || this.genderOptions[0];
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
  public onChipInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D/g, '');
    if (input.value !== digitsOnly) {
      input.value = digitsOnly;
      this.getControl(1, 'chipNumber').setValue(digitsOnly);
    }
  }

  public onVeterinarianInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const lettersOnly = input.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s\-]/g, '');
    if (input.value !== lettersOnly) {
      input.value = lettersOnly;
      this.vaccinationForm.get('veterinarian')?.setValue(lettersOnly);
    }
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

      // Добавляем вакцинацию
      this.vaccinations.push({
        name: vaccination.name,
        date: vaccination.date,
        nextDate: vaccination.nextDate,
        veterinarian: vaccination.veterinarian
      });

      //  АВТОМАТИЧЕСКИ создаем напоминание о следующей вакцинации
      this.reminders.push({
        type: 'vaccination',
        title: `Повторная вакцинация: ${vaccination.name}`,
        date: vaccination.nextDate,
        isSent: false
      });

      // Сортируем напоминания по дате (ближайшие сверху)
      this.reminders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      this.showVaccinationForm = false;
      this.vaccinationForm.reset();
    } else {
      this.vaccinationForm.markAllAsTouched();
    }
  }

  public removeVaccination(index: number): void {
    if (confirm('Вы уверены, что хотите удалить эту вакцинацию?')) {
      const vaccinationName = this.vaccinations[index]?.name;
      this.vaccinations.splice(index, 1);

      // Удаление связанного напоминания
      this.reminders = this.reminders.filter(r =>
        r.title !== `Повторная вакцинация: ${vaccinationName}`
      );
    }
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
