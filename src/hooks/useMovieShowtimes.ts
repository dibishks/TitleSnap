import { useEffect, useState } from 'react';
import { ApiError, apiClient } from '../services/api';
import type { TheatreShowtimeItem, TheatreShowtimesResponse } from '../types/theatre';

interface UseMovieShowtimesReturn {
  theatres: TheatreShowtimeItem[];
  showDate: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useMovieShowtimes = (
  movieId: string,
  cityId?: string
): UseMovieShowtimesReturn => {
  const [theatres, setTheatres] = useState<TheatreShowtimeItem[]>([]);
  const [showDate, setShowDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (!movieId || !cityId) {
      setTheatres([]);
      setShowDate(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchShowtimes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<TheatreShowtimesResponse>('titlesnap/showtimes', {
          params: {
            movie_id: movieId,
            city_id: cityId,
          },
        });

        const nextTheatres = response.data?.theatres || [];

        setTheatres(nextTheatres);
        setShowDate(response.data?.show_date || null);

      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch movie showtimes. Please try again later.');
        }

        setTheatres([]);
        setShowDate(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchShowtimes();
  }, [cityId, movieId, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return { theatres, showDate, loading, error, refetch };
};
