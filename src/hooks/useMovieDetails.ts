import { useState, useEffect } from 'react';
import { apiClient, ApiError } from '../services/api';
import type { MovieDetail, MovieDetailResponse } from '../types/movie';

interface UseMovieDetailsReturn {
  data: MovieDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch movie details from the API
 * @param id - Movie ID
 * @returns {UseMovieDetailsReturn} Movie details data, loading state, error, and refetch function
 */
export const useMovieDetails = (id: string | number): UseMovieDetailsReturn => {
  const [data, setData] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  useEffect(() => {
    if (!id) {
      setError('Invalid movie ID');
      setLoading(false);
      return;
    }

    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<MovieDetailResponse>(
          `/titlesnap/movies/${id}`
        );
        setData({
          id: response.movie_id || response._id,
          image: response.image,
          name: response.name,
          description: response.description || '',
          censor: response.censor || '',
          genres: response.genres || [],
          movieVariants: response.movie_variants || [],
          reasonToWatch: response.reason_to_watch || '',
          releaseDate: response.release_date || '',
          reminderCount: response.reminder_count || 0,
          premiumTags: response.premium_tags || [],
          videoData: response.video_data || null,
        });
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch movie details. Please try again later.');
        }
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return { data, loading, error, refetch };
};
