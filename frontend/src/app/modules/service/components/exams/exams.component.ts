import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators} from "@angular/forms";
import {CheckInfoComponent} from "@components/check-info/check-info.component";
import {ThrobberComponent} from "@components/throbber/throbber.component";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {ICat, IValueCat} from "@models/cat.model";
import {IStep} from "@models/step.model";
import {Subscription, take} from "rxjs";
import {ServiceInfoService} from "@services/servise-info/service-info.service";
import {ConstantsService} from "@services/constants/constants.service";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {CatService} from "@services/cat/cat.service";
import {ExamService} from "@services/exam/exam.service";
import {IExam} from "@models/exam.model";

export enum FormMap { // маппинг названия поля - значение
  cat  = 'Кличка',
  subject  = 'Предмет',
  university = 'Университет'
}

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent,
    JsonPipe,
    ThrobberComponent,
    NgForOf,
    NgIf,
  ],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.scss'
})
export class ExamsComponent implements OnInit, OnDestroy  {

  public loading = true; // загружена ли информация для страницы
  public form: UntypedFormGroup; // форма
  public active: number; // активный шаг формы
  public optionsCat: IValueCat[]; // список котов
  public examScores: IExam[] = []; // баллы ЕГЭ кота
  public selectedCatName: string; // кличка выбранного кота
  public errorMessage: string | null = null; // сообщение об ошибке
  //public cats: ICat[]; // один кот
  /*public optionsSubject: IValueSubject[]; // список предметов
  public optionsUniversity: IValueUniversity[]; // список университетов
  */

  private idService: string; // мнемоника услуги
  private steps: IStep[]; // шаги формы
  private subscriptions: Subscription[] = [];

  /**
   * Возвращает преобразованное значение формы для отображения заполненных данных
   */
  public get getResult() {
    return this.serviceInfo.prepareDataForPreview(this.form.getRawValue(), this.steps, FormMap);
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private constantService: ConstantsService,
    //protected catService: CatService,
    private examService: ExamService,
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
      1: this.fb.group({
        //
      }),
       /*2: this.fb.group({
         university: [JSON.stringify(this.optionsUniversity[0]), [Validators.required]]
       })*/
    });

    // Возвращаем кличку кота
    this.selectedCatName = this.optionsCat[0]?.text || '';

    // Загрузка баллов для кота с id = 0
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
   * Загружает баллы ЕГЭ для выбранного кота
   * @param catId ID выбранного кота
   */
  private loadExamScores(catId: number): void {
    this.examService.findExamsByCatId(catId).subscribe({
      next: (scores: IExam[]) => {
        this.examScores = scores;
        this.errorMessage = null;
        if (scores.length === 0) {
          this.errorMessage = 'У этого кота нет результатов экзаменов';
        }
      },
      error: () => {
        this.examScores = [];
        this.errorMessage = 'Произошла ошибка при загрузке баллов К-ЕГЭ';
      }
    });
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
