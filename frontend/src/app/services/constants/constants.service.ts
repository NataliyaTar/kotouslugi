import { Injectable } from '@angular/core';
import { EBreedMap, ESexMap, IValueBreed, IValueSex, IValueCat, ICatGroupedBySex } from '@models/cat.model';
import { mergeMap, Observable, of, take } from 'rxjs';
import { CatService } from '@services/cat/cat.service';
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

  public shopOptions: IValue[] = [
    {
      id: 0,
      text: 'Зоомагазин "КотБатон"'
    },
    {
      id: 1,
      text: 'Супермаркет "Пушистик"'
    },
    {
      id: 2,
      text: 'Интернет-магазин "МурМурФуд"'
    },
    {
      id: 3,
      text: 'Местный ларек у Мурки'
    }
  ];

  // Варианты типов доставки (используют IValue, id: number)
  public deliveryTypeOptions: IValue[] = [
    { id: 0, text: 'Доставка' },
    { id: 1, text: 'Самовывоз' }
  ];
  // Варианты продуктов (для мультивыбора) (используют IValue, id: number)
  public productOptions: IValue[] = [
    { id: 0, text: 'Сухой корм для взрослых' },
    { id: 1, text: 'Влажный корм для котят' },
    { id: 2, text: 'Лакомства для зубов' },
    { id: 3, text: 'Кошачья мята (спрей)' },
    { id: 4, text: 'Наполнитель комкующийся' },
    { id: 5, text: 'Игрушка-лазер' }
  ];
  // Варианты городов (используют IValue, id: number)
  public cityOptions: IValue[] = [
    { id: 0, text: 'Ереван' },
    { id: 1, text: 'Гюмри' },
    { id: 2, text: 'Ванадзор' }
  ];
  // Варианты улиц (используют IValue, id: number)
  public streetOptions: IValue[] = [
    { id: 0, text: 'Туманяна' },
    { id: 1, text: 'Маштоца' },
    { id: 2, text: 'Сарьяна' },
    { id: 3, text: 'Кохбаци' }
  ];

  constructor(
    private catService: CatService,
  ) { }

  public getCatOptionsBySex(): Observable<ICatGroupedBySex> {
    return this.catService.getCatList().pipe(
      take(1)
    ).pipe(
      mergeMap((res) => {
        const male: IValueCat[] = [];
        const female: IValueCat[] = [];
        res.forEach(item => {
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

  public getCatOptionsAll():  Observable<IValueCat[]> {
    return this.catService.getCatList().pipe(
      take(1)
    ).pipe(
      mergeMap((res) => {
        return of(res.map((item) => {
          return {
            id: item.catId ?? item.id,
            text: item.catName ?? item.name
          }
        }));
      })
    )
  }
}
