/** Тело POST /api/party/add */
export interface ICreatePartyRequest {
  name: string;
  description: string;
  logoUrl?: string;
  candidateCatId: number;
}

/** Партия: ответ POST /api/party/add и GET /api/party/get */
export interface IPoliticalParty {
  id?: number;
  name: string;
  description: string;
  logoUrl?: string;
  candidateCatId?: number;
  createdAt?: string;
  active?: boolean;
  isActive?: boolean;
}
