export interface StateLocationItem {
  city_id: string;
  city_key: string;
  city_name: string;
  state_name: string;
}

export interface StatesResponse {
  status: boolean;
  data?: StateLocationItem[];
}
