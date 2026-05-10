import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError, apiClient } from '../services/api';
import type { OttMovieApiItem } from '../types/ott';
import type {
  SearchAllMovieItem,
  SearchAllResponse,
} from '../types/search';
import type { TheatreItem } from '../types/theatre';

interface GlobalSearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  inputId?: string;
  placeholder?: string;
  suggestionLimit?: number;
  onItemSelect?: () => void;
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;
}

const POSTER_FALLBACK =
  'https://via.placeholder.com/80x120/cccccc/666666?text=No+Image';

const GlobalSearchBox = ({
  value,
  onChange,
  inputId = 'global-search',
  placeholder = 'Search theatres, movies, or OTT titles',
  suggestionLimit = 8,
  onItemSelect,
  className = '',
  inputClassName = '',
  dropdownClassName = '',
}: GlobalSearchBoxProps) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [theatres, setTheatres] = useState<TheatreItem[]>([]);
  const [movies, setMovies] = useState<SearchAllMovieItem[]>([]);
  const [ottMovies, setOttMovies] = useState<OttMovieApiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const normalized = value.trim();

    if (normalized.length < 2) {
      setTheatres([]);
      setMovies([]);
      setOttMovies([]);
      setError(null);
      setLoading(false);
      setIsOpen(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const fetchResults = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await apiClient.get<SearchAllResponse>(
            'titlesnap/searchall',
            {
              params: {
                q: normalized,
                page: 1,
                limit: suggestionLimit,
              },
            }
          );

          setTheatres(response.data?.theatres || []);
          setMovies(response.data?.movies || []);
          setOttMovies(response.data?.['ott-movies'] || []);
          setIsOpen(true);
        } catch (err) {
          if (err instanceof ApiError) {
            setError(err.message);
          } else if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Unable to load search results.');
          }
          setTheatres([]);
          setMovies([]);
          setOttMovies([]);
          setIsOpen(true);
        } finally {
          setLoading(false);
        }
      };

      void fetchResults();
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [suggestionLimit, value]);

  const closeAfterSelect = () => {
    setIsOpen(false);
    if (onItemSelect) {
      onItemSelect();
    }
  };

  const handleTheatreSelect = (theatre: TheatreItem) => {
    onChange(theatre.name);
    closeAfterSelect();
    navigate(`/theatres/${theatre.theatre_id}`);
  };

  const handleMovieSelect = (movie: SearchAllMovieItem) => {
    onChange(movie.name);
    closeAfterSelect();
    navigate(`/movies/${movie.movie_id}`);
  };

  const handleOttSelect = (movie: OttMovieApiItem) => {
    onChange(movie.title);
    closeAfterSelect();
    if (movie.slug) {
      navigate(`/ott-movies/${movie.slug}`);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value.trim().length >= 2) {
      setIsOpen(true);
    }
  };

  const totalResults = theatres.length + movies.length + ottMovies.length;
  const hasAnyResults = totalResults > 0;

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative" ref={containerRef}>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400 dark:text-gray-500">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="h-5 w-5"
          >
            <path
              d="M14.1667 14.1667L18.3334 18.3334M16.6667 8.75C16.6667 13.1223 13.1223 16.6667 8.75 16.6667C4.37775 16.6667 0.833374 13.1223 0.833374 8.75C0.833374 4.37775 4.37775 0.833374 8.75 0.833374C13.1223 0.833374 16.6667 4.37775 16.6667 8.75Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => {
            if (value.trim().length >= 2) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className={`w-full rounded-2xl border border-stone-300 bg-white py-3 pl-11 pr-12 text-sm text-gray-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white ${inputClassName}`.trim()}
          autoComplete="off"
        />
        {value.trim() && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onChange('');
              setTheatres([]);
              setMovies([]);
              setOttMovies([]);
              setError(null);
              setLoading(false);
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-stone-400 transition hover:text-stone-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4"
            >
              <path
                d="M6 6L14 14M14 6L6 14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}

        {isOpen && (
          <div
            className={`absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-[28rem] overflow-y-auto rounded-2xl border border-stone-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900 ${dropdownClassName}`.trim()}
          >
            {loading && (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                Loading suggestions...
              </div>
            )}

            {!loading && error && (
              <div className="px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {!loading && !error && !hasAnyResults && (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                No matching results found
              </div>
            )}

            {!loading && !error && hasAnyResults && (
              <div className="py-2">
                {theatres.length > 0 && (
                  <div>
                    <div className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Theatres
                    </div>
                    {theatres.map((theatre) => (
                      <button
                        key={`theatre-${theatre.theatre_id}`}
                        type="button"
                        onClick={() => handleTheatreSelect(theatre)}
                        className="flex w-full items-center gap-3 px-4 py-2 text-left transition hover:bg-stone-100 dark:hover:bg-gray-800"
                      >
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                          {theatre.cinema_logo_url ? (
                            <img
                              src={theatre.cinema_logo_url}
                              alt=""
                              className="h-full w-full object-contain"
                              loading="lazy"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display =
                                  'none';
                              }}
                            />
                          ) : (
                            <span className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-300">
                              {theatre.name.slice(0, 2)}
                            </span>
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">
                            {theatre.name}
                          </span>
                          <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                            {theatre.city_name}
                            {theatre.state_name ? `, ${theatre.state_name}` : ''}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {movies.length > 0 && (
                  <div>
                    <div className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Movies
                    </div>
                    {movies.map((movie) => (
                      <button
                        key={`movie-${movie.movie_id}`}
                        type="button"
                        onClick={() => handleMovieSelect(movie)}
                        className="flex w-full items-center gap-3 px-4 py-2 text-left transition hover:bg-stone-100 dark:hover:bg-gray-800"
                      >
                        <span className="flex h-12 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                          <img
                            src={movie.image || POSTER_FALLBACK}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              if (target.src !== POSTER_FALLBACK) {
                                target.src = POSTER_FALLBACK;
                              }
                            }}
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">
                            {movie.name}
                          </span>
                          <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                            {(movie.genres || []).slice(0, 3).join(', ') || 'Movie'}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {ottMovies.length > 0 && (
                  <div>
                    <div className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      OTT Movies
                    </div>
                    {ottMovies.map((movie) => (
                      <button
                        key={`ott-${movie._id || movie.ott_id}`}
                        type="button"
                        onClick={() => handleOttSelect(movie)}
                        disabled={!movie.slug}
                        className="flex w-full items-center gap-3 px-4 py-2 text-left transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-gray-800"
                      >
                        <span className="flex h-12 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                          <img
                            src={movie.image || movie.big_image || POSTER_FALLBACK}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              if (target.src !== POSTER_FALLBACK) {
                                target.src = POSTER_FALLBACK;
                              }
                            }}
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">
                            {movie.title}
                          </span>
                          <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                            {[
                              movie.release_year,
                              (movie.genres || []).slice(0, 2).join(', '),
                              (movie.platforms_names || []).slice(0, 2).join(', '),
                            ]
                              .filter(Boolean)
                              .join(' • ') || 'OTT Movie'}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
};

export default GlobalSearchBox;
