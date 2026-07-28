import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IExhibition, IExhibitionReview } from '@models/exhibition.model';

@Injectable({
  providedIn: 'root'
})
export class ExhibitionService {

  private baseUrl = '/api/exhibitions';

  constructor(
    private http: HttpClient,
  ) { }

  public getExhibitions(): Observable<IExhibition[]> {
    return this.http.get<IExhibition[]>(this.baseUrl);
  }

  public submitReview(exhibitionId: number, review: IExhibitionReview): Observable<IExhibitionReview> {
    return this.http.post<IExhibitionReview>(`${this.baseUrl}/${exhibitionId}/review`, review);
  }

}
