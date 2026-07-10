import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFine, IReceipt } from '@models/fine.model';

@Injectable({
  providedIn: 'root'
})
export class FineService {

  private fineApi = '/api/fine/';

  // чек последней оплаты (читает страница чека)
  public receipt: IReceipt = null;

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Возвращает штрафы конкретного кота
   * @param catId - id кота
   */
  public getFinesByCat(catId: number): Observable<IFine[]> {
    return this.http.get<IFine[]>(`${this.fineApi}listByCat`, {
      params: { catId }
    });
  }

  /**
   * Оплачивает штраф (меняет статус на PAID)
   * @param id - id штрафа
   */
  public payFine(id: number): Observable<IFine> {
    return this.http.post<IFine>(`${this.fineApi}pay`, null, {
      params: { id }
    });
  }
}
