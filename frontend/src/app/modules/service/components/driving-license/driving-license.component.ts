import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Subscription, take, finalize, forkJoin } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

import { CatService } from '@services/cat/cat.service';
import { ConstantsService } from '@services/constants/constants.service';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { DrivingStatisticsService } from '@services/statistics/statistics.service';
import { DrivingSchoolService, IDrivingSchool, ILicenseCategory } from '@services/driving-school/driving-school.service';
import { ReviewService, IReviewResponse } from '@services/review/review.service';
import { OrderService } from '@services/order/order.service';

import { ThrobberComponent } from '@components/throbber/throbber.component';
import { StepsComponent } from '@components/steps/steps.component';

import { IStep } from '@models/step.model';
import { IValueCat, ICat } from '@models/cat.model';
import {
  DrivingCategory,
  ApplicationStatus,
  IDrivingApplication,
  STATUS_LABELS,
  STATUS_COLORS
} from '@models/driving-license.model';

interface IApplication {
  id?: number;
  catName: string;
  catAge: number;
  catBreed?: string;
  catSex?: string;
  category: string;
  schoolName?: string;
  examDate: string;
  examTime: string;
  status: ApplicationStatus;
  createdAt: string;
}

interface IFeedback {
  id?: number;
  schoolName: string;
  rating: number;
  comment: string;
  createdAt?: string;
  catId?: number;
}

interface ISchoolRating {
  schoolName: string;
  averageRating: number;
  reviewsCount: number;
}

@Component({
  selector: 'app-driving-license',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    ThrobberComponent,
    StepsComponent
  ],
  templateUrl: './driving-license.component.html',
  styleUrls: ['./driving-license.component.scss']
})
export class DrivingLicenseComponent implements OnInit, OnDestroy {

  public loading = true;
  public form!: UntypedFormGroup;
  public active: number = 0;
  public hasCats = false;

  public optionsCat: IValueCat[] = [];
  public minDate: string = new Date().toISOString().split('T')[0];

  public sexMap: Record<string, string> = {
    'male': 'Мужской',
    'female': 'Женский'
  };

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

  public showForm = true;
  public showStatus = false;
  public showFeedback = false;
  public showStatistics = false;
  public showConfirmation = false;

  public searchId = '';
  public searchPerformed = false;
  public selectedApplication: IApplication | null = null;
  public applications: IApplication[] = [];

  public feedbackForm: UntypedFormGroup;
  public feedbackSubmitted = false;
  public feedbacks: IFeedback[] = [];
  public allFeedbacks: IFeedback[] = [];

  public topSchools: ISchoolRating[] = [];
  public categoryStats: { [key: string]: number } = { A: 0, B: 0, C: 0, D: 0 };

  public submittedApplication: IApplication | null = null;
  public isSubmitting = false;

  public licenseCategories: ILicenseCategory[] = [];
  public drivingSchools: IDrivingSchool[] = [];
  public schoolOptions: { id: number; name: string }[] = [];

  private readonly STORAGE_KEY = 'driving_license_data';

  private idService: string = '';
  public steps: IStep[] = [];
  private subscriptions: Subscription[] = [];

  public toastMessage: string | null = null;
  public toastType: 'success' | 'error' = 'success';
  public showToast = false;
  private toastTimeout: any = null;

