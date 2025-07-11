import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ICat {
  id: number;
  name: string;
  sex: string;
  breed: string;
}

export interface IHotel {
  id: number;
  name: string;
  address: string;
}

export interface IBookingPayload {
  catId: number;
  hotelId: number;
  recordStart: string;
  recordFinish: string;
}


@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private baseUrl = 'api/hotel/';

  constructor(private http: HttpClient) {}

  getCatsAndHotels(): Observable<{ cats: ICat[], hotels: IHotel[] }> {
    return this.http.get<{ cats: ICat[], hotels: IHotel[] }>(`${this.baseUrl}options`);
  }

  checkSpace(hotelId: number, startDate: string, endDate: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}check-space`, {
      params: {
        hotelId: hotelId.toString(),
        startDate,
        endDate
      }
    });
  }

  bookOverexposure(payload: IBookingPayload): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}book`, payload);
  }
}
