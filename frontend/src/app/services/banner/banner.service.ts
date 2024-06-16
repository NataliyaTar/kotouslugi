// Файл не трогаем

import { Injectable } from '@angular/core';
import { IBanner } from '@models/banner.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(
    private http: HttpClient,
  ) { }

  public getBanners(prefix: string): Observable<IBanner[]> {
    return this.http.get<IBanner[]>(`/assets/jsons/${prefix}-banners.json`);
  }
}
