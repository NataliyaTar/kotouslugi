import { Injectable } from '@angular/core';
import { EBreedMap, ESexMap, IValueBreed, IValueSex, IValueCat, ICatGroupedBySex } from '@models/cat.model';
import { mergeMap, Observable, of, take } from 'rxjs';
import { CatService } from '@services/cat/cat.service';
import { IValue } from '@models/common.model';


interface ITeacher {
  id: number;
  text: string;
  description: string;
}

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

 // варианты учителей
  public teacherOptions: ITeacher[] = [
    {
      id: 0,
      text: 'Строгокотикова Е.В.',
      description: 'Добрый котик'
    },
    {
      id: 1,
      text: 'Котолюбов А.Н.',
      description: 'Злой котик'
    },
    {
      id: 2,
      text: 'Уколчиков П.А.',
      description: 'Понимающий котик'
    },
    {
      id: 3,
      text: 'Пузиков Д.И.',
      description: 'Строгий котик'
    }
  ];


  public courseOptions: IValue[] = [
    {
      id: 0,
      text: 'Приручение к лотку'
    },
    {
      id: 1,
        text: 'Основы этикета'
    },
    {
      id: 2,
      text: 'Социализация'
    },
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
}
