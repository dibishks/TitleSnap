import { useEffect, useState } from 'react';
import { ApiError, apiClient } from '../services/api';
import type { OttMovieApiItem, OttMovieDetailResponse } from '../types/ott';

interface UseOttMovieDetailsReturn {
  movie: OttMovieApiItem | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useOttMovieDetails = (slug: string): UseOttMovieDetailsReturn => {
  const [movie, setMovie] = useState<OttMovieApiItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (!slug) {
      setError('Invalid OTT movie identifier');
      setLoading(false);
      return;
    }

    const fetchMovie = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<OttMovieDetailResponse>(
          `titlesnap/ott-movies/${slug}`
        );

        setMovie(response.data?.movie || null);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch OTT movie details. Please try again later.');
        }
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchMovie();
  }, [slug, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return { movie, loading, error, refetch };
};
