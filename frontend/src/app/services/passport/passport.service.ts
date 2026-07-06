import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPassportDetail } from '@models/passport.model';

@Injectable({
  providedIn: 'root'
})
export class PassportService {

  private passportApi = '/api/passport/';

  constructor(private http: HttpClient) {}

  public getPassportList(): Observable<IPassportDetail[]> {
    return this.http.get<IPassportDetail[]>(`${this.passportApi}list`);
  }

  public getPassport(id: number): Observable<IPassportDetail> {
    return this.http.get<IPassportDetail>(`${this.passportApi}get?id=${id}`);
  }

  public getPassportByCat(catId: number): Observable<IPassportDetail> {
    return this.http.get<IPassportDetail>(`${this.passportApi}byCat?catId=${catId}`);
  }

  public searchPassports(query: string): Observable<IPassportDetail[]> {
    const encoded = encodeURIComponent(query.trim());
    return this.http.get<IPassportDetail[]>(`${this.passportApi}search?query=${encoded}`);
  }
}
