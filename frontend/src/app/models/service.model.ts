// Файл не трогаем

export interface IService {
  id: number;
  mnemonic: string;
  icon: string;
  title: string;
  categories: {name: string;}[];
  description: string;
}
