export interface SubCityLocationItem {
  lat: number;
  lon: number;
  name: string;
  popular_areas: string[];
}

export interface CityLocationItem {
  city_id: string;
  city_image?: string;
  city_key: string;
  city_lat?: number;
  city_light_image?: string;
  city_long?: number;
  city_name: string;
  cleaned_city_name?: string;
  is_capital_city?: boolean;
  is_popular_city?: boolean;
  state_name: string;
  status?: string;
  sub_cities?: SubCityLocationItem[];
}

export interface CitiesResponse {
  status: boolean;
  data?: CityLocationItem[];
}
