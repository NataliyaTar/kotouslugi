import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IDrivingSchool {
  id: number;
  name: string;
  overallRating: number;
  maxPerSlot: number;
}

export interface ILicenseCategory {
  id: number;
  code: string;
  name: string;
  minAge: number;
}

@Injectable({
  providedIn: 'root'
})
export class DrivingSchoolService {
  private apiUrl = '/api/driving-school';

  constructor(private http: HttpClient) {}

  /**
   * GET /api/driving-school/list
   * Получить список автошкол
   */
  getSchools(): Observable<IDrivingSchool[]> {
    return this.http.get<IDrivingSchool[]>(`${this.apiUrl}/list`);
  }

  /**
   * GET /api/driving-school/categories
   * Получить список категорий прав
   */
  getCategories(): Observable<ILicenseCategory[]> {
    return this.http.get<ILicenseCategory[]>(`${this.apiUrl}/categories`);
  }
}
