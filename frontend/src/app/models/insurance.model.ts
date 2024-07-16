export interface IInsurance {
  id: number;
  insuranceName: string;
  cash: TCash;
}

export enum TCash {
  first = 300,
  second = 350,
  third = 450
}
