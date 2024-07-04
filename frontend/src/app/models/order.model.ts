// Файл не трогаем

export interface IOrder {
  id: string;
  name: string;
  mnemonic: string;
  status: TStatus;
  created: string; // as Data()
  fields: string; // данные заполнения
}

export type TStatus = 'FILED' | 'UNDER_CONSIDERATION' | 'REJECTED' | 'ACCEPTED' | 'DONE';

export enum EStatus {
  FILED = 'Подана',
  UNDER_CONSIDERATION = 'На рассмотрении',
  REJECTED = 'Отклонена',
  ACCEPTED = 'Принята',
  DONE = 'Готова'
}
