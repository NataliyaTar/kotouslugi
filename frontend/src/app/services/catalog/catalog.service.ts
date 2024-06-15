import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IService } from '@models/service.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(
    public http: HttpClient,
  ) { }

  public getServices(): Observable<IService[]> {
    // return this.http.get<IService[]>(``);
    return of([
      {
        id: 'new_family',
        icon: 'cupid.png',
        title: 'Регистрация брака',
        tag: 'Семья и дети',
        description: 'Вступайте в брак легко и быстро с котоуслугами'
      },
      {
        id: 'vet',
        icon: 'sick.webp',
        title: 'Запись на прием к ветеринару',
        tag: 'Медицина',
        description: 'Подходи ответственно к своему здоровью. Здоровый ты - здоровая страна'
      },
      {
        id: 'spa',
        icon: 'relax.png',
        title: 'SPA-процедуры',
        tag: 'Отдых и развлечение',
        description: 'Устали от бесконечной работы и гонки за мышами? Пора записаться на расслабляющие процедуры'
      }
    ]);
  }
}
