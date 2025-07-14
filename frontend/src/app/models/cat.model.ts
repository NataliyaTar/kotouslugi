export interface ICat {
  id: number;
  name: string;
  age: string;
  sex: TSex;
  breed: TBreed;
  birthDate: string;
  ownerPhone: string;
  catId?: number;
  catName?: string;
}

export interface IValueSex {
  id: TSex;
  text: ESexMap;
}

export type TSex = 'male' | 'female';

export enum ESexMap {
  male = 'Кот',
  female = 'Кошка'
}

export interface IValueBreed {
  id: TBreed;
  text: EBreedMap;
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

export interface ICatGroupedBySex {
  male: IValueCat[];
  female: IValueCat[];
}

export interface IValueCat {
  id: number;
  text: string;
}
