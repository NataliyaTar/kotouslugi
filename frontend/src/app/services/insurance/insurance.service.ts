import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IInsurance } from '@models/insurance.model';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {

  private insuranceApi = 'api/requisition/';

  constructor(
    public http: HttpClient,
  ) { }

  /**
   * Возвращает список страховых компаний
   */
  public getInsuranceList(): Observable<ICat[]> {
    return this.http.get<IInsurance[]>(`${this.insuranceApi}insurance/info`);
  }
}
