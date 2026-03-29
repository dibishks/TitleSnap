export interface Film {
  id: string;
  image: string;
  name: string;
  variant?: string;
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

export interface FilmsResponse {
  status: boolean;
  data?: MoviesApiData;
}

export interface FilmsData {
  recommended: Film[];
  latest: Film[];
}
