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
