// src/app/services/constants/constants.service.ts
import { Injectable } from '@angular/core';
import { EBreedMap, ESexMap, IValueBreed, IValueSex, IValueCat, ICatGroupedBySex, ICat } from '@models/cat.model'; // Добавил ICat
import { mergeMap, Observable, of, take } from 'rxjs';
import { CatService } from '@services/cat/cat.service'; // ИСПРАВЛЕНО: 'from' вместо '=>'
import { IValue } from '@models/common.model';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  public sexOptions: IValueSex[] = [
    {
      id: 'male',
      text: ESexMap.male
    },
    {
      id: 'female',
      text: ESexMap.female
    }
  ];

  public breedOptions: IValueBreed[] = [
    {
      id: 'siamese',
      text: EBreedMap.siamese
    },
    {
      id: 'british_shorthair',
      text: EBreedMap.british_shorthair
    },
    {
      id: 'maine_coon',
      text: EBreedMap.maine_coon
    },
    {
      id: 'persian',
      text: EBreedMap.persian
    },
    {
      id: 'sphinx',
      text: EBreedMap.sphinx
    },
    {
      id: 'scottish_fold',
      text: EBreedMap.scottish_fold
    },
    {
      id: 'russian_blue',
      text: EBreedMap.russian_blue
    },
    {
      id: 'munchkin',
      text: EBreedMap.munchkin
    }
  ];

  public doctorOptions: IValue[] = [
    {
      id: 0,
      text: 'Терапевт'
    },
    {
      id: 1,
      text: 'Ортопед'
    },
    {
      id: 2,
      text: 'Офтальмолог'
    },
    {
      id: 3,
      text: 'Хирург'
    },
    {
      id: 4,
      text: 'Дерматолог'
    }
  ];

  // --- НОВЫЕ КОНСТАНТЫ ДЛЯ ДОСТАВКИ ЕДЫ (С ЧИСЛОВЫМИ ID) ---
  public cityOptions: IValue[] = [
    { id: 101, text: 'Воронеж' },
    { id: 102, text: 'Москва' },
    { id: 103, text: 'Санкт-Петербург' },
    { id: 104, text: 'Волгоград' },
    { id: 105, text: 'Белгород' },
    { id: 106, text: 'Старый Оскол' }
  ];

  public streetOptions: IValue[] = [
    { id: 201, text: 'Ленина' },
    { id: 202, text: 'Дзержинского' },
    { id: 203, text: 'Мира' },
    { id: 204, text: 'Карла Маркса' },
    { id: 205, text: 'Орджоникидзе' }
  ];

  public shopOptions: IValue[] = [
    { id: 301,
      text: 'Магнит'
    },
    { id: 302,
      text: 'Пятерочка'
    },
    { id: 303,
      text: 'Чижик'
    }
  ];

  public deliveryTypeOptions: IValue[] = [
    { id: 401, text: 'Доставка' },
    { id: 402, text: 'Самовывоз' }
  ];

  public productOptions: IValue[] = [
    { id: 0, text: 'Сухой корм "Whiskas" (1кг)' },
    { id: 1, text: 'Влажный корм "Felix" (100г)' },
    { id: 2, text: 'Лакомство "Dreamies" (60г)' },
    { id: 3, text: 'Консервы "Sheba" (85г)' },
    { id: 4, text: 'Витамины для шерсти' },
    { id: 5, text: 'Игрушка-мышка' }
  ];

  constructor(
    private catService: CatService,
  ) { }

  /**
   * Возвращает список котов сгруппированных по полу, преобразовывая ответ для использования в dropdown
   */
  public getCatOptionsBySex(): Observable<ICatGroupedBySex> {
    return this.catService.getCatList().pipe(
      take(1)
    ).pipe(
      mergeMap((res: ICat[]) => { // ИСПРАВЛЕНО: Явно указан тип res как ICat[]
        const male: IValueCat[] = [];
        const female: IValueCat[] = [];
        res.forEach((item: ICat) => { // ИСПРАВЛЕНО: Явно указан тип item как ICat
          if (item.sex === 'male') {
            male.push({id: item.id, text: item.name});
          } else {
            female.push({id: item.id, text: item.name});
          }
        });
        return of({
          male,
          female
        });
      })
    );
  }

  /**
   * Возвращает список котов, преобразовывая ответ для использования в dropdown
   */
  public getCatOptionsAll():  Observable<IValueCat[]> {
    return this.catService.getCatList().pipe(
      take(1)
    ).pipe(
      mergeMap((res: ICat[]) => { // ИСПРАВЛЕНО: Явно указан тип res как ICat[]
        return of(res.map((item: ICat) => { // ИСПРАВЛЕНО: Явно указан тип item как ICat
          return {
            id: item.id,
            text: item.name
          }
        }));
      })
    )
  }
}
