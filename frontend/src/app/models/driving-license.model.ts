export enum DrivingCategory {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}

export const CATEGORY_LABELS: Record<DrivingCategory, string> = {
  [DrivingCategory.A]: 'Категория A (Мотоциклы)',
  [DrivingCategory.B]: 'Категория B (Легковые авто)',
  [DrivingCategory.C]: 'Категория C (Грузовые авто)',
  [DrivingCategory.D]: 'Категория D (Автобусы)'
};

export enum ApplicationStatus {
  SUBMITTED = 'Заявка подана',
  VERIFICATION = 'На проверке',
  APPROVED = 'Допущен к экзамену',
  COMPLETED = 'Экзамен сдан',
  REJECTED = 'Отказ'
}

export interface IDrivingApplication {
  id?: string;
  catName: string;
  catAge: number;
  catBreed: string;
  category: DrivingCategory;
  examDate: Date;
  examTime: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  feedback?: IDrivingFeedback;
}

export interface IDrivingFeedback {
  schoolName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IDrivingStatistics {
  schoolName: string;
  licensesIssued: number;
  categoryStats: Record<DrivingCategory, number>;
  averageRating: number;
}
