import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICastVoteRequest, ICastVoteResponse } from '@models/vote.model';

@Injectable({
  providedIn: 'root'
})
export class VotingService {

  public readonly electionPeriod = '2024-2025';

  private readonly voteApi = '/api/vote/';

  constructor(private http: HttpClient) {}

  public castOnline(dto: ICastVoteRequest): Observable<ICastVoteResponse> {
    return this.http.post<ICastVoteResponse>(`${this.voteApi}online`, dto).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => new Error(this.mapVoteError(error))),
      ),
    );
  }

  public buildRequest(
    catId: number,
    partyName: string,
    passportNumber: string,
  ): ICastVoteRequest {
    return {
      catId,
      partyName,
      electionPeriod: this.electionPeriod,
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