  public ApplicationStatus = ApplicationStatus;
  public STATUS_LABELS = STATUS_LABELS;

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private catService: CatService,
    private constantService: ConstantsService,
    private router: Router,
    private drivingSchoolService: DrivingSchoolService,
    private reviewService: ReviewService,
    private orderService: OrderService
  ) {
    this.initFeedbackForm();
  }

  public ngOnInit(): void {
    this.loadCats();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(item => item.unsubscribe());
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

  public submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rawValue = this.form.getRawValue();

    this.isSubmitting = true;

    this.orderService.saveOrder(this.idService, rawValue).pipe(
      finalize(() => {
        this.isSubmitting = false;
      })
    ).subscribe({
      next: (response: any) => {
        this.showToastMessage('✅ Заявка успешно отправлена! Номер заявки: ' + (response?.id || 'сформирован'), 'success');

        const catObj = JSON.parse(rawValue[0]?.cat || '{}');
        const newApplication: IApplication = {
          id: response?.id,
          catName: catObj.text || 'Кот',
          catAge: rawValue[0]?.catAge || 0,
          catBreed: rawValue[0]?.catBreed || 'Не указана',
          catSex: rawValue[0]?.catSex || 'Не указан',
          category: rawValue[1]?.category || 'A',
          schoolName: rawValue[1]?.schoolName || 'Не выбрана',
          examDate: rawValue[2]?.examDate || new Date().toISOString().split('T')[0],
          examTime: rawValue[2]?.examTime || '10:00',
          status: ApplicationStatus.SUBMITTED,
          createdAt: new Date().toISOString()
        };

        this.applications.push(newApplication);
        this.submittedApplication = newApplication;
        this.showConfirmation = true;
        this.saveToStorage();

        this.updateCategoryStats();

        setTimeout(() => {
          this.showConfirmation = false;
          this.submittedApplication = null;
          this.form.reset();
          this.active = 0;
          this.serviceInfo.setActiveStep(this.idService, 0);
        }, 5000);
      },
      error: (error: any) => {
        let errorMessage = 'Произошла ошибка при отправке заявки. Попробуйте позже.';

        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.showToastMessage('❌ ' + errorMessage, 'error');
      }
    });
  }

  private showToastMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
      this.toastMessage = null;
    }, 5000);
  }

  public closeToast(): void {
    this.showToast = false;
    this.toastMessage = null;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
  }

  public isValidStep(): boolean {
    return this.form?.get(this.active.toString())?.valid || false;
  }

  public next(): void {
    if (this.active < this.steps.length - 1) {
      if (this.isValidStep()) {
        this.active++;
        this.updateActiveStep();
      } else {
        this.form.get(this.active.toString())?.markAllAsTouched();
      }
    }
  }

  public prev(): void {
    if (this.active > 0) {
      this.active--;
      this.updateActiveStep();
    }
  }

  private updateActiveStep(): void {
    this.serviceInfo.setActiveStep(this.idService, this.active);
  }

  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

  public getItem(type: 'cat' | 'doc', index: number): string {
    if (type === 'cat' && this.optionsCat[index]) {
      return JSON.stringify(this.optionsCat[index]);
    }
    return '';
  }

  public getCatName(): string {
    try {
      const rawValue = this.form.getRawValue();
      const catObj = JSON.parse(rawValue[0]?.cat || '{}');
      return catObj.text || 'Не указано';
    } catch {
      return 'Не указано';
    }
  }

  public getCatAge(): string {
    try {
      const rawValue = this.form.getRawValue();
      return rawValue[0]?.catAge || 'Не указано';
    } catch {
      return 'Не указано';
    }
  }

  public getCatBreed(): string {
    try {
      const rawValue = this.form.getRawValue();
      return rawValue[0]?.catBreed || 'Не указано';
    } catch {
      return 'Не указано';
    }
  }

  public getCatSex(): string {
    try {
      const rawValue = this.form.getRawValue();
      return rawValue[0]?.catSex || 'Не указано';
    } catch {
      return 'Не указано';
    }
  }

  public getCategory(): string {
    try {
      const rawValue = this.form.getRawValue();
      return rawValue[1]?.category || 'Не указано';
    } catch {
      return 'Не указано';
    }
  }

  public getExamDate(): string {
    try {
      const rawValue = this.form.getRawValue();
      const date = rawValue[2]?.examDate;
      return date ? new Date(date).toLocaleDateString('ru-RU') : 'Не указано';
    } catch {
      return 'Не указано';
    }
  }

  public getExamTime(): string {
    try {
      const rawValue = this.form.getRawValue();
      return rawValue[2]?.examTime || 'Не указано';
    } catch {
      return 'Не указано';
    }
  }

  public showSection(section: 'form' | 'status' | 'feedback' | 'statistics' | ''): void {
    this.showForm = section === 'form' || section === '';
    this.showStatus = section === 'status';
    this.showFeedback = section === 'feedback';
    this.showStatistics = section === 'statistics';
    this.showConfirmation = false;
    this.searchPerformed = false;

    if (section === 'form') {
      this.active = 0;
      this.serviceInfo.setActiveStep(this.idService, 0);
    }

    if (section === 'statistics') {
      this.loadAllReviews();
    }
  }

  public searchApplication(): void {
    this.searchPerformed = true;

    if (!this.searchId.trim()) {
      this.selectedApplication = null;
      return;
    }

    const searchTerm = this.searchId.trim();
    const numericId = parseInt(searchTerm, 10);

    if (isNaN(numericId)) {
      const lowerTerm = searchTerm.toLowerCase();
      const found = this.applications.find(app =>
        app.catName?.toLowerCase().includes(lowerTerm)
      );
      this.selectedApplication = found || null;
      return;
    }

    this.orderService.getOrdersList().subscribe({
      next: (orders: any[]) => {
        const found = orders.find(order =>
          order.id && String(order.id) === String(numericId) && order.mnemonic === 'driving-license'
        );

        if (found) {
          const app = this.mapOrderToApplication(found);

          this.selectedApplication = {
            id: app.id,
            catName: app.catName,
            catAge: app.catAge,
            catBreed: app.catBreed || 'Не указана',
            catSex: app.catSex || 'Не указан',
            category: app.category,
            schoolName: app.schoolName || 'Не выбрана',
            examDate: app.examDate.toISOString().split('T')[0],
            examTime: app.examTime,
            status: app.status,
            createdAt: app.createdAt.toISOString()
          };
        } else {
          this.selectedApplication = null;
        }
      },
      error: () => {
        this.selectedApplication = null;
      }
    });
  }

  private getBreedDisplay(breed: string): string {
    if (!breed) return 'Не указана';
    return this.breedMap[breed] || breed;
  }

  private getSexDisplay(sex: string): string {
    if (!sex) return 'Не указан';
    return this.sexMap[sex] || sex;
  }

  private mapOrderToApplication(order: any): IDrivingApplication {
    let fieldsArray: any[] = [];
    try {
      let fieldsStr = order.fields;
      if (typeof fieldsStr === 'string') {
        let cleaned = fieldsStr;
        if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
          cleaned = cleaned.slice(1, -1);
        }
        cleaned = cleaned.replace(/\\"/g, '"');
        fieldsArray = JSON.parse(cleaned);
      }
    } catch {
      try {
        const parsed = JSON.parse(order.fields);
        if (typeof parsed === 'string') {
          fieldsArray = JSON.parse(parsed);
        } else {
          fieldsArray = parsed;
        }
      } catch {
      }
    }

    let catName = 'Кот';
    let catAge = 1;
    let catBreed = 'Не указана';
    let catSex = 'Не указан';
    let category = 'A';
    let examDate = new Date();
    let examTime = '10:00';
    let schoolName = 'Не выбрана';

    fieldsArray.forEach((step: any) => {
      if (step && typeof step === 'object') {
        if (step.catName) {
          catName = String(step.catName);
        }
        if (step.catAge) {
          catAge = parseInt(String(step.catAge)) || 1;
        }
        if (step.catBreed) {
          const rawBreed = String(step.catBreed);
          catBreed = this.getBreedDisplay(rawBreed);
        }
        if (step.catSex) {
          const rawSex = String(step.catSex);
          catSex = this.getSexDisplay(rawSex);
        }

        // Категория и школа (шаг 1)
        if (step.category) {
          category = String(step.category);
        }
        if (step.schoolName) {
          schoolName = String(step.schoolName);
        }

        // Дата и время (шаг 2)
        if (step.examDate) {
          try {
            examDate = new Date(String(step.examDate));
          } catch {
          }
        }
        if (step.examTime) {
          examTime = String(step.examTime);
        }
      }
    });

    // Fallback для имени кота
    if (catName === 'Кот') {
      for (const step of fieldsArray) {
        if (step && typeof step === 'object') {
          if (step.name) {
            catName = String(step.name);
            break;
          }
          if (step.text) {
            catName = String(step.text);
            break;
          }
        }
      }
    }

    return {
      id: order.id ? parseInt(String(order.id), 10) : undefined,
      catName,
      catAge,
      catBreed,
      catSex,
      category: this.mapCategory(category),
      schoolName,
      examDate,
      examTime,
      status: this.mapOrderStatus(order.status || 'FILED'),
      createdAt: new Date(order.created || Date.now()),
      updatedAt: new Date(order.updated || Date.now())
    };
  }

  private mapCategory(code: string): DrivingCategory {
    if (!code) return DrivingCategory.A;
    const upperCode = code.toUpperCase();
    if (upperCode.includes('A')) return DrivingCategory.A;
    if (upperCode.includes('B')) return DrivingCategory.B;
    if (upperCode.includes('C')) return DrivingCategory.C;
    if (upperCode.includes('D')) return DrivingCategory.D;
    return DrivingCategory.A;
  }

  private mapOrderStatus(status: string): ApplicationStatus {
    const map: Record<string, ApplicationStatus> = {
      'FILED': ApplicationStatus.SUBMITTED,
      'PENDING': ApplicationStatus.SUBMITTED,
      'UNDER_CONSIDERATION': ApplicationStatus.VERIFICATION,
      'ACCEPTED': ApplicationStatus.APPROVED,
      'DONE': ApplicationStatus.COMPLETED,
      'REJECTED': ApplicationStatus.REJECTED,
      'SUBMITTED': ApplicationStatus.SUBMITTED,
      'VERIFICATION': ApplicationStatus.VERIFICATION,
      'APPROVED': ApplicationStatus.APPROVED,
      'COMPLETED': ApplicationStatus.COMPLETED
    };
    return map[status] || ApplicationStatus.SUBMITTED;
  }

  public getStatusLabel(status: ApplicationStatus | string): string {
    if (typeof status === 'string') {
      const enumKey = Object.keys(ApplicationStatus).find(
        key => ApplicationStatus[key as keyof typeof ApplicationStatus] === status
      );
      if (enumKey) {
        return STATUS_LABELS[ApplicationStatus[enumKey as keyof typeof ApplicationStatus]];
      }
      return status;
    }
    return STATUS_LABELS[status] || status;
  }

  public getStatusColor(status: ApplicationStatus | string): string {
    if (typeof status === 'string') {
      const enumKey = Object.keys(ApplicationStatus).find(
        key => ApplicationStatus[key as keyof typeof ApplicationStatus] === status
      );
      if (enumKey) {
        return STATUS_COLORS[ApplicationStatus[enumKey as keyof typeof ApplicationStatus]];
      }
      return '#999';
    }
    return STATUS_COLORS[status] || '#999';
  }

  public submitFeedback(): void {
    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const catId = this.getCurrentCatId();

    const reviewData = {
      catId: catId,
      schoolName: this.feedbackForm.value.schoolName,
      schoolRating: this.feedbackForm.value.rating,
      comment: this.feedbackForm.value.comment
    };

    this.reviewService.createReview(reviewData).pipe(
      finalize(() => {
        this.isSubmitting = false;
      })
    ).subscribe({
      next: (id: number) => {
        const feedback: IFeedback = {
          id: id,
          schoolName: this.feedbackForm.value.schoolName,
          rating: this.feedbackForm.value.rating,
          comment: this.feedbackForm.value.comment,
          createdAt: new Date().toISOString(),
          catId: catId
        };

        this.feedbacks.push(feedback);
        this.allFeedbacks.push(feedback);
        this.feedbackSubmitted = true;

        this.showToastMessage('✅ Отзыв успешно отправлен! Спасибо за ваш отзыв.', 'success');

        this.calculateStatisticsFromReviews();

        setTimeout(() => {
          this.feedbackSubmitted = false;
          this.feedbackForm.reset({ rating: 5 });
          this.showSection('statistics');
        }, 3000);
      },
      error: (error: any) => {
        let errorMessage = 'Произошла ошибка при отправке отзыва. Попробуйте позже.';

        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.showToastMessage('❌ ' + errorMessage, 'error');
      }
    });
  }

  private loadAllReviews(): void {
    this.reviewService.getReviews().subscribe({
      next: (reviews: IReviewResponse[]) => {
        this.allFeedbacks = reviews.map(review => ({
          id: review.id,
          schoolName: review.schoolName,
          rating: review.schoolRating,
          comment: review.comment,
          catId: review.cat?.id,
          createdAt: new Date().toISOString()
        }));

        this.calculateStatisticsFromReviews();
      },
      error: () => {
      }
    });
  }

  private calculateStatisticsFromReviews(): void {
    const schoolMap = new Map<string, { sum: number; count: number }>();

    this.allFeedbacks.forEach((feedback: IFeedback) => {
      const existing = schoolMap.get(feedback.schoolName);
      if (existing) {
        existing.sum += feedback.rating;
        existing.count += 1;
      } else {
        schoolMap.set(feedback.schoolName, { sum: feedback.rating, count: 1 });
      }
    });

    this.topSchools = Array.from(schoolMap.entries())
      .map(([schoolName, data]: [string, { sum: number; count: number }]) => ({
        schoolName,
        averageRating: Math.round((data.sum / data.count) * 10) / 10,
        reviewsCount: data.count
      }))
      .sort((a: ISchoolRating, b: ISchoolRating) => b.averageRating - a.averageRating);

    this.updateCategoryStats();
  }

  private updateCategoryStats(): void {
    this.categoryStats = { A: 0, B: 0, C: 0, D: 0 };

    this.applications
      .filter((app: IApplication) =>
        app.status === ApplicationStatus.APPROVED ||
        app.status === ApplicationStatus.COMPLETED
      )
      .forEach((app: IApplication) => {
        const category = app.category?.includes('A') ? 'A' :
          app.category?.includes('B') ? 'B' :
            app.category?.includes('C') ? 'C' : 'D';
        if (this.categoryStats[category] !== undefined) {
          this.categoryStats[category] = (this.categoryStats[category] || 0) + 1;
        }
      });
  }

  private getCurrentCatId(): number {
    try {
      const rawValue = this.form.getRawValue();
      const catObj = JSON.parse(rawValue[0]?.cat || '{}');
      return parseInt(catObj.id) || 1;
    } catch {
      return 1;
    }
  }

  public navigateToAddCat(): void {
    this.router.navigate(['/add-cat']).catch(() => {
    });
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.applications = parsed.applications || [];
        this.feedbacks = parsed.feedbacks || [];
      } else {
        this.applications = [];
        this.feedbacks = [];
      }
    } catch {
      this.applications = [];
      this.feedbacks = [];
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        applications: this.applications,
        feedbacks: this.feedbacks
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch {
    }
  }

  private getBreedText(breedId: string): string {
    if (!breedId) return 'Не указана';
    const breed = this.constantService.breedOptions?.find((b: any) => b.id === breedId);
    return breed ? breed.text : breedId;
  }

  private loadCats(): void {
    this.catService.getCatList().pipe(take(1)).subscribe({
      next: (cats: ICat[]) => {
        if (cats && cats.length > 0) {
          this.optionsCat = cats.map((cat: ICat) => ({
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
      },
      error: () => {
        this.hasCats = false;
        this.prepareService();
      }
    });
  }

  private prepareService(): void {
    this.route.data.pipe(take(1)).subscribe((res: any) => {
      this.idService = res['idService'] || 'driving-license';

      forkJoin({
        categories: this.drivingSchoolService.getCategories(),
        schools: this.drivingSchoolService.getSchools()
      }).subscribe({
        next: (result) => {
          this.licenseCategories = result.categories;
          this.drivingSchools = result.schools;
          this.schoolOptions = result.schools.map(school => ({
            id: school.id,
            name: school.name
          }));
        },
        error: () => {
          this.licenseCategories = [
            { id: 0, code: 'A', name: 'Мотоциклы', minAge: 2 },
            { id: 1, code: 'B', name: 'Легковые автомобили', minAge: 2 },
            { id: 2, code: 'C', name: 'Грузовые автомобили', minAge: 3 },
            { id: 3, code: 'D', name: 'Автобусы', minAge: 4 }
          ];
          this.drivingSchools = [];
          this.schoolOptions = [];
        }
      });

      this.serviceInfo.getSteps(this.idService).pipe(take(1)).subscribe({
        next: (steps: IStep[]) => {
          this.steps = steps;
        },
        error: () => {
          this.steps = [
            { title: 'Информация о котике', text: 'Заполните форму', icon: 'account.svg' },
            { title: 'Категория водительских прав', text: 'Выберите необходимую категорию', icon: 'article.svg' },
            { title: 'Дата экзамена', text: 'Дата и время экзамена', icon: 'calendar.svg' },
            { title: 'Проверка формы', text: 'Проверьте заявку на корректность данных', icon: 'checklist.svg' }
          ];
        }
      });

      this.subscriptions.push(
        this.serviceInfo.activeStep.subscribe((res: any) => {
          this.active = res?.[this.idService] || 0;
        })
      );

      this.loadApplications();
      this.loadAllReviews();

      this.initForm();
      this.loadFromStorage();
      this.loading = false;
    });
  }

  private loadApplications(): void {
    this.orderService.getOrdersList().subscribe({
      next: (orders: any[]) => {
        const drivingOrders = orders.filter(order => order.mnemonic === 'driving-license');
        this.applications = drivingOrders.map(order => {
          const app = this.mapOrderToApplication(order);
          return {
            id: app.id,
            catName: app.catName,
            catAge: app.catAge,
            catBreed: app.catBreed,
            catSex: app.catSex || 'Не указан',
            category: app.category,
            schoolName: app.schoolName || 'Не выбрана',
            examDate: app.examDate.toISOString().split('T')[0],
            examTime: app.examTime,
            status: app.status,
            createdAt: app.createdAt.toISOString()
          };
        });
        this.updateCategoryStats();
      },
      error: () => {
      }
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      0: this.fb.group({
        cat: [
          this.hasCats && this.optionsCat.length > 0 ? JSON.stringify(this.optionsCat[0]) : '',
          [Validators.required]
        ],
        catAge: [{
          value: '',
          disabled: false
        }, [
          Validators.required,
          Validators.min(1),
          Validators.max(50)
        ]],
        catBreed: [{ value: '', disabled: false }],
        catSex: [{ value: '', disabled: false }]
      }),
      1: this.fb.group({
        category: ['', [Validators.required, this.categoryAgeValidator.bind(this)]],
        schoolName: ['', [Validators.required]]
      }),
      2: this.fb.group({
        examDate: ['', [Validators.required, this.dateValidator]],
        examTime: ['', Validators.required]
      })
    });

    this.subscriptions.push(
      this.form.get('0.catAge')?.valueChanges.subscribe(() => {
        this.form.get('1.category')?.updateValueAndValidity();
      }) as Subscription
    );

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
      schoolName: ['', [Validators.required]],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

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

      this.form.get('1.category')?.updateValueAndValidity();

    } catch {
    }
  }

  private dateValidator(control: FormControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return { minDate: true };
    }

    return null;
  }

  private categoryAgeValidator(control: FormControl): { [key: string]: boolean } | null {
    const categoryCode = control.value;
    if (!categoryCode) return null;

    const rawValue = this.form?.getRawValue();
    if (!rawValue) return null;

    const catAge = parseInt(rawValue[0]?.catAge) || 0;

    const selectedCategory = this.licenseCategories.find(cat => cat.code === categoryCode);

    if (!selectedCategory) return null;

    if (catAge < selectedCategory.minAge) {
      return { ageTooYoung: true };
    }

    return null;
  }

  public getCategoryErrorMessage(): string {
    const rawValue = this.form?.getRawValue();
    if (!rawValue) return '';

    const categoryCode = rawValue[1]?.category;
    const catAge = parseInt(rawValue[0]?.catAge) || 0;

    if (!categoryCode) return '';

    const selectedCategory = this.licenseCategories.find(cat => cat.code === categoryCode);

    if (!selectedCategory) return '';

    if (catAge < selectedCategory.minAge) {
      return `⚠️ Коту должно быть не менее ${selectedCategory.minAge} лет для категории "${selectedCategory.code} - ${selectedCategory.name}"`;
    }

    return '';
  }
  getSchoolName(): string {
    const schoolName = this.form.get('1')?.get('schoolName')?.value;
    if (!schoolName) return 'Не выбрано';
    return schoolName;
  }
}
