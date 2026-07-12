import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router'; // ← ДОБАВЛЕН ActivatedRoute
import { Subscription, take } from 'rxjs';

// ========================================
// СЕРВИСЫ
// ========================================

import { DrivingApplicationService } from '@services/driving-license/application.service';
import { DrivingNotificationService } from '@services/driving-license/notification.service';
import { CatService } from '@services/cat/cat.service';
import { ConstantsService } from '@services/constants/constants.service';
import { ServiceInfoService } from '@services/servise-info/service-info.service';

// ========================================
// КОМПОНЕНТЫ
// ========================================

import { ThrobberComponent } from '@components/throbber/throbber.component';
import { CheckInfoComponent } from '@components/check-info/check-info.component';

// ========================================
// МОДЕЛИ
// ========================================

import { IDrivingApplication, DrivingCategory, CATEGORY_LABELS } from '@models/driving-license.model';
import { IStep } from '@models/step.model';
import { IValueCat, ICat } from '@models/cat.model';

// ========================================
// МАППИНГ ПОЛЕЙ ФОРМЫ ДЛЯ ПРЕДПРОСМОТРА
// ========================================

export enum FormMap {
  cat = 'Кот',
  catAge = 'Возраст',
  catBreed = 'Порода',
  catSex = 'Пол',
  category = 'Категория прав',
  examDate = 'Дата экзамена',
  examTime = 'Время экзамена'
}

// ========================================
// КОМПОНЕНТ
// ========================================

@Component({
  selector: 'app-driving-license',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ThrobberComponent,
    CheckInfoComponent
  ],
  templateUrl: './driving-license.component.html',
  styleUrl: './driving-license.component.scss'
})
export class DrivingLicenseComponent implements OnInit, OnDestroy {

  // ========================================
  // ПУБЛИЧНЫЕ СВОЙСТВА
  // ========================================

  public loading = true;
  public form!: UntypedFormGroup;
  public active: number = 0;
  public hasCats = true;

  public categories = Object.keys(CATEGORY_LABELS).map(key => ({
    value: key as DrivingCategory,
    label: CATEGORY_LABELS[key as DrivingCategory]
  }));

  public optionsCat: IValueCat[] = [];
  public minDate: string = new Date().toISOString().split('T')[0];

  public sexMap: Record<string, string> = {
    'male': 'Мужской',
    'female': 'Женский'
  };

  public applications: IDrivingApplication[] = [];
  public selectedApplication: IDrivingApplication | null = null;
  public searchId = '';
  public searchPerformed = false;

  public feedbackForm!: UntypedFormGroup;
  public feedbackSubmitted = false;

  public statistics: any[] = [];
  public topSchools: any[] = [];
  public categoryStats: any = { A: 0, B: 0, C: 0, D: 0 };

  public showForm = false;
  public showStatus = false;
  public showFeedback = false;
  public showStatistics = false;
  public showConfirmation = false;
  public submittedApplication: any;

  // ========================================
  // ПРИВАТНЫЕ СВОЙСТВА
  // ========================================

  private idService: string = '';
  private steps: IStep[] = [];
  private subscriptions: Subscription[] = [];

  // ========================================
  // ГЕТТЕРЫ
  // ========================================

  public get getResult() {
    const rawValue = this.form.getRawValue();

    if (rawValue[0]?.cat) {
      try {
        const catObj = JSON.parse(rawValue[0].cat);
        rawValue[0].cat = catObj.text;
        rawValue[0].catBreed = catObj.breed ? this.getBreedText(catObj.breed) : 'Не указана';
        rawValue[0].catSex = catObj.sex ? this.sexMap[catObj.sex] || catObj.sex : 'Не указан';
      } catch (e) {
        rawValue[0].catBreed = 'Не указана';
        rawValue[0].catSex = 'Не указан';
      }
    }

    return this.serviceInfo.prepareDataForPreview(rawValue, this.steps, FormMap);
  }

