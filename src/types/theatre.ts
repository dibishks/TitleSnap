export interface TheatreItem {
  theatre_id: string;
  address: string;
  amenity_names?: string[];
  chain_key?: string;
  cinema_logo_url?: string;
  city_id: string;
  city_key?: string;
  city_name: string;
  last_seen_at?: string;
  latitude?: number;
  longitude?: number;
  name: string;
  offer_tags?: string[];
  pincode?: string;
  source?: string;
  state_name?: string;
  theater_group_name?: string;
}

export interface TheatreMovieVariant {
  language?: string;
  format?: string;
}

export interface TheatreMovieItem {
  movie_id: string;
  name: string;
  genres?: string[];
  image?: string;
  movie_variants?: TheatreMovieVariant[];
  censor?: string;
  release_date?: string;
  premium_tags?: string[];
  description?: string;
}

export interface TheatreShowPriceBand {
  code?: string;
  label?: string;
  price?: number;
  seats_available?: number;
  seats_total?: number;
  status_color?: string;
}

export interface TheatreShowItem {
  show_id: string;
  audi?: string;
  available_seats?: number;
  city_id?: string;
  close_time?: string;
  last_seen_at?: string;
  max_price?: number;
  max_tickets?: number;
  min_price?: number;
  movie_id?: string;
  price_bands?: TheatreShowPriceBand[];
  screen_format?: string;
  seat_class?: string;
  seat_status?: string;
  show_date?: string;
  show_time: string;
  source_url?: string;
  status_color?: string;
  subtitle?: string;
  theatre_id?: string;
  total_seats?: number;
}

export interface TheatreShowtimeMovieGroup {
  movie: TheatreMovieItem;
  shows: TheatreShowItem[];
}

export interface TheatreShowtimeItem extends TheatreItem {
  movies?: TheatreShowtimeMovieGroup[];
}

export interface TheatresPagination {
  page?: number;
  limit?: number;
  total?: number;
  has_more?: boolean;
}

export interface TheatresResponse {
  status: boolean;
  data?: {
    theatres?: TheatreItem[];
    pagination?: TheatresPagination;
  };
}

export interface TheatreShowtimesResponse {
  status: boolean;
  data?: {
    show_date?: string;
    theatres?: TheatreShowtimeItem[];
    pagination?: TheatresPagination;
  };
}
