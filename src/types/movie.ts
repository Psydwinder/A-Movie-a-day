export type UKRating = 'U' | 'PG' | '12' | '15' | '18' | 'NR';

export interface Movie {
  id: string;
  title: string;
  releaseYear: number;
  ukRating: UKRating;
  description: string;
  runtime: string;
  cast: string[];
  trailerUrl?: string;
  posterPath: string | null;
  day: number;
} 