import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IService } from '@models/service.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(
    public http: HttpClient,
  ) { }

  public getServices(): Observable<IService[]> {
    return this.http.get<IService[]>(``);
  }
}
