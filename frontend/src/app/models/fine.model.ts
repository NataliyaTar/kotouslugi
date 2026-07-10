// Модель штрафа с бэкенда (/api/fine)
export interface IFine {
  id: number;
  catId: number;
  reason: string;
  amount: number;
  status: 'UNPAID' | 'PAID';
  created: string;
}

// Данные для чека об оплате
export interface IReceipt {
  number: string;
  date: string;
  cat: string;
  document: string;
  fines: { number: string; amount: number }[];
  total: number;
}