  // ========================================
  // КОНСТРУКТОР
  // ========================================

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private applicationService: DrivingApplicationService,
    private notificationService: DrivingNotificationService,
    private catService: CatService,
    private constantService: ConstantsService,
    private router: Router
  ) {}

  // ========================================
  // ЖИЗНЕННЫЙ ЦИКЛ
  // ========================================

  ngOnInit(): void {
    this.loadCats();
    this.initFeedbackForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(item => item.unsubscribe());
  }

  // ========================================
  // РАБОТА С ПОРОДАМИ
  // ========================================

  private getBreedText(breedId: string): string {
    if (!breedId) return 'Не указана';
    const breed = this.constantService.breedOptions.find(b => b.id === breedId);
    return breed ? breed.text : breedId;
  }

  // ========================================
  // ЗАГРУЗКА ДАННЫХ
  // ========================================

  private loadCats(): void {
    this.catService.getCatList().pipe(take(1)).subscribe((cats: ICat[]) => {
      if (cats && cats.length > 0) {
        this.optionsCat = cats.map(cat => ({
          id: cat.id,
          text: cat.name,
          age: cat.age,
          sex: cat.sex,
          breed: cat.breed
        }));
        this.hasCats = true;
      } else {
        this.optionsCat = [];
        this.hasCats = false;
      }
      this.prepareService();
    }, (error: any) => { // ← ДОБАВЛЕН ТИП any
      console.error('Ошибка при загрузке котов:', error);
      this.hasCats = false;
      this.prepareService();
    });
  }

  private prepareService(): void {
    this.route.data.pipe(take(1)).subscribe((res: any) => { // ← ДОБАВЛЕН ТИП any
      this.idService = res['idService'];

      this.serviceInfo.getSteps(this.idService).pipe(take(1)).subscribe((res: any) => { // ← ДОБАВЛЕН ТИП any
        this.steps = res;
        this.moveStepsAfterMenu();
      });

      this.subscriptions.push(
        this.serviceInfo.activeStep.subscribe((res: any) => { // ← ДОБАВЛЕН ТИП any
          this.active = res?.[this.idService] || 0;
        })
      );

      this.initForm();
      this.loadData();
      this.loading = false;
    });
  }

  private loadData(): void {
    this.applicationService.getApplications().subscribe((apps: IDrivingApplication[]) => {
      this.applications = apps;
    });

    const stats = JSON.parse(localStorage.getItem('driving_statistics') || '[]');
    this.statistics = stats;
    this.topSchools = [...stats].sort((a: any, b: any) => b.averageRating - a.averageRating);

    this.categoryStats = { A: 0, B: 0, C: 0, D: 0 };
    stats.forEach((entry: any) => {
      Object.keys(entry.categoryStats).forEach((cat: string) => {
        this.categoryStats[cat] += entry.categoryStats[cat];
      });
    });
  }

  // ========================================
  // ИНИЦИАЛИЗАЦИЯ ФОРМ
  // ========================================

  private initForm(): void {
    this.form = this.fb.group({
      0: this.fb.group({
        cat: [
          this.hasCats && this.optionsCat.length > 0 ? JSON.stringify(this.optionsCat[0]) : '',
          [Validators.required]
        ],
        catAge: [{ value: '', disabled: false }, [Validators.required, Validators.min(1), Validators.max(25)]],
        catBreed: [{ value: '', disabled: false }],
        catSex: [{ value: '', disabled: false }]
      }),
      1: this.fb.group({
        category: ['', Validators.required]
      }),
      2: this.fb.group({
        examDate: ['', Validators.required],
        examTime: ['', Validators.required]
      })
    });

    this.subscriptions.push(
      this.form.get('0.cat')?.valueChanges.subscribe((value: string) => {
        this.onCatSelect(value);
      }) as Subscription
    );

    if (this.hasCats && this.optionsCat.length > 0) {
      setTimeout(() => {
        const defaultCat = JSON.stringify(this.optionsCat[0]);
        this.onCatSelect(defaultCat);
      }, 200);
    }

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });
  }

  private initFeedbackForm(): void {
    this.feedbackForm = this.fb.group({
      schoolName: ['', Validators.required],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required]
    });
  }

  // ========================================
  // ОБРАБОТКА ВЫБОРА КОТА
  // ========================================

  private onCatSelect(value: string): void {
    if (!value) return;

    try {
      const catObj = JSON.parse(value);

      if (catObj.age !== undefined && catObj.age !== null) {
        this.form.get('0.catAge')?.patchValue(catObj.age, { emitEvent: false });
      } else {
        this.form.get('0.catAge')?.patchValue('', { emitEvent: false });
      }

      if (catObj.breed) {
        const breedDisplay = this.getBreedText(catObj.breed);
        this.form.get('0.catBreed')?.patchValue(breedDisplay, { emitEvent: false });
      } else {
        this.form.get('0.catBreed')?.patchValue('Не указана', { emitEvent: false });
      }

      if (catObj.sex) {
        const sexText = this.sexMap[catObj.sex] || catObj.sex || 'Не указан';
        this.form.get('0.catSex')?.patchValue(sexText, { emitEvent: false });
      } else {
        this.form.get('0.catSex')?.patchValue('Не указан', { emitEvent: false });
      }
    } catch (e) {
      console.error('Ошибка при парсинге кота:', e);
    }
  }

  // ========================================
  // РАБОТА С ФОРМОЙ
  // ========================================

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  public getItem(type: 'cat', index: number): string {
    return JSON.stringify(this.optionsCat[index]);
  }

  public submitForm(): void {
    if (!this.form.valid || !this.hasCats) return;

    const rawValue = this.form.getRawValue();
    const step0 = rawValue[0];
    const step1 = rawValue[1];
    const step2 = rawValue[2];

    let catName = '';
    let catBreed = '';
    let catSex = '';

    try {
      const catObj = JSON.parse(step0.cat);
      catName = catObj.text;
      catBreed = catObj.breed ? this.getBreedText(catObj.breed) : 'Не указана';
      catSex = catObj.sex || 'Не указан';
    } catch (e) {
      catName = 'Кот';
      catBreed = 'Не указана';
      catSex = 'Не указан';
    }

    const applicationData = {
      catName: catName,
      catAge: Number(step0.catAge),
      catBreed: catBreed,
      catSex: catSex,
      category: step1.category as DrivingCategory,
      examDate: new Date(step2.examDate),
      examTime: step2.examTime
    };

    this.applicationService.createApplication(applicationData).subscribe((app: any) => {
      this.submittedApplication = app;
      this.showConfirmation = true;
      this.notificationService.notifyConfirmation(app);
      this.loadData();

      setTimeout(() => {
        this.showConfirmation = false;
        this.form.reset();
        this.serviceInfo.setActiveStep(this.idService, 0);
        this.showForm = false;
      }, 3000);
    });
  }

  // ========================================
  // ПОИСК ЗАЯВКИ
  // ========================================

  public searchApplication(): void {
    if (!this.searchId) return;

    this.applicationService.getApplication(this.searchId).subscribe((app: IDrivingApplication | null) => {
      this.selectedApplication = app || null;
      this.searchPerformed = true;
    });
  }

  // ========================================
  // ОТЗЫВЫ
  // ========================================

  public submitFeedback(): void {
    if (!this.feedbackForm.valid || !this.selectedApplication) return;

    this.applicationService.addFeedback(
      this.selectedApplication.id!,
      this.feedbackForm.value
    ).subscribe(() => {
      this.feedbackSubmitted = true;
      this.notificationService.addNotification(`Отзыв оставлен для школы ${this.feedbackForm.value.schoolName}`);
      this.loadData();

      setTimeout(() => {
        this.feedbackSubmitted = false;
        this.feedbackForm.reset({ rating: 5 });
        this.showFeedback = false;
      }, 3000);
    });
  }

  // ========================================
  // НАВИГАЦИЯ ПО РАЗДЕЛАМ
  // ========================================

  public showSection(section: string): void {
    this.showForm = false;
    this.showStatus = false;
    this.showFeedback = false;
    this.showStatistics = false;

    switch(section) {
      case 'form':
        this.showForm = true;
        this.serviceInfo.setActiveStep(this.idService, 0);
        break;
      case 'status':
        this.showStatus = true;
        break;
      case 'feedback':
        this.showFeedback = true;
        break;
      case 'statistics':
        this.showStatistics = true;
        break;
    }
  }

  // ========================================
  // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
  // ========================================

  private moveStepsAfterMenu(): void {
    setTimeout(() => {
      const stepsElement = document.querySelector('app-steps');
      const menuWrapper = document.querySelector('.menu-buttons-wrapper');

      if (stepsElement && menuWrapper && menuWrapper.parentNode) {
        menuWrapper.parentNode.insertBefore(stepsElement, menuWrapper.nextSibling);
      }
    }, 100);
  }

  public getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'Заявка подана': '#6c757d',
      'На проверке': '#ffc107',
      'Допущен к экзамену': '#007bff',
      'Экзамен сдан': '#28a745',
      'Отказ': '#dc3545'
    };
    return colors[status] || '#6c757d';
  }

  public getCategoryLabel(categoryValue: string): string {
    if (!categoryValue) return '';
    const found = this.categories.find(c => c.value === categoryValue);
    return found ? found.label : categoryValue;
  }

  public navigateToAddCat(): void {
    this.router.navigate(['/add-cat']);
  }
}
