// Новая структура фитнес-клуба
export interface IFitnessClub {
  id: number;
  name: string;
  trainingTypes: TrainingType[];
  memberships: IMembership[];
  trainers: ICatTrainer[];
}

export type TrainingType = 'GROUP' | 'PERSONAL' | 'FREE';

export interface IMembership {
  id: number;
  durationMonths: number;
  price: number;
}

export interface ICatTrainer {
  id: number;
  name: string;
  age: string;
  sex: string;
  breed: string;
}

