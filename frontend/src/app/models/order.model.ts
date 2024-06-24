export interface IOrder {
  id: string;
  title: string;
  status: TStatus
}

export type TStatus = 'FILED' | 'UNDER_CONSIDERATION' | 'REJECTED' | 'ACCEPTED' | 'DONE';

export enum EStatus {
  FILED = 'Подана',
  UNDER_CONSIDERATION = 'На рассмотрении',
  REJECTED = 'Отклонена',
  ACCEPTED = 'Принята',
  DONE = 'Готова'
}
