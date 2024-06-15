export interface ICat {
  id: number;
  name: string;
  age: string;
  sex: 'male' | 'female';
  breed: TBreed;
}

export interface IValue {
  id: number;
  text: string;
}

export type TBreed = 'siamese' | 'british_shorthair' | 'maine_coon' | 'persian' | 'sphinx' | 'scottish_fold'
  | 'russian_blue' | 'munchkin';

export enum EBreedMap {
  siamese = 'Сиамская',
  british_shorthair = 'Британская короткошерстая',
  maine_coon = 'Мейнкун',
  persian = 'Персидская',
  sphinx = 'Сфинкс',
  scottish_fold = 'Британская вислоухая',
  russian_blue = 'Русская голубая',
  munchkin = 'Манчкин',
}
