// Файл не трогаем

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { EStatus, IOrder, TStatus, IRequisition } from '@models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderApi = '/api/requisition/';

  constructor(
    public http: HttpClient,
  ) {
  }

  /**
   * Возвращает список заявок
   */
  public getOrdersList(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.orderApi}list`);
  }

  /**
   * Возвращает значение статуса заявки в человеческом виде
   * @param statusId
   */
  public getStatusMap(statusId: TStatus): EStatus {
    return EStatus[statusId];
  }

  /**
   * Сохраняет запись на услугу
   * @param mnemonicService - мнемоника услуги
   * @param rawValue - значение из формы
   */
  public saveOrder(mnemonicService: string, rawValue: any): Observable<any> {
    let res: { [key: string]: any } = {
      mnemonic: mnemonicService
    };
    let fields = <any>[];

    Object.keys(rawValue).forEach((step, index) => {
      let stepValue: { [key: string]: string | number } = {
        id: index
      };

      Object.keys(rawValue[step]).forEach(key => {
        let value = rawValue[step][key];
        try {
          value = JSON.parse(value)?.id ?? value;
        } catch (error) {
        }
        Object.assign(stepValue, {[key]: value});
      });

      fields.push(stepValue);
    });

    Object.assign(res, {fields: JSON.stringify(fields)});

    return this.http.post(`${this.orderApi}create`, res);
  }

  public createRequisition(payload: IRequisition): Observable<any> {
    return this.http.post<any>('api/requisition/create', {
      mnemonic: 'workout',
      fields: JSON.stringify(payload)
    });
  }
}
