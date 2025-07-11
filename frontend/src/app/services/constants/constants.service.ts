import { Injectable } from '@angular/core';
import { EBreedMap, ESexMap, IValueBreed, IValueSex, IValueCat, ICatGroupedBySex } from '@models/cat.model';
import { mergeMap, Observable, of, take } from 'rxjs';
import { CatService } from '@services/cat/cat.service';
import { FitnessService } from '@services/fitness/fitness.service';
import { IValueFitness } from '@models/fitness.model';
import { IValue } from '@models/common.model';
import { ITrainerGroupedByFitnessClub, ITrainerOption } from '@models/trainer.model';
import { TrainerService } from '@services/trainer/trainer.service';
import { map } from 'rxjs/operators';
import { ITrainer } from '@models/trainer.model';

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

  constructor(
    private catService: CatService,
    private fitnessService: FitnessService,
    private trainerService: TrainerService
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

  /**
   * Все фитнес-клубы (для dropdown) — формат: "название — цена ₽"
   */
  public getFitnessOptionsAll(): Observable<IValueFitness[]> {
    return this.fitnessService.getFitnessList().pipe(
      take(1)
      ).pipe(
        mergeMap((res) => {
          return of (res.map((item) => {
            return {
              id: item.id,
              text: `${item.fitness_club} `
            }
          }));
        })
      )
    }
  //Группируем тренеров по спортзалам
  public getTrainerGroupedByFitnessClub(): Observable<ITrainerGroupedByFitnessClub> {
    return this.trainerService.getAll().pipe(
      map((res: any[]) => {
        console.log('Raw trainers:', res);
        const grouped: ITrainerGroupedByFitnessClub = {};
        res.forEach(trainer => {
          const key = trainer.fitness_club?.id;  // тут изменил
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push({ id: trainer.id, text: trainer.trainers_name });
        });
        return grouped;
      })
    );
  }



}
