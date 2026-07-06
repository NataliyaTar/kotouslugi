import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDrugVerification, IManufacturer } from '@models/drug.model';

@Injectable({
  providedIn: 'root'
})
export class DrugService {

  private drugApi = '/api/drug/';

  constructor(private http: HttpClient) {}

  public verifyBatch(batchCode: string): Observable<IDrugVerification> {
    return this.http.get<IDrugVerification>(`${this.drugApi}verify?batchCode=${encodeURIComponent(batchCode)}`);
  }

  public getManufacturers(): Observable<IManufacturer[]> {
    return this.http.get<IManufacturer[]>(`${this.drugApi}manufacturers`);
  }
}
