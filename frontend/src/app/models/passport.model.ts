export interface IPassportDetail {
  id: number;
  catId: number;
  catName: string;
  chipNumber: string;
  kennelName: string;
  verified: boolean;
  vaccinations: IVaccination[];
  illnesses: IIllnessRecord[];
  pedigreeLinks: IPedigreeLink[];
  inbreedingWarnings: string[];
}

export interface IVaccination {
  id: number;
  passportId: number;
  vaccineName: string;
  drugBatchCode: string;
  vaccinationDate: string;
  veterinarian: string;
  clinic: string;
  verified: boolean;
}

export interface IIllnessRecord {
  id: number;
  passportId: number;
  diagnosis: string;
  treatment: string;
  recordDate: string;
  recovered: boolean;
}

export interface IPedigreeLink {
  id: number;
  relativePassportId: number;
  relativeCatId: number;
  relativeCatName: string;
  relationType: TRelationType;
}

export type TRelationType = 'FATHER' | 'MOTHER' | 'CHILD' | 'SIBLING';

export enum ERelationMap {
  FATHER = 'Отец',
  MOTHER = 'Мать',
  CHILD = 'Потомок',
  SIBLING = 'Сиблинг'
}
