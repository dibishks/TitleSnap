export interface Film {
  id: string;
  image: string;
  name: string;
  variant?: string;
  release_date?: string;
}

export interface MovieVariant {
  language: string;
  format: string;
}

export interface MoviesApiItem {
  _id: string;
  movie_id: string;
  image: string;
  name: string;
  display_order?: number;
  movie_variants?: MovieVariant[];
  release_date?: string;
}

export interface MoviesApiData {
  city?: {
    city_id: string;
    city_name: string;
    city_key: string;
    cleaned_city_name: string;
    state_name: string;
  };
  movies_this_week?: MoviesApiItem[];
  movies_listing_grid?: MoviesApiItem[];
}

export interface MoviesPagination {
  page: number;
  limit: number;
  total: number;
  has_more: boolean;
}

export interface FilmsResponse {
  status: boolean;
  data?: MoviesApiData;
}

export interface FilmsData {
  recommended: Film[];
  latest: Film[];
}

export interface AllMoviesResponse {
  status: boolean;
  data?: {
    city: null;
    movies: MoviesApiItem[];
    pagination: MoviesPagination;
  };
}

export interface PopularMoviesByStateItem {
  movie_id: string;
  name: string;
  last_seen_at?: string;
  state_name?: string;
}

export interface PopularMoviesByStateResponse {
  status: boolean;
  data?: {
    state_name: string;
    movies: PopularMoviesByStateItem[];
    pagination: MoviesPagination;
  };
}
