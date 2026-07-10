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
