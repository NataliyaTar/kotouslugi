import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IPlace} from "@models/place.model";
import {IServices} from "@models/event_services.model";
import {IAvailableTime} from "@models/available_time.model";

@Injectable({
  providedIn: 'root'
})

export class PlaceService {
  private placeAPI = 'api/entertainment';

  constructor(public http: HttpClient) {
  }

  /*
  * Возвращает список развлекательных мест
  * */

  public getPlacesList(): Observable<IPlace[]> {
    return this.http.get<IPlace[]>(`${this.placeAPI}/venues`);
  }

  public getEventsList(eventID: number): Observable<IServices[]> {
    return this.http.get<IServices[]>(`${this.placeAPI}/venues/${eventID}/events`);
  }

  public getAvailableTimeList(eventID: number): Observable<IAvailableTime> {
    return this.http.get<IAvailableTime>(`${this.placeAPI}/events/${eventID}`);
  }

}
