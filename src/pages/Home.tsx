import { useFilms } from '../hooks/useFilms';
import { useLocation } from '../hooks/LocationContext';
import MovieCard from '../components/MovieCard';
import type { Film } from '../types/film';

/**
 * Loading Skeleton Component
 */
const MovieCardSkeleton = () => (
  <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md animate-pulse">
    <div className="aspect-[2/3] bg-gray-300 dark:bg-gray-700" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
    </div>
  </div>
);

/**
 * Error State Component
 */
const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
    <div className="text-center max-w-md">
      <svg
        className="mx-auto h-16 w-16 text-red-500 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
      >
        <svg
          className="mr-2 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Try Again
      </button>
    </div>
  </div>
);

/**
 * Empty State Component
 */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
    <div className="text-center max-w-md">
      <svg
        className="mx-auto h-16 w-16 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
        />
      </svg>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No Movies Found
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Check back later for new movie title cards!
      </p>
    </div>
  </div>
);

const MovieSection = ({
  title,
  description,
  films,
}: {
  title: string;
  description: string;
  films: Film[];
}) => {
  if (films.length === 0) {
    return null;
  }

  return (
    <section className="mb-12 last:mb-0">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {films.map((film) => (
          <MovieCard key={`${title}-${film.id}`} film={film} />
        ))}
      </div>
    </section>
  );
};

/**
 * Home Page Component
 */
const Home = () => {
  const { selectedLocation } = useLocation();
  const { data: films, loading, error, refetch } = useFilms(selectedLocation?.city_id);
  const hasMovies = films.recommended.length > 0 || films.latest.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Discover Movie Title Cards
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Browse and download stunning title cards from the latest movies.
            Share them on your social media without disrupting the theater experience.
          </p>
          {selectedLocation?.state_name && (
            <p className="mt-4 text-sm uppercase tracking-[0.2em] text-blue-200">
              {selectedLocation.state_name}
            </p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && <ErrorState message={error} onRetry={refetch} />}

        {/* Empty State */}
        {!loading && !error && !hasMovies && <EmptyState />}

        {/* Films Sections */}
        {!loading && !error && hasMovies && (
          <>
            <MovieSection
              title="Recommended Movies"
              description="Curated picks based on this week's movie recommendations"
              films={films.recommended}
            />
            <MovieSection
              title="Latest Movies"
              description="Explore our latest movie title cards"
              films={films.latest}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
