// Файл не трогаем

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IOrder } from '@models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderApi = '/api';

  constructor(
    public http: HttpClient,
  ) { }

  public getOrdersList(): Observable<IOrder[]> {
    // return this.http.get<IOrder[]>(`${this.orderApi}`);
    return of([]);
  }
}
