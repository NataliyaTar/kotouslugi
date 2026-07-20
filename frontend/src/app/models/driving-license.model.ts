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
  SUBMITTED = 'SUBMITTED',
  VERIFICATION = 'VERIFICATION',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.SUBMITTED]: 'Заявка подана',
  [ApplicationStatus.VERIFICATION]: 'На проверке',
  [ApplicationStatus.APPROVED]: 'Допущен к экзамену',
  [ApplicationStatus.COMPLETED]: 'Экзамен сдан',
  [ApplicationStatus.REJECTED]: 'Отказ'
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.SUBMITTED]: '#FFA500',
  [ApplicationStatus.VERIFICATION]: '#2196F3',
  [ApplicationStatus.APPROVED]: '#4CAF50',
  [ApplicationStatus.COMPLETED]: '#4CAF50',
  [ApplicationStatus.REJECTED]: '#F44336'
};

export interface IDrivingApplication {
  id?: number;
  catName: string;
  catAge: number;
  catBreed: string;
  catSex?: string;
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
