// Файл не трогаем

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { EStatus, IOrder, TStatus } from '@models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderApi = '/api';

  constructor(
    public http: HttpClient,
  ) { }

  /**
   * Возвращает список заявок
   */
  public getOrdersList(): Observable<IOrder[]> {
    // return this.http.get<IOrder[]>(`${this.orderApi}`);
    return of([
      {
        id: '0',
        title: 'Регистрация брака',
        status: 'FILED'
      },
      {
        id: '2',
        title: 'Запись на прием к ветеринару',
        status: 'UNDER_CONSIDERATION'
      },
      {
        id: '3',
        title: 'Регистрация брака',
        status: 'REJECTED'
      },
      {
        id: '4',
        title: 'Запись на прием к ветеринару',
        status: 'ACCEPTED'
      },
      {
        id: '5',
        title: 'Регистрация брака',
        status: 'DONE'
      },
    ]);
  }

  /**
   * Возвращает значение статуса заявки в человеческом виде
   * @param statusId
   */
  public getStatusMap(statusId: TStatus): EStatus {
    return EStatus[statusId];
  }
}
