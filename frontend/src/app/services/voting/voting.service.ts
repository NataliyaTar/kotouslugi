import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICastVoteRequest, ICastVoteResponse, IPartyVoteResult } from '@models/vote.model';

@Injectable({
  providedIn: 'root'
})
export class VotingService {

  private readonly voteApi = '/api/vote/';

  constructor(private http: HttpClient) {}

  /**
   * Текущий избирательный период в формате YYYY-(YYYY+1).
   * С сентября начинается новый период, до сентября — предыдущий.
   */
  public getCurrentElectionPeriod(date: Date = new Date()): string {
    const year = date.getFullYear();
    const startYear = date.getMonth() >= 8 ? year : year - 1;
    return `${startYear}-${startYear + 1}`;
  }

  public castOnline(dto: ICastVoteRequest): Observable<ICastVoteResponse> {
    return this.http.post<ICastVoteResponse>(`${this.voteApi}online`, dto).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => new Error(this.mapVoteError(error))),
      ),
    );
  }

  /** GET /api/vote/getRes?t={period} */
  public getResults(period: string): Observable<IPartyVoteResult[]> {
    const params = new HttpParams().set('t', period);
    return this.http.get<IPartyVoteResult[]>(`${this.voteApi}getRes`, { params }).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => new Error(this.mapVoteError(error))),
      ),
    );
  }

  public buildRequest(
    catId: number,
    partyName: string,
    passportNumber: string,
    electionPeriod: string = this.getCurrentElectionPeriod(),
  ): ICastVoteRequest {
    return {
      catId,
      partyName,
      electionPeriod,
      passportNumber,
    };
  }

  public mapVoteError(error: HttpErrorResponse): string {
    const backendMessage = typeof error.error === 'string' ? error.error.trim() : '';
    if (backendMessage) {
      return backendMessage;
    }

    switch (error.status) {
      case 403:
        return 'Голосование доступно только котам с 3 лет';
      case 404:
        return 'Не найдены кот, паспорт или партия';
      case 409:
        return 'Вы уже проголосовали в этих выборах';
      default:
        return 'Произошла ошибка, повторите попытку позже';
    }
  }
}
