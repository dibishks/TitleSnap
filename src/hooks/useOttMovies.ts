import { useEffect, useState } from 'react';
import { ApiError, apiClient } from '../services/api';
import type {
  OttMovieApiItem,
  OttMoviesPagination,
  OttMoviesResponse,
} from '../types/ott';

interface UseOttMoviesReturn {
  movies: OttMovieApiItem[];
  pagination: OttMoviesPagination | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useOttMovies = (page: number, limit: number): UseOttMoviesReturn => {
  const [movies, setMovies] = useState<OttMovieApiItem[]>([]);
  const [pagination, setPagination] = useState<OttMoviesPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<OttMoviesResponse>(
          'titlesnap/ott-movies',
          {
            params: { page, limit },
          }
        );

        setMovies(response.data?.movies || []);
        setPagination(response.data?.pagination || null);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch OTT movies. Please try again later.');
        }

        setMovies([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchMovies();
  }, [limit, page, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return { movies, pagination, loading, error, refetch };
};
