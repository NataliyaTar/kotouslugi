import { Injectable } from '@angular/core';
import { IUniversity } from '@models/university.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {

  private universityApi = '/api/university/';

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Возвращает список университетов по сумме баллов К-ЕГЭ котика
   * @param score сумма баллов кота
   */
  public findUniversitiesByScore(score: number): Observable<IUniversity[]> {
    return this.http.get<IUniversity[]>(`${this.universityApi}eligible?score=${score}`);
  }
}
