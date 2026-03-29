/**
 * Google user profile fields used by the app.
 */
export interface User {
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  sub?: string;
  locale?: string;
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
