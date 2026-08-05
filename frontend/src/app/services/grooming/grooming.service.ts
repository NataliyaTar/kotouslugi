import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGroomer, IGroomingAppointment, IGroomingNotification, IGroomingSalon, IGroomingSlot } from '@models/grooming.model';

@Injectable({
  providedIn: 'root'
})
export class GroomingService {
  private groomingApi = '/api/grooming/';

  constructor(private http: HttpClient) {}

  public getSalons(): Observable<IGroomingSalon[]> {
    return this.http.get<IGroomingSalon[]>(`${this.groomingApi}salons`);
  }

  public getGroomers(salonId: number): Observable<IGroomer[]> {
    return this.http.get<IGroomer[]>(`${this.groomingApi}groomers?salonId=${salonId}`);
  }

  public getSlots(salonId: number, visitDate: string): Observable<IGroomingSlot[]> {
    return this.http.get<IGroomingSlot[]>(`${this.groomingApi}slots?salonId=${salonId}&visitDate=${visitDate}`);
  }

  public getAppointments(catId: number): Observable<IGroomingAppointment[]> {
    return this.http.get<IGroomingAppointment[]>(`${this.groomingApi}appointments?catId=${catId}`);
  }

  public getNotifications(catId: number): Observable<IGroomingNotification[]> {
    return this.http.get<IGroomingNotification[]>(`${this.groomingApi}notifications?catId=${catId}`);
  }

  public submitReview(appointmentId: number, rating: number, comment: string): Observable<any> {
    return this.http.post(`${this.groomingApi}review`, {
      appointmentId,
      rating,
      comment
    });
  }
}
