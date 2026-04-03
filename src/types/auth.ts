/**
 * Google user profile fields used by the app.
 */
export interface User {
  id?: string;
  google_sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  sub?: string;
  locale?: string;
  created_at?: string;
  updated_at?: string;
  last_login_at?: string;
}

export interface AuthLoginResponse {
  status: boolean;
  token: string;
  data: User;
}

/**
 * Auth state interface
 */
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: User;
  error?: Error;
}
