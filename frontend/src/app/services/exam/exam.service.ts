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
   * Возвращает баллы К-ЕГЭ кота по его id
   * @param catId id кота
   */
  public findExamsByCatId(catId: number): Observable<IExam[]> {
    return this.http.get<IExam[]>(`${this.examApi}cat/${catId}`);
  }
}
