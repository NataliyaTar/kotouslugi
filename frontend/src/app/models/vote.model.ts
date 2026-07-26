/** Тело POST /api/vote/online */
export interface ICastVoteRequest {
  catId: number;
  partyName: string;
  electionPeriod: string;
  passportNumber: string;
}

/** Ответ 201 POST /api/vote/online */
export type ICastVoteResponse = ICastVoteRequest;
