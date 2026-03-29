import { useState, useEffect } from 'react';
import { apiClient, ApiError } from '../services/api';
import type { Film, FilmsData, FilmsResponse, MoviesApiItem } from '../types/film';

interface UseFilmsReturn {
  data: FilmsData;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const mapMovieToFilm = (movie: MoviesApiItem): Film => ({
  id: movie.movie_id || movie._id,
  image: movie.image,
  name: movie.name,
  variant: [movie.movie_variants?.[0]?.language, movie.movie_variants?.[0]?.format]
    .filter(Boolean)
    .join(' | '),
});

/**
 * Custom hook to fetch films from the API
 * @returns {UseFilmsReturn} Films data, loading state, error, and refetch function
 */
export const useFilms = (cityId?: string): UseFilmsReturn => {
  const [data, setData] = useState<FilmsData>({ recommended: [], latest: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  useEffect(() => {
    if (!cityId) {
      setData({ recommended: [], latest: [] });
      setLoading(false);
      return;
    }

    const fetchFilms = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<FilmsResponse>('titlesnap/movies', {
          params: {
            city_id: cityId,
          },
        });
        setData({
          recommended: (response.data?.movies_this_week || []).map(mapMovieToFilm),
          latest: (response.data?.movies_listing_grid || []).map(mapMovieToFilm),
        });
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch films. Please try again later.');
        }
        setData({ recommended: [], latest: [] });
      } finally {
        setLoading(false);
      }
    };

    void fetchFilms();
  }, [cityId, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return { data, loading, error, refetch };
};
