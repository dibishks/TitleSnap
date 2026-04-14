import { useEffect, useState } from 'react';
import { ApiError, apiClient } from '../services/api';
import type { TheatreShowtimeItem, TheatreShowtimesResponse } from '../types/theatre';

interface UseTheatreShowtimesReturn {
  theatre: TheatreShowtimeItem | null;
  showDate: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTheatreShowtimes = (theatreId: string): UseTheatreShowtimesReturn => {
  const [theatre, setTheatre] = useState<TheatreShowtimeItem | null>(null);
  const [showDate, setShowDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (!theatreId) {
      setTheatre(null);
      setShowDate(null);
      setLoading(false);
      setError('Theatre not found.');
      return;
    }

    const fetchShowtimes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<TheatreShowtimesResponse>('titlesnap/showtimes', {
          params: { theatre_id: theatreId },
        });

        setTheatre(response.data?.theatres?.[0] || null);
        setShowDate(response.data?.show_date || null);

        if (!response.data?.theatres?.[0]) {
          setError('No theatre showtimes available right now.');
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch theatre showtimes. Please try again later.');
        }

        setTheatre(null);
        setShowDate(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchShowtimes();
  }, [refetchTrigger, theatreId]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return { theatre, showDate, loading, error, refetch };
};
