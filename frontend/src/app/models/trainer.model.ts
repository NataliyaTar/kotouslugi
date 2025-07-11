export interface ITrainer {
  id: number;
  trainers_name: string;
  fitness_club_id: number;
}

export interface ITrainerOption {
  id: number;
  text: string;              // trainers_name
}

export type ITrainerGroupedByFitnessClub = {
  [fitnessClubId: number]: ITrainerOption[];
};
