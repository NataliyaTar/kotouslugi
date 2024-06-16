// Файл не трогаем

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { EBreedMap, ESexMap, ICat, TBreed, TSex } from '@models/cat.model';

@Injectable({
  providedIn: 'root'
})
export class CatService {

  constructor(
    public http: HttpClient,
  ) { }

  public getCatList(): Observable<ICat[]> {
    // return this.http.get<ICat[]>(``);
    // return of([]);
    return of([
      {
        id: 0,
        name: 'Феликс',
        age: '1',
        sex: {
          id: 'male',
          text: 'Кот'
        },
        breed: {
          id: 'siamese',
          text: 'Сиамская'
        }
      },
      {
        id: 1,
        name: 'Снежка',
        age: '2',
        sex: {
          id: 'female',
          text: 'Кошка'
        },
        breed: {
          id: 'british_shorthair',
          text: 'Британская короткошерстая'
        }
      }
    ] as ICat[]);
  }

  public getSexMap(sexId: TSex): ESexMap {
    return ESexMap[sexId];
  }

  public getBreedMap(breedId: TBreed): EBreedMap {
    return EBreedMap[breedId];
  }

  public addCat() {

  }

  public deleteCat(id: number) {

  }

}
