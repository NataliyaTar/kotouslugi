import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { EBreedMap, ESexMap, ICat, TBreed, TSex } from '@models/cat.model';

@Injectable({
  providedIn: 'root'
})
export class CatService {

  private catApi = 'api/cat/';

  constructor(
    public http: HttpClient,
  ) { }

  /**
   * Возвращает список котов
   */
  public getCatList(): Observable<ICat[]> {
    return this.http.get<ICat[]>(`${this.catApi}list`);
  }

  /**
   * Возвращает значение пола в человеческом виде
   * @param sexId
   */
  public getSexMap(sexId: TSex): ESexMap {
    return ESexMap[sexId];
  }

  /**
   * Возвращает значение пола в человеческом виде
   * @param breedId
   */
  public getBreedMap(breedId: TBreed): EBreedMap {
    return EBreedMap[breedId];
  }

  /**
   * Сохраняет кота в БД
   * @param catInfo - данные с формы
   */
  public addCat(catInfo: any) {
    return this.http.post<ICat>(`${this.catApi}add`, this.prepareInfo(catInfo));
  }

  /**
   * Преобразует данные с формы для отправки на бэк
   * @param catInfo - данные с формы
   */
  private prepareInfo(catInfo: any) {
    let res: {[key: string]: string | number} = {};

    Object.keys(catInfo).forEach(key => {
      let value = catInfo[key];
      try {
        value = JSON.parse(value)?.id ?? value;
      } catch (error) {}
      Object.assign(res, {[key]: value});
    });

    if (res['sex'] === 'male') res['catGender'] = 'кот';
    else if (res['sex'] === 'female') res['catGender'] = 'кошка';
    delete res['sex'];

    res['catName'] = res['name'];
    delete res['name'];

    if (typeof res['age'] === 'string') res['age'] = parseInt(res['age'], 10);

    return res;
  }

  /**
   * Удаляет кота из БД
   * @param id
   */
  public deleteCat(id: number) {
    return this.http.delete<ICat>(`${this.catApi}deleteCat`, {
      params: {
        id
      }
    });
  }

}
