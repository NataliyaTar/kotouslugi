import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IPlace} from "@models/place.model";

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
}
