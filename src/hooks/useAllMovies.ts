import { useEffect, useState } from 'react';
import { ApiError, apiClient } from '../services/api';
import type { AllMoviesResponse, Film, MoviesApiItem, MoviesPagination } from '../types/film';

interface UseAllMoviesReturn {
  movies: Film[];
  pagination: MoviesPagination | null;
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

export const useAllMovies = (page: number, limit: number): UseAllMoviesReturn => {
  const [movies, setMovies] = useState<Film[]>([]);
  const [pagination, setPagination] = useState<MoviesPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<AllMoviesResponse>('titlesnap/movies', {
          params: {
            page,
            limit,
          },
        });

        setMovies((response.data?.movies || []).map(mapMovieToFilm));
        setPagination(response.data?.pagination || null);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch movies. Please try again later.');
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
