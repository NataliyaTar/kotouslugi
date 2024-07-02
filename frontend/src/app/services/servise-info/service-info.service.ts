// Файл не трогаем

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IActiveStep, IServiceForms, IStep } from '@models/step.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { IPreview } from '@models/common.model';
import { TForm } from '../../modules/add-cat/add-cat.component';
import { IService } from '@models/service.model';
import { UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ServiceInfoService {

  // хранение значения активного шага для использования из разных компонентов
  private activeStep$ = new BehaviorSubject<IActiveStep>(null);
  public activeStep = this.activeStep$.asObservable();

  // хранение формы для использования из разных компонентов
  public servicesForms$ = new BehaviorSubject<IServiceForms>(null);

  private serviceApi = '/api/';

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Возвращает список услуг
   */
  public getServices(): Observable<IService[]> {
    // return this.http.get<IService[]>(`${this.serviceApi}listService`);
    return of([
      {
        id: 0,
        mnemonic: 'new_family',
        icon: 'cupid.png',
        title: 'Регистрация брака',
        tag: 'Семья и дети',
        description: 'Вступайте в брак легко и быстро с котоуслугами'
      },
      {
        id: 1,
        mnemonic: 'vet',
        icon: 'sick.webp',
        title: 'Запись на прием к ветеринару',
        tag: 'Медицина',
        description: 'Подходи ответственно к своему здоровью. Здоровый ты - здоровая страна'
      },
      {
        id: 2,
        mnemonic: 'spa',
        icon: 'relax.png',
        title: 'SPA-процедуры',
        tag: 'Отдых и развлечение',
        description: 'Устали от бесконечной работы и гонки за мышами? Пора записаться на расслабляющие процедуры'
      }
    ]);
  }

  /**
   * Возвращает список шагов для услуги
   * @param idService - мнемоника услуги
   */
  public getSteps(idService: string): Observable<IStep[]> {
    return this.http.get<IStep[]>(`/assets/jsons/services-orders/${idService}.json`);
  }

  /**
   * Устанавливает значение для активного шага
   * Нужно для обращения к параметру из разных компонентов
   * @param idService - мнемоника услуги
   * @param step - шаг
   */
  public setActiveStep(idService: string, step: number): void {
    this.activeStep$.next({
      [idService]: step
    });
  }

  /**
   * Возвращает json для отображения предпросмотра заполненной информации
   * @param rawValue - значение формы
   * @param steps - список шагов
   * @param FormMap - маппинг
   */
  public prepareDataForPreview(rawValue: any, steps: IStep[], FormMap: any): Array<IPreview[]> {
    const arr: Array<IPreview[]> = [];

    Object.keys(rawValue).forEach((step, index) => {
      if (rawValue[step]) {
        const stepArr: any[] = [{title: steps[index].title}];

        Object.keys(rawValue[step]).forEach((key) => {
          let value = rawValue[step][key];
          try {
            value = JSON.parse(value)?.text ?? value;
          } catch (error) {}

          stepArr.push({
            name: FormMap[key],
            value: value || '-'
          });
        });

        arr.push(stepArr);
      }
    });

    return arr;
  }

  /**
   * Сохраняет запись на услугу
   * @param mnemonicService - мнемоника услуги
   * @param rawValue - значение из формы
   */
  public saveOrder(mnemonicService: string, rawValue: any): any {
    let res: {[key: string]: any} = {
      mnemonic: mnemonicService
    };

    Object.keys(rawValue).forEach((step, index) => {
      let stepValue: {[key: string]: string | number} = {};

      Object.keys(rawValue[step]).forEach(key => {
        let value = rawValue[step][key];
        try {
          value = JSON.parse(value)?.id ?? value;
        } catch (error) {}
        Object.assign(stepValue, {[key]: value});
      });

      Object.assign(res, {[step]: stepValue});
    });

    return this.http.post(`${this.serviceApi}addOrder`, res);
  }
}
