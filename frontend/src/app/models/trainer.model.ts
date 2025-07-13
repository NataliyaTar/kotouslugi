export interface ITrainer {
  id: number;
  trainers_name: string;
  fitness_club_id: number;
}

export interface ITrainerOption {
  id: number;
  text: string;              // trainers_name
  membership_type: string;  // тип абонемента
  membership_price: number; // цена абонемента
}

export type ITrainerGroupedByFitnessClub = {
  [fitnessClubId: number]: ITrainerOption[];
};
