import { useParams, Link } from 'react-router-dom';
import { useMovieDetails } from '../hooks/useMovieDetails';

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
      <Link
        to="/"
        className="block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
      >
        Back to Home
      </Link>
    </div>
  </div>
);

const formatReleaseDate = (timestamp: string) => {
  const parsed = Number(timestamp);

  if (!parsed) {
    return 'TBA';
  }

  return new Date(parsed * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getTrailerUrl = (videoId: string) =>
  videoId ? `https://www.youtube.com/watch?v=${videoId}` : '';

/**
 * MovieDetailsPage Component
 * Displays movie details with hero section and movie metadata
 */
const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: movie, loading, error, refetch } = useMovieDetails(id || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-64 aspect-[2/3] bg-white/20 rounded-lg" />
              <div className="flex-1 space-y-4">
                <div className="h-12 bg-white/20 rounded w-3/4" />
                <div className="h-6 bg-white/20 rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-6 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-40 rounded-2xl bg-white dark:bg-gray-800 shadow-md animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ErrorState message={error || 'Movie not found'} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded"
                >
                  Home
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </li>
              <li className="font-medium" aria-current="page">
                {movie.name}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-64 flex-shrink-0">
              <img
                src={movie.image}
                alt={`${movie.name} poster`}
                className="w-full rounded-lg shadow-2xl"
                loading="eager"
                decoding="async"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/400x600/cccccc/666666?text=No+Poster';
                }}
              />
            </div>

            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.name}</h1>
              <p className="text-lg text-blue-100 mb-6">
                {movie.description || 'Movie details and latest release information'}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                    <path
                      fillRule="evenodd"
                      d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{movie.censor || 'NR'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm10 7H4v7h12V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{formatReleaseDate(movie.releaseDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.951-.69l1.068-3.292z" />
                  </svg>
                  <span>{movie.reminderCount.toLocaleString('en-US')} reminders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              About This Movie
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-7">
              {movie.description || 'Description not available.'}
            </p>

            {movie.reasonToWatch && (
              <div className="mt-6 rounded-xl bg-blue-50 dark:bg-blue-950/40 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Reason to Watch
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{movie.reasonToWatch}</p>
              </div>
            )}

            {movie.premiumTags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Highlights
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.premiumTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex rounded-full bg-purple-100 dark:bg-purple-900/50 px-3 py-1 text-sm font-medium text-purple-700 dark:text-purple-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          <div className="space-y-6">
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Movie Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Genres</p>
                  <p className="text-gray-900 dark:text-white">
                    {movie.genres.length > 0 ? movie.genres.join(', ') : 'Not available'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Available Variants</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {movie.movieVariants.length > 0 ? (
                      movie.movieVariants.map((variant) => (
                        <span
                          key={`${variant.language}-${variant.format}`}
                          className="inline-flex rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-sm text-gray-700 dark:text-gray-200"
                        >
                          {variant.language} | {variant.format}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-900 dark:text-white">Not available</span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {movie.videoData?.thumbnail && (
              <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                <img
                  src={movie.videoData.thumbnail}
                  alt={`${movie.name} trailer thumbnail`}
                  className="w-full aspect-video object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Trailer Preview
                  </h2>
                  {movie.videoData.url ? (
                    <a
                      href={getTrailerUrl(movie.videoData.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Watch trailer
                    </a>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      Trailer link not available
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetailsPage;
