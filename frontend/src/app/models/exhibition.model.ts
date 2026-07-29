export interface IExhibition {
  id: number;
  name: string;
  date: string;
  city: string;
  system: string;
  organizer: string;
  cost: string;
  deadline: string;
}

export interface IExhibitionReview {
  exhibitionId: number;
  rating: number;
  comment: string;
}
