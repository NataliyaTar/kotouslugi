export interface IPassportDocument {
  requisitionId: string;
  approvedAt: string;
  catId: number;
  catName: string;
  passportNumber: string;
  issueDate: string;
  country: string;
  ownerPhone: string;
  ownerEmail: string;
  photoUrl: string;
  chipNumber?: string;
  specialMarks?: string;
}

/** Ответ GET /api/passport/getAll */
export interface IPassportDto {
  id: number;
  requisition: number;
  passportNumber: string;
  issueDate: string;
  country: string;
  ownerPhone: string;
  ownerEmail: string;
  photoUrl: string;
  specialMarks?: string;
  chipNumber?: string;
  status: boolean;
}

/** Тело POST /api/requisition/create для услуги passport */
export interface ICreatePassportRequisition {
  mnemonic: 'passport';
  catId: number;
  fields: string;
  passportDetail: {
    passportNumber: string;
    issueDate: string;
    country: string;
    ownerPhone: string;
    ownerEmail: string;
    photoUrl: string;
    specialMarks?: string;
    chipNumber?: string;
  };
}
