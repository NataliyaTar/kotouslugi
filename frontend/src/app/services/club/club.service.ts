// Файл не трогаем

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IClub } from '@models/club.model';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  private clubApi = 'api/club/';

  constructor(
    public http: HttpClient,
  ) { }

  /**
   * Возвращает список котов
   */
  public getClubList(): Observable<IClub[]> {
    return this.http.get<IClub[]>(`${this.clubApi}list`);
  }


  /**
   * Сохраняет кота в БД
   * @param clubInfo - данные с формы
   */
  public addCat(clubInfo: any) {
    return this.http.post<IClub>(`${this.clubApi}add`, this.prepareInfo(clubInfo));
  }

  /**
   * Преобразует данные с формы для отправки на бэк
   * @param clubInfo - данные с формы
   */
  private prepareInfo(clubInfo: any) {
    let res: {[key: string]: string | number} = {};

    Object.keys(clubInfo).forEach(key => {
      let value = clubInfo[key];
      try {
        value = JSON.parse(value)?.id ?? value;
      } catch (error) {}
      Object.assign(res, {[key]: value});
    });

    return res;
  }

  /**
   * Удаляет кота из БД
   * @param id
   */
  public deleteCat(id: number) {
    return this.http.delete<IClub>(`${this.clubApi}deleteClub`, {
      params: {
        id
      }
    });
  }

}
