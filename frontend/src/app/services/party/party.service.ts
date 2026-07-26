import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICreatePartyRequest, IPoliticalParty } from '@models/party.model';

@Injectable({
  providedIn: 'root'
})
export class PartyService {

  private readonly partyApi = '/api/party/';

  constructor(private http: HttpClient) {}

  /** GET /api/party/get */
  public getParties(): Observable<IPoliticalParty[]> {
    return this.http.get<IPoliticalParty[]>(`${this.partyApi}get`).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => new Error(this.mapPartyError(error))),
      ),
    );
  }

  /** POST /api/party/add */
  public addParty(dto: ICreatePartyRequest): Observable<IPoliticalParty> {
    return this.http.post<IPoliticalParty>(`${this.partyApi}add`, dto).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => new Error(this.mapPartyError(error))),
      ),
    );
  }

  public mapPartyError(error: HttpErrorResponse): string {
    const backendMessage = typeof error.error === 'string' ? error.error.trim() : '';
    if (backendMessage) {
      return backendMessage;
    }

    switch (error.status) {
      case 403:
        return 'Кандидат должен быть старше 3 лет';
      case 404:
        return 'Кот-кандидат не найден';
      case 409:
        return 'Партия с таким названием уже существует';
      default:
        return 'Произошла ошибка, повторите попытку позже';
    }
  }
}
