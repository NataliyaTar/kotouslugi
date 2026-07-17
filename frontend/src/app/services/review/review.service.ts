import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IReviewRequest {
  catId: number;
  schoolName: string;
  schoolRating: number;
  comment: string;
}

export interface IReviewResponse {
  id: number;
  cat: { id: number };
  schoolName: string;
  schoolRating: number;
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = '/api/school-review';

  constructor(private http: HttpClient) {}

  /**
   * POST /api/school-review/create
   * Создать отзыв
   */
  createReview(data: IReviewRequest): Observable<number> {
    const body = {
      cat: { id: data.catId },
      schoolName: data.schoolName,
      schoolRating: data.schoolRating,
      comment: data.comment
    };
    return this.http.post<number>(`${this.apiUrl}/create`, body);
  }

  /**
   * GET /api/school-review/list
   * Получить все отзывы
   */
  getReviews(): Observable<IReviewResponse[]> {
    return this.http.get<IReviewResponse[]>(`${this.apiUrl}/list`);
  }

  /**
   * GET /api/school-review/by-school?schoolName={name}
   * Получить отзывы по автошколе
   */
  getReviewsBySchool(schoolName: string): Observable<IReviewResponse[]> {
    const params = new HttpParams().set('schoolName', schoolName);
    return this.http.get<IReviewResponse[]>(`${this.apiUrl}/by-school`, { params });
  }
}
