import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IActiveStep, IServiceForms, IStep } from '@models/step.model';
import { BehaviorSubject, Observable } from 'rxjs';

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
}
