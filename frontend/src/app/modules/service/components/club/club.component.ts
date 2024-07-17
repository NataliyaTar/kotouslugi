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
import { NgFor, NgIf } from '@angular/common';
import { IValueClub } from '@models/club.model';

export enum FormMap { // маппинг названия поля - значение
  cat  = 'Кличка',
  passport = 'Паспорт',
  ownerName = 'ФИО владельца',
  phone = 'Телефон',
  email = 'Номер телефона',
  kennelName = 'Название питомника',
  status = 'Статус владельца',
  club = 'Название клуба'
}


@Component({
  selector: 'app-club',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent,
    ThrobberComponent,
    RouterModule,
  ],
  templateUrl: './club.component.html',
  styleUrl: './club.component.scss'
})
export class ClubComponent implements OnInit, OnDestroy {

  public loading = true; // загружена ли информация для страницы
  public notEnoughCats = false;
  public notEnoughClubs = false;
  public form: UntypedFormGroup; // форма
  public active: number; // активный шаг формы
  public optionsCatF: IValueCat[]; // список кошек
  private idService: string; // мнемоника услуги
  private steps: IStep[]; // шаги формы
  private subscriptions: Subscription[] = [];
  public clubs: IValueClub[];
  public ownerStatuses = ['Новичок', 'Владелец', 'Заводчик'];



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
  ) {
  }

  public getSelectedClub(): IValueClub {
    const selectedClub = this.getControl(1, 'club').value;
    return selectedClub ? JSON.parse(selectedClub) : null;
  }

  public ngOnInit(): void {
    this.getCatsOptions();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    })
  }

  /**
   * Валидна ли форма
   */
  public isValidStep(): boolean {
    return this.form?.valid;
  }

  /**
   * Проверяем есть ли возможность использовать форму.
   */
  public getCatsOptions(): void {
    this.constantService.getCatOptionsAll().pipe(
     take(1)
    ).subscribe(res => {
      if (!(res.length !=0)) {
        this.notEnoughCats = true;
        this.loading = false;
      } else {
        this.getClubs((flag)=>{
          if(flag){
          this.optionsCatF = res
          this.prepareService();
          }
          else{
          this.loading = false;
          this.notEnoughClubs = true;
          }
        })

      }
    });
  }

  public getClubs(callback: (flag: boolean) => void): void {
  this.constantService.getAllClubs().pipe(
    take(1)
  ).subscribe(res => {
    if (res.length !== 0) {
      this.clubs = res;
      callback(true);
    } else {
      callback(false);
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

  public getItem(type: 'cat', index: number): string {
      return JSON.stringify(this.optionsCatF[index]);
  }

  public getClub(index: number): string {
    return JSON.stringify(this.clubs[index]);
}

  /**
   * Инициализация формы
   * @private
   */
  private initForm(): void {
    this.form = this.fb.group({
      0: this.fb.group
      ({
        cat: [JSON.stringify(this.optionsCatF[0]), [Validators.required]],
        passport: ['', [Validators.required, Validators.pattern(/^[\d]{4} [\d]{6}$/)]],
        ownerName: ['', [Validators.required, Validators.pattern(/^[А-Я][а-я]+[\s][А-Я][а-я]+[\s][А-Я][а-я]+$/)]],
        phone: ['', [Validators.required, Validators.pattern(/^[8][\d]{10}$/)]],
        email: ['', [Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
        kennelName: [''],
        status: [this.ownerStatuses[0], [Validators.required]],
      }),
      1: this.fb.group({
        club: [JSON.stringify(this.clubs[0]), [Validators.required]]
      })
    });
    // сеттим значение формы в сервис
    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });

    this.loading = false;
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
