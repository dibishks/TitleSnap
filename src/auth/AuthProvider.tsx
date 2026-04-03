import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { apiClient } from '../services/api';
import type { AuthLoginResponse, User } from '../types/auth';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: User;
  error?: Error;
  login: () => Promise<void>;
  loginRedirect: () => Promise<void>;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
  getIdTokenClaims: () => Promise<Record<string, unknown> | null>;
}

interface AuthProviderWrapperProps {
  children: ReactNode;
}

const STORAGE_KEY = 'titlesnap.auth.user';
const TOKEN_KEY = 'titlesnap.auth.token';
const STATE_KEY = 'titlesnap.google.oauth_state';
const RETURN_TO_KEY = 'titlesnap.google.return_to';
const NONCE_KEY = 'titlesnap.google.oauth_nonce';

const defaultContext: AuthContextValue = {
  isAuthenticated: false,
  isLoading: false,
  user: undefined,
  error: undefined,
  login: async () => {},
  loginRedirect: async () => {},
  logout: () => {},
  getAccessToken: async () => null,
  getIdTokenClaims: async () => null,
};

export const AuthContext = createContext<AuthContextValue>(defaultContext);

const buildGoogleAuthUrl = (
  clientId: string,
  redirectUri: string,
  state: string,
  nonce: string
) => {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');

  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'id_token');
  url.searchParams.set('scope', 'openid profile email');
  url.searchParams.set('prompt', 'select_account');
  url.searchParams.set('state', state);
  url.searchParams.set('nonce', nonce);

  return url.toString();
};

/**
 * Google Auth Provider Wrapper
 * Handles redirect-based Google login and persists the signed-in user locally.
 */
const AuthProviderWrapper = ({ children }: AuthProviderWrapperProps) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri =
    import.meta.env.VITE_GOOGLE_REDIRECT_URI || window.location.origin;

  const [user, setUser] = useState<User | undefined>(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);

    if (!storedUser) {
      return undefined;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return undefined;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  const clearSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(undefined);
  }, []);

  const persistUser = useCallback((nextUser?: User, appToken?: string) => {
    if (nextUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
    } else {
      clearSession();
    }

    if (appToken) {
      localStorage.setItem(TOKEN_KEY, appToken);
    }
  }, [clearSession]);

  useEffect(() => {
    const handleRedirectResult = async () => {
      const hash = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : '';

      if (!hash) {
        setIsLoading(false);
        return;
      }

      const params = new URLSearchParams(hash);
      const idToken = params.get('id_token');
      const returnedState = params.get('state');
      const oauthError = params.get('error');
      const expectedState = sessionStorage.getItem(STATE_KEY);

      if (!idToken && !oauthError) {
        setIsLoading(false);
        return;
      }

      if (oauthError) {
        setError(new Error(oauthError));
        window.history.replaceState({}, document.title, window.location.pathname);
        sessionStorage.removeItem(STATE_KEY);
        sessionStorage.removeItem(RETURN_TO_KEY);
        sessionStorage.removeItem(NONCE_KEY);
        setIsLoading(false);
        return;
      }

      if (!returnedState || returnedState !== expectedState) {
        setError(new Error('Invalid Google login state.'));
        persistUser(undefined);
        window.history.replaceState({}, document.title, window.location.pathname);
        sessionStorage.removeItem(STATE_KEY);
        sessionStorage.removeItem(RETURN_TO_KEY);
        sessionStorage.removeItem(NONCE_KEY);
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiClient.post<AuthLoginResponse>(
          'titlesnap/auth/login',
          {
            idToken,
          }
        );
        persistUser(
          {
            ...response.data,
            sub: response.data.sub || response.data.google_sub,
          },
          response.token
        );

        const returnTo = sessionStorage.getItem(RETURN_TO_KEY) || '/';
        window.history.replaceState({}, document.title, returnTo);
      } catch (err) {
        persistUser(undefined);
        setError(
          err instanceof Error
            ? err
            : new Error('Google login failed. Please try again.')
        );
      } finally {
        sessionStorage.removeItem(STATE_KEY);
        sessionStorage.removeItem(RETURN_TO_KEY);
        sessionStorage.removeItem(NONCE_KEY);
        setIsLoading(false);
      }
    };

    void handleRedirectResult();
  }, [persistUser]);

  const loginRedirect = useCallback(async () => {
    if (!clientId) {
      throw new Error(
        'Google configuration missing. Please set VITE_GOOGLE_CLIENT_ID in your .env file.'
      );
    }

    const state = crypto.randomUUID();
    const nonce = crypto.randomUUID();
    sessionStorage.setItem(STATE_KEY, state);
    sessionStorage.setItem(NONCE_KEY, nonce);
    sessionStorage.setItem(
      RETURN_TO_KEY,
      `${window.location.pathname}${window.location.search}`
    );
    window.location.assign(buildGoogleAuthUrl(clientId, redirectUri, state, nonce));
  }, [clientId, redirectUri]);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const getAccessToken = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      clearSession();
      return null;
    }

    return token;
  }, [clearSession]);

  const getIdTokenClaims = useCallback(async () => {
    return user ? { ...user } : null;
  }, [user]);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      isLoading,
      user,
      error,
      login: loginRedirect,
      loginRedirect,
      logout,
      getAccessToken,
      getIdTokenClaims,
    }),
    [error, getAccessToken, getIdTokenClaims, isLoading, loginRedirect, logout, user]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProviderWrapper;
