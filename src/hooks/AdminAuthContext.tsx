import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { apiClient } from '../services/api';
import {
  clearAdminSession,
  getAdminToken,
  getAdminUser,
  setAdminToken,
  setAdminUser,
  type AdminUser,
} from '../auth/adminAuth';

interface LoginResponse {
  status: boolean;
  token?: string;
  data?: AdminUser;
  message?: string;
}

interface AdminAuthContextValue {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(() => getAdminToken());
  const [user, setUserState] = useState<AdminUser | null>(() => getAdminUser());

  const login = useCallback(async (username: string, password: string) => {
    const response = await apiClient.post<LoginResponse>(
      'titlesnap/admin/login',
      { username, password },
    );

    if (!response.status || !response.token || !response.data) {
      throw new Error(response.message || 'Invalid credentials');
    }

    setAdminToken(response.token);
    setAdminUser(response.data);
    setTokenState(response.token);
    setUserState(response.data);
  }, []);

  const logout = useCallback(() => {
    clearAdminSession();
    setTokenState(null);
    setUserState(null);
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [user, token, login, logout],
  );

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextValue => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used inside an AdminAuthProvider');
  }
  return ctx;
};
