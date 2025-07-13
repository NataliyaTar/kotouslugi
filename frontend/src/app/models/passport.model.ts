// Файл не трогаем

export interface IPassport {
  id: number;
  name: string;
  sex: TSex;
  date_of_birth: Date;
  place_born: string;
  reg_adress: string;
  children: boolean;
  mvd_place: string;
  time_reception: string;
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

export interface ICatGroupedBySex {
  male: IValueCat[];
  female: IValueCat[];
}

export interface IValueCat {
  id: number;
  text: string;
}
