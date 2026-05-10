import type { OttMovieApiItem } from './ott';
import type { TheatreItem } from './theatre';

export interface SearchAllMovieItem {
  movie_id: string;
  name: string;
  image?: string;
  genres?: string[];
  censor?: string;
  release_date?: string;
  description?: string;
  reason_to_watch?: string;
  premium_tags?: string[];
  reminder_count?: number;
}

export interface SearchAllPagination {
  page: number;
  limit: number;
  total: number;
  has_more: boolean;
}

export interface SearchAllResponse {
  status: boolean;
  data?: {
    theatres?: TheatreItem[];
    movies?: SearchAllMovieItem[];
    'ott-movies'?: OttMovieApiItem[];
    pagination?: SearchAllPagination;
  };
}
