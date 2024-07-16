export interface IInsurance {
  id: number;
  insuranceName: string;
  cash: TCash;
}

export enum TCash {
  first = 1000,
  second = 1500,
  third = 2000
}
