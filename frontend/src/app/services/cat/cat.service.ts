// Файл не трогаем

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { EBreedMap, ESexMap, ICat, TBreed, TSex } from '@models/cat.model';

@Injectable({
  providedIn: 'root'
})
export class CatService {

  private catApi = '/catService/';

  constructor(
    public http: HttpClient,
  ) { }

  public getCatList(): Observable<ICat[]> {
    return this.http.get<ICat[]>(`${this.catApi}listCat`);
    // return of([]);
  }

  public getSexMap(sexId: TSex): ESexMap {
    return ESexMap[sexId];
  }

  public getBreedMap(breedId: TBreed): EBreedMap {
    return EBreedMap[breedId];
  }

  public addCat() {
    return this.http.post<ICat>(`${this.catApi}addCat`, {

    });
  }

  public deleteCat(id: number) {
    return this.http.delete<ICat>(`${this.catApi}deleteCat`, {
      params: {
        id
      }
    });
  }

}
