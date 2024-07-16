import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators} from "@angular/forms";
import {CheckInfoComponent} from "@components/check-info/check-info.component";
import {ThrobberComponent} from "@components/throbber/throbber.component";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {IValueCat} from "@models/cat.model";
import {IStep} from "@models/step.model";
import {catchError, of, Subscription, take} from "rxjs";
import {ServiceInfoService} from "@services/servise-info/service-info.service";
import {ConstantsService} from "@services/constants/constants.service";
import {JsonPipe} from "@angular/common";
import {ExamService} from "@services/exam/exam.service";
import {IExam} from "@models/exam.model";
import {IUniversity} from "@models/university.model";
import {UniversityService} from "@services/university/university.service";

export enum FormMap { // маппинг названия поля - значение
  cat  = 'Кличка'
}

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent,
    JsonPipe,
    ThrobberComponent,
    //NgForOf,
    //NgIf,
  ],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.scss'
})
export class ExamsComponent implements OnInit, OnDestroy  {

  public loading = true; // загружена ли информация для страницы
  public form: UntypedFormGroup; // форма
  public active: number; // активный шаг формы
  public optionsCat: IValueCat[]; // список котов
  public examScores: IExam[] = []; // баллы К-ЕГЭ кота
  public universities: IUniversity[] = []; // подходящие университеты
  public selectedCatName: string; // кличка выбранного кота
  public errorMessageStepTwo: string | null = null; // сообщение об ошибке шага 2
  public errorMessageStepThree: string | null = null; // сообщение об ошибке шага 3

  private idService: string; // мнемоника услуги
  private steps: IStep[]; // шаги формы
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private constantService: ConstantsService,
    private examService: ExamService,
    private universityService: UniversityService
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
        cat: [JSON.stringify(this.optionsCat[0]), [Validators.required]]
      }),
      1: this.fb.group({ }),
      2: this.fb.group({ })
    });

    // возвращаем кличку кота
    this.selectedCatName = this.optionsCat[0]?.text || '';

    // загрузка баллов для кота с id = 0
    if (this.optionsCat[0]) {
      const selectedCat = this.optionsCat[0];
      this.loadExamScores(selectedCat.id);
    }

    // сеттим значение формы в сервис
    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });

    this.loading = false;
  }

  /**
   * Обновляет кличку выбранного кота при изменении выбора
   */
  public onCatSelect(): void {
    const selectedCatValue = this.form.get('0.cat')?.value;
    if (selectedCatValue) {
      const selectedCat = JSON.parse(selectedCatValue) as IValueCat;
      this.selectedCatName = selectedCat.text;
      this.loadExamScores(selectedCat.id);
    }
  }

  /**
   * Загружает баллы ЕГЭ для выбранного кота и подходящие университеты
   * @param catId ID выбранного кота
   */
  private loadExamScores(catId: number): void {
    this.examService.findExamsByCatId(catId).pipe(
      take(1)
    ).subscribe({
      next: (scores: IExam[]) => {
        this.examScores = scores;
        this.errorMessageStepTwo = null;
        if (scores.length === 0) {
          this.errorMessageStepTwo = 'У этого кота нет результатов экзаменов :(';
        }
        // загружаем университеты на основе суммы баллов
        const totalScore = this.getTotalScore();
        this.loadUniversities(totalScore);
      },
      error: () => {
        this.examScores = [];
        this.errorMessageStepTwo = 'Произошла ошибка при загрузке баллов К-ЕГЭ';
      }
    });
  }

  /**
   * Загружает подходящие университеты на основе суммы баллов кота
   * @param score сумма баллов кота
   */
  private loadUniversities(score: number): void {
    this.universityService.findUniversitiesByScore(score).pipe(
      take(1),
      catchError(() => {
        this.errorMessageStepThree = 'Произошла ошибка при загрузке университетов';
        return of([]);
      })
    ).subscribe((universities: IUniversity[]) => {
      // сортировка университетов по убыванию проходного балла
      this.universities = universities
        .filter(university => university.universityScore <= score)
        .sort((a, b) => b.universityScore - a.universityScore);
      this.errorMessageStepThree = null;
      if (universities.length === 0) {
        this.errorMessageStepThree = 'Нет подходящих университетов для данного кота :(';
      }
    });
  }

  /**
   * Возвращает общую сумму баллов кота по экзаменам
   */
  protected getTotalScore(): number {
    return this.examScores.reduce((total, exam) => total + exam.score, 0);
  }

  /**
   * Возвращает json в виде строки
   * @param type
   * @param index
   */
  public getItem(type: 'cat', index: number): string {
    return JSON.stringify(this.optionsCat[index]);
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
