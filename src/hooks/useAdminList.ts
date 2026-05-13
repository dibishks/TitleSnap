import { useCallback, useEffect, useState } from 'react';
import { apiClient, ApiError } from '../services/api';
import { authHeader } from '../auth/adminAuth';
import { useAdminAuth } from './AdminAuthContext';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  has_more: boolean;
}

interface AdminListResponse<T> {
  status: boolean;
  data: T[];
  pagination: PaginationMeta;
  message?: string;
}

interface UseAdminListResult<T> {
  data: T[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  refetch: () => void;
}

const clampLimit = (n: number) => Math.min(100, Math.max(1, Math.floor(n)));

export function useAdminList<T>(
  endpoint: string,
  initialLimit = 20,
): UseAdminListResult<T> {
  const { logout } = useAdminAuth();
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPageState] = useState(1);
  const [limit, setLimitState] = useState(clampLimit(initialLimit));
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    apiClient
      .get<AdminListResponse<T>>(endpoint, {
        params: { page, limit },
        headers: authHeader(),
      })
      .then((response) => {
        if (cancelled) return;
        if (!response.status) {
          setError(response.message || 'Failed to load data.');
          setData([]);
          setPagination(null);
          return;
        }
        setData(response.data || []);
        setPagination(response.pagination || null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          logout();
          return;
        }
        const message =
          err instanceof Error ? err.message : 'Failed to load data.';
        setError(message);
        setData([]);
        setPagination(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [endpoint, page, limit, refreshIndex, logout]);

  const setPage = useCallback((next: number) => {
    setPageState(Math.max(1, Math.floor(next)));
  }, []);

  const setLimit = useCallback((next: number) => {
    setLimitState(clampLimit(next));
    setPageState(1);
  }, []);

  const refetch = useCallback(() => setRefreshIndex((n) => n + 1), []);

  return { data, pagination, loading, error, page, setPage, limit, setLimit, refetch };
}
