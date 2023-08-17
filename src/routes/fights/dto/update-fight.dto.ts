export class UpdateFightDTO {
  winner: {
    id: string;
    rating: number;
    knockouts?: number;
    submission?: number;
  };
  loser: {
    id: string;
    rating: number;
    knockouts?: number;
    submission?: number;
  };
}
