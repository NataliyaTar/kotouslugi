import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IVaccineType } from '@models/vaccine.model';

@Injectable({
  providedIn: 'root'
})
export class VaccineService {
  private apiUrl = 'api/vaccination/';

  constructor(private http: HttpClient) {}

  public getVaccineTypes(): Observable<IVaccineType[]> {
      return this.http.get<IVaccineType[]>(`${this.apiUrl}all`);
    }
}
