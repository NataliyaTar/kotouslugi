export interface IDrugVerification {
  batchCode: string;
  registered: boolean;
  message: string;
  tradeName: string;
  manufacturerName: string;
  serialNumber: string;
  expiryDate: string;
  status: TDrugBatchStatus;
}

export type TDrugBatchStatus = 'ACTIVE' | 'RECALLED' | 'EXPIRED';

export interface IManufacturer {
  id: number;
  name: string;
  inn: string;
  country: string;
  contactInfo: string;
  type: 'MANUFACTURER' | 'IMPORTER';
  trustRating: number;
}
