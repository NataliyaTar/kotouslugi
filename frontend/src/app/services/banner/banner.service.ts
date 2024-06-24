// Файл не трогаем

import { Injectable } from '@angular/core';
import { IBanner } from '@models/banner.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  private bannerApi = '/api/banner/';

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Возвращает список баннеров
   */
  public getBanners(): Observable<IBanner[]> {
    return this.http.get<IBanner[]>(`/assets/jsons/main-banners.json`);
    // return this.http.get<IBanner[]>(`${this.bannerApi}listBanner`);
  }
}
