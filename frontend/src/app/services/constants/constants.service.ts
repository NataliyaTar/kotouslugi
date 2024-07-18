import { Injectable } from '@angular/core';
import { EBreedMap, ESexMap, IValueBreed, IValueSex, IValueCat, ICatGroupedBySex } from '@models/cat.model';
import { mergeMap, Observable, of, take } from 'rxjs';
import { CatService } from '@services/cat/cat.service';
import { IValue } from '@models/common.model';
import { IInsurance, TCash } from '@models/insurance.model';
import { IValueClub } from '@models/club.model';
import { ClubService } from '@services/club/club.service';
import { IValueName } from '@models/common.model';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  // варианты пола
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

  // варианты пород
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

  // варианты специалистов
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

 // варианты компаний
  public CompaniesOptions: IInsurance[] = [
    {
      id: 0,
      insuranceName: 'МурЧудо Страхование',
      cash: TCash.first
    },
    {
      id: 1,
      insuranceName: 'Пушистая Защита',
      cash: TCash.second
    },
    {
      id: 2,
      insuranceName: 'Лапки в Безопасности',
      cash: TCash.third
    }
  ];

 // варианты категорий страховок
  public CategoriesOptions: IValue[] = [
    {
      id: 0,
      text: 'По болезни'
    },
    {
      id: 1,
      text: 'Травмы'
    },
    {
      id: 2,
      text: 'Ущерб третьим лицам'
    }
  ];

  // варианты мастеров
  public groomerOptions: IValueName[] = [
    {
      id: 0,
      text: 'Марина'
    },
    {
      id: 1,
      text: 'Федор'
    },
    {
      id: 2,
      text: 'Михаил'
    },
    {
      id: 3,
      text: 'Анастасия'
    },
    {
      id: 4,
      text: 'Вероника'
    }
  ];

  constructor(
    private catService: CatService,
    private clubService: ClubService
  ) { }

  /**
   * Возвращает список котов сгруппированных по полу, преобразовывая ответ для использования в dropdown
   */
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

  /**
   * Возвращает список котов, преобразовывая ответ для использования в dropdown
   */
  public getCatOptionsAll():  Observable<IValueCat[]> {
    return this.catService.getCatList().pipe(
      take(1)
    ).pipe(
      mergeMap((res) => {
        return of(res.map((item) => {
          return {
            id: item.id,
            text: item.name
          }
        }));
      })
    )
  }

  public getAllClubs():  Observable<IValueClub[]> {
    return this.clubService.getClubList().pipe(
      take(1)
    ).pipe(
      mergeMap((res) => {
        return of(res.map((item) => {
          return {
            id: item.id,
            text: item.name,
            description: item.description,
            img: item.img
          }
        }));
      })
    )
  }
}
