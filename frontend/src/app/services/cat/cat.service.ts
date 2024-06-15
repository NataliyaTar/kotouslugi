import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { EBreedMap, ICat, TBreed } from '@models/cat.model';

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
        sex: 'male',
        breed: 'british_shorthair'
      },
      {
        id: 1,
        name: 'Снежка',
        age: '2',
        sex: 'female',
        breed: 'munchkin'
      },
      {
        id: 3,
        name: 'Феликс',
        age: '1',
        sex: 'male',
        breed: 'british_shorthair'
      },
      {
        id: 4,
        name: 'Снежка',
        age: '2',
        sex: 'female',
        breed: 'munchkin'
      }
    ]);
  }

  public getBreedMap(breedId: TBreed): EBreedMap {
    return EBreedMap[breedId];
  }

  public addCat() {

  }

  public deleteCat(id: number) {

  }
}
