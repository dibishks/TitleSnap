const ADMIN_TOKEN_KEY = 'titlesnap_admin_token';
const ADMIN_USER_KEY = 'titlesnap_admin_user';

export interface AdminUser {
  id: string;
  username: string;
}

export const getAdminToken = (): string | null => {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setAdminToken = (token: string) => {
  try {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } catch {
    // ignore — storage may be unavailable (private mode, quota)
  }
};

export const getAdminUser = (): AdminUser | null => {
  try {
    const raw = localStorage.getItem(ADMIN_USER_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
};

export const setAdminUser = (user: AdminUser) => {
  try {
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
};

export const clearAdminSession = () => {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  } catch {
    // ignore
  }
};

export const authHeader = (): Record<string, string> => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
