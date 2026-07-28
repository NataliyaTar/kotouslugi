export type TBreedingGender = 'MALE' | 'FEMALE';

export interface IBreedingProfile {
  id?: number;
  breed: string;
  gender: TBreedingGender;
  city: string;
  age: number;
  hasPedigree: boolean;
  targetBreed: string;
  targetCity: string;
  minAge: number;
  maxAge: number;
  status?: string;
}

export interface IBreedingRequestPayload {
  senderProfileId: number;
  receiverProfileId: number;
}
