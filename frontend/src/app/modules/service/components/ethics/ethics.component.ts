import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { IValueCat, ICat } from '@models/cat.model';
import { Subscription, take } from 'rxjs';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute } from '@angular/router';
import { CatService } from '@services/cat/cat.service';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { IStep } from '@models/step.model';
import { JsonPipe } from '@angular/common';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

export enum FormMap {
  // 0
  cat  = 'Имя кошечки',
  course = 'Тип курса',
  date = 'Дата',
  time = 'Время',

  // 1
  teacher = "Учитель",
  teacherInfo = "Об учителе",

  // 2
  owner = 'Имя владельца',
  telephone = 'Телефон для связи',
  email = 'Email для связи',
}

@Component({
  selector: 'app-ethics',
    standalone: true,
    imports: [
      ReactiveFormsModule,
      CheckInfoComponent,
      JsonPipe,
      ThrobberComponent,
      HttpClientModule,
    ],
  templateUrl: './ethics.component.html',
  styleUrls: ['./ethics.component.scss']
})


export class EthicsComponent implements OnInit, OnDestroy{

  public loading = true; // загружена ли информация для страницы
  public form: UntypedFormGroup; // форма
  public active: number; // активный шаг формы
  public optionsCat: IValueCat[]; // список котов
  public teacherOptions = this.constantService.teacherOptions; // список учителей
  public courseOptions = this.constantService.courseOptions; // список курсов

  private idService: string; // мнемоника услуги
  private steps: IStep[]; // шаги формы
  private subscriptions: Subscription[] = [];

  public cat: string | null = null;
  public date: Date | null = new Date();
  public time: string | null = "";
  public course: string | null = null;
  public teacher: string | null = null;
  public teacherInfo: string | null = '';
  public owner: string | null = null;
  public telephone: string | null = "";
  public email: string | null = '';

  /**
   * Возвращает преобразованное значение формы для отображения заполненных данных
   */
  public get getResult() {
    return this.serviceInfo.prepareDataForPreview(this.form.getRawValue(), this.steps, FormMap);
  }

  resetFields(): void {
    this.form.reset();
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private catService: CatService,
    private constantService: ConstantsService,
  ) {
  }

  public submitEthicsRecord() {
     const dateStr = this.date; // 'YYYY-MM-DD'
     const timeStr = this.time; // 'HH:mm'
     const startTimeStr = `${dateStr}T${timeStr}:00`; // 'YYYY-MM-DDTHH:mm'

     const data = {
       catName: this.cat,
       startTime: startTimeStr,
       courseType: this.course,
       teacherName: this.teacher,
       teacherAbout: this.teacherInfo,
       ownerName: this.owner,
       phoneNumber: this.telephone,
       email: this.email
     };

     const jsonData = JSON.stringify(data);
     console.log(jsonData);

     fetch('/api/ethics/add', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: jsonData
     })

     .then(response => response.text())
     .then(data => {
       alert("Вы успешно оставили свой отзыв. Нажмите 'OK'");

     })
     .catch(error => {
       alert("Произошла ошибка. Проверьте правильность введенных данных и попробуйте еще раз.");
     });
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
        cat: ['', [Validators.required]],
        course: ['', [Validators.required]],
        date: ['', [Validators.required, this.dateValidator]],
        time: ['', [Validators.required]],
      }, { validators: this.dateTimeValidator }),
      1: this.fb.group({
        teacher: ['', [Validators.required, Validators.max(256)]],
        teacherInfo: ['', [Validators.max(256)]],

      }),
      2: this.fb.group({
        owner: ['', [Validators.required,  Validators.pattern(/^[А-Яа-яЁё]{1,48}$/)]],
        telephone: ['', [Validators.required, Validators.pattern(/^8/), this.phoneValidator]],
        email: ['', [Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)]]
      })
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });

    this.loading = false;
  }

  /**
   * Кастомная валидация для даты
   * @param control
   * @private
   */
  private dateValidator(control: FormControl) {
    const d1 = new Date(control.value);
    const d2 = new Date();

    const sameYear = d1.getFullYear() === d2.getFullYear();
    const sameMonth = d1.getMonth() === d2.getMonth();
    const sameDay = d1.getDate() === d2.getDate();

    if (sameYear && sameMonth && sameDay) {
          return null; // даты совпадают — валидно
    }
    if (d1 < d2) {
      return {minDate: true} // дата раньше текущей - не валидно
    }
    return null // дата позже текущей - валидно

  }
  private phoneValidator(control: FormControl) {
    const phoneNumber = control.value;
    if (phoneNumber.length === 11) {
      return null
    }
    return {phoneLen: true}
  }

  private dateTimeValidator(group: FormGroup) {
    const dateControl = group.get('date');
    const timeControl = group.get('time');

    const dateValue = dateControl.value;
    const timeValue = timeControl.value;

    const selectedDate = new Date(dateValue);
    const now = new Date();

    if (selectedDate.getFullYear() === now.getFullYear()
    && selectedDate.getMonth() === now.getMonth()
    && selectedDate.getDate() === now.getDate()) {
        const [hours, minutes] = timeValue.split(':').map(Number);
        if (hours <= now.getHours()) {
          // при одинаковой дате одинаковый час = ошибка
          return { minTime: true };
        }
    }
    return null; // валидно
  }
  private getDateTime(group: FormGroup) {
      const dateControl = group.get('date');
      const timeControl = group.get('time');
       if (dateControl && timeControl) {
          const dateValue = dateControl.value; // ожидается, что это строка или Date
          const timeValue = timeControl.value; // ожидается, что это строка, например, '14:30'

          if (dateValue && timeValue) {
            // Если dateValue — это строка в формате 'YYYY-MM-DD' или Date
            const dateObj = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;

            // Проверка, что dateObj действительно Date
            if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
              return null;
            }

            // Получение компонентов даты
            const year = dateObj.getFullYear();
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const day = dateObj.getDate().toString().padStart(2, '0');

            // Предположим, что timeValue в формате 'HH:mm'
            const [hours, minutes] = timeValue.split(':');

            // Формируем строку в формате ISO 8601: 'YYYY-MM-DDTHH:mm'
            const localDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

            return localDateTime;
          }
        }
       return null;
  }


  /**
   * Возвращает json в виде строки
   * @param type
   * @param index
   */
  public getItem(type: 'cat' | 'tea' | 'cou', index: number): string {
    if (type === 'cat') {
      return JSON.stringify(this.optionsCat[index]);
    }
    if (type === 'cou') {
        return JSON.stringify(this.courseOptions[index]);
    }
    return JSON.stringify(this.teacherOptions[index]);
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


