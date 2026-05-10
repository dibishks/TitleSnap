export interface OttMovieApiItem {
  _id: string;
  ott_id: string;
  title: string;
  title_mini?: string;
  slug?: string;
  link?: string;
  image?: string;
  big_image?: string;
  release_year?: string;
  streaming_date?: string;
  streaming_date_at?: string;
  category?: string;
  genre?: string;
  genres?: string[];
  languages?: string[];
  platforms?: string[];
  platforms_names?: string[];
  recommendation?: string;
  custom_rating?: string;
  source_page?: number;
  first_seen_at?: string;
  last_seen_at?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface OttMovieDetailResponse {
  status: boolean;
  data?: {
    movie: OttMovieApiItem;
  };
}

export interface OttMoviesPagination {
  page: number;
  limit: number;
  total: number;
  has_more: boolean;
}

export interface OttMoviesResponse {
  status: boolean;
  data?: {
    movies: OttMovieApiItem[];
    pagination: OttMoviesPagination;
  };
}
