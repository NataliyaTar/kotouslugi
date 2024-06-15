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
        id: 'born',
        icon: 'two-cats.png',
        title: 'Регистрация рождения котят',
        tag: 'Семья и дети',
        description: 'При рождении трех и более котят, вы можете получить субсидии в виде пачки корма'
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
