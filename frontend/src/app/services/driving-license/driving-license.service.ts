import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IDriverLicenseResponse {
  id: number;
  catName: string;
  age: number;
  breed: string;
  categories: string;
  drivingSchool: string;
  examDate: string;
  examTime: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class DrivingLicenseService {
  private apiUrl = '/api/driver-license';

  constructor(private http: HttpClient) {}

  getApplications(): Observable<IDriverLicenseResponse[]> {
    return this.http.get<IDriverLicenseResponse[]>(`${this.apiUrl}/list`);
  }
}
