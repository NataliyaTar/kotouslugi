// Файл не трогаем

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, forkJoin } from 'rxjs';
import { EStatus, IOrder, TStatus } from '@models/order.model';

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
   * Сохраняет запись на услугу через BookingController
   * @param mnemonicService - мнемоника услуги
   * @param rawValue - значение из формы
   */
  public saveOrder(mnemonicService: string, rawValue: any): Observable<any> {
    const step0 = rawValue[0] || {};
    const step1 = rawValue[1] || {};
    const step2 = rawValue[2] || {};

    let startTime = null;
    if (step2.date && step2.time) {
      startTime = `${step2.date}T${step2.time}:00`;
    }

    let catId = step0.cat;
    try {
      catId = JSON.parse(step0.cat)?.id ?? step0.cat;
    } catch {}
    let serviceId = step1.service;
    if (typeof serviceId === 'string') {
      serviceId = parseInt(serviceId, 10);
    }

    const bookingRequest = {
      catId: Number(catId),
      idTypeService: Number(serviceId),
      startTime: startTime,
      contactNumber: step0.telephone,
      contactEmail: step0.email
    };

    return this.http.post('/api/booking', bookingRequest);
  }


  public getBookingRequests(): Observable<any[]> {
    return this.http.get<any[]>(`/api/booking/bookings`);
  }


  public getAllOrders(): Observable<IOrder[]> {
    return forkJoin([
      this.getOrdersList(),
      this.getBookingRequests()
    ]).pipe(
      map(([orders, bookings]) => {
        const mappedBookings: IOrder[] = bookings.map(b => ({
          id: String(b.id),
          name: 'Груминг',
          mnemonic: 'grooming',
          status: 'FILED',
          created: b.startTime,
          fields: JSON.stringify({
            catId: b.catId,
            contactEmail: b.contactEmail,
            contactNumber: b.contactNumber,
            idTypeService: b.idTypeService
          })
        }));
        return [...orders, ...mappedBookings];
      })
    );
  }

}
