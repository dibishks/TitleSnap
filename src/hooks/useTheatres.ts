import { useEffect, useState } from 'react';
import { ApiError, apiClient } from '../services/api';
import type { TheatreItem, TheatresPagination, TheatresResponse } from '../types/theatre';

interface UseTheatresReturn {
  theatres: TheatreItem[];
  pagination: TheatresPagination | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTheatres = (
  page: number,
  limit: number,
  cityId?: string,
  search?: string
): UseTheatresReturn => {
  const [theatres, setTheatres] = useState<TheatreItem[]>([]);
  const [pagination, setPagination] = useState<TheatresPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchTheatres = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<TheatresResponse>('titlesnap/theatres', {
          params: {
            page,
            limit,
            ...(cityId ? { city_id: cityId } : {}),
            ...(search ? { search } : {}),
          },
        });

        const theatresData = response.data?.theatres || [];
        const responsePagination = response.data?.pagination;

        setTheatres(theatresData);
        setPagination(
          responsePagination || {
            page,
            limit,
            total: undefined,
            has_more: theatresData.length === limit,
          }
        );
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch theatres. Please try again later.');
        }

        setTheatres([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchTheatres();
  }, [cityId, limit, page, refetchTrigger, search]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return { theatres, pagination, loading, error, refetch };
};
