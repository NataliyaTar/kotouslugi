// Файл не трогаем

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IActiveStep, IServiceForms, IStep } from '@models/step.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPreview } from '@models/common.model';
import { TForm } from '../../modules/add-cat/add-cat.component';

@Injectable({
  providedIn: 'root'
})
export class ServiceInfoService {

  private activeStep$ = new BehaviorSubject<IActiveStep>(null);
  public activeStep = this.activeStep$.asObservable();

  public servicesForms$ = new BehaviorSubject<IServiceForms>(null);

  constructor(
    private http: HttpClient,
  ) { }

  public getSteps(idService: string): Observable<IStep[]> {
    return this.http.get<IStep[]>(`/assets/jsons/services-orders/${idService}.json`);
  }

  public setActiveStep(idService: string, step: number): void {
    this.activeStep$.next({
      [idService]: step
    });
  }

  public prepareData(rawValue: any, steps: IStep[], FormMap: any): Array<IPreview[]> {
    const arr: Array<IPreview[]> = [];

    Object.keys(rawValue).forEach((step, index) => {
      if (rawValue[step]) {
        const stepArr: any[] = [{title: steps[index].title}];

        Object.keys(rawValue[step]).forEach((key) => {
          stepArr.push({
            name: FormMap[key],
            value: (typeof rawValue[step][key] === 'string' ? rawValue[step][key] : rawValue[step][key].text) || '-'
          });
        });

        arr.push(stepArr);
      }
    });

    return arr;
  }
}
