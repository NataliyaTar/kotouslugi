import { Injectable } from '@angular/core';
import { IExam } from '@models/exam.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private examApi = '/api/exam/';

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Возвращает список экзаменов

  public getExams(): Observable<IExam[]> {
    return this.http.get<IExam[]>(`${this.examApi}list`);
  } */

  /**
   * Возвращает баллы ЕГЭ кота по его ID
   * @param catId ID кота
   */
  public findExamsByCatId(catId: number): Observable<IExam[]> {
    return this.http.get<IExam[]>(`${this.examApi}cat/${catId}`);
  }
}
