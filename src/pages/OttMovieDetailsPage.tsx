import { Link, useParams } from 'react-router-dom';
import { useOttMovieDetails } from '../hooks/useOttMovieDetails';
import { useSeo } from '../hooks/useSeo';
import type { OttMovieApiItem } from '../types/ott';

const POSTER_FALLBACK =
  'https://via.placeholder.com/800x450/cccccc/666666?text=No+Image';

const formatStreamingDate = (
  rawDate?: string,
  isoDate?: string
): string | null => {
  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  if (isoDate) {
    const parsed = new Date(isoDate);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString(undefined, formatOptions);
    }
  }

  if (!rawDate) return null;
  const trimmed = rawDate.trim();
  if (!trimmed) return null;

  const direct = new Date(trimmed);
  if (!Number.isNaN(direct.getTime())) {
    return direct.toLocaleDateString(undefined, formatOptions);
  }

  const cleaned = trimmed.replace(/[^\d]+$/, '').trim();
  if (cleaned && cleaned !== trimmed) {
    const retry = new Date(cleaned);
    if (!Number.isNaN(retry.getTime())) {
      return retry.toLocaleDateString(undefined, formatOptions);
    }
  }

  return trimmed;
};

interface PlatformBadge {
  logo: string | null;
  name: string;
  key: string;
}

const buildPlatformBadges = (movie: OttMovieApiItem): PlatformBadge[] => {
  const logos = movie.platforms || [];
  const names = movie.platforms_names || [];
  const count = Math.max(logos.length, names.length);
  const badges: PlatformBadge[] = [];

  for (let i = 0; i < count; i += 1) {
    const logo = (logos[i] || '').trim();
    const name = (names[i] || '').trim();

    if (!logo && !name) continue;

    badges.push({
      logo: logo || null,
      name: name || 'Streaming platform',
      key: `${logo || ''}::${name || ''}::${i}`,
    });
  }

  return badges;
};

const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
    <div className="text-center max-w-md">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Could not load OTT movie
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
      >
        Try Again
      </button>
      <Link
        to="/ott-movies"
        className="block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
      >
        Back to OTT Movies
      </Link>
    </div>
  </div>
);

const OttMovieDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { movie, loading, error, refetch } = useOttMovieDetails(slug || '');

  const poster = movie?.big_image || movie?.image || POSTER_FALLBACK;
  const platforms = movie ? buildPlatformBadges(movie) : [];
  const streamingDate = movie
    ? formatStreamingDate(movie.streaming_date, movie.streaming_date_at)
    : null;
  const genres = movie?.genres?.filter(Boolean) || [];
  const languages = movie?.languages?.filter(Boolean) || [];

  useSeo({
    title: movie
      ? `${movie.title} OTT Streaming Details | TitleSnap`
      : 'OTT Movie Details | TitleSnap',
    description: movie
      ? `Watch ${movie.title} streaming online. Find release year, languages, genres, and OTT platforms streaming this title.`
      : 'OTT movie details on TitleSnap.',
    image: movie?.big_image || movie?.image || '/img/titlesnap-banner-moto.png',
    type: 'article',
    canonicalPath: `/ott-movies/${slug}`,
    structuredData: movie
      ? {
          '@context': 'https://schema.org',
          '@type': 'Movie',
          name: movie.title,
          image: movie.big_image || movie.image,
          genre: genres,
          inLanguage: languages,
          datePublished: movie.streaming_date_at || undefined,
          url: window.location.href,
        }
      : undefined,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 animate-pulse">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-72 aspect-[2/3] bg-white/20 rounded-lg" />
              <div className="flex-1 space-y-4">
                <div className="h-12 bg-white/20 rounded w-3/4" />
                <div className="h-6 bg-white/20 rounded w-1/2" />
                <div className="h-6 bg-white/20 rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ErrorState
          message={error || 'OTT movie not found'}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-white/80">
              <li>
                <Link
                  to="/"
                  className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  to="/ott-movies"
                  className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded"
                >
                  OTT Movies
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-white" aria-current="page">
                {movie.title}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-72 flex-shrink-0">
              <img
                src={poster}
                alt={`${movie.title} poster`}
                className="w-full rounded-lg shadow-2xl"
                loading="eager"
                decoding="async"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== POSTER_FALLBACK) {
                    target.src = POSTER_FALLBACK;
                  }
                }}
              />
            </div>

            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {movie.title}
              </h1>

              <div className="flex flex-wrap gap-3 text-sm">
                {streamingDate && (
                  <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                    Streaming: {streamingDate}
                  </span>
                )}
                {movie.release_year && (
                  <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                    {movie.release_year}
                  </span>
                )}
                {movie.category && (
                  <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                    {movie.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-2">
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Streaming Details
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">
                    Streaming Date
                  </dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">
                    {streamingDate || 'Not available'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">
                    Release Year
                  </dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">
                    {movie.release_year || 'Not available'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">
                    Category
                  </dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">
                    {movie.category || 'Not available'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">
                    Genres
                  </dt>
                  <dd className="mt-1">
                    {genres.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {genres.map((genre) => (
                          <span
                            key={genre}
                            className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-700/40 dark:text-gray-200"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-900 dark:text-white">
                        Not available
                      </span>
                    )}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">
                    Languages
                  </dt>
                  <dd className="mt-1">
                    {languages.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {languages.map((lang) => (
                          <span
                            key={lang}
                            className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-700/40 dark:text-gray-200"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-900 dark:text-white">
                        Not available
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </section>

            {movie.big_image && (
              <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                <img
                  src={movie.big_image}
                  alt={`${movie.title} banner`}
                  className="w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== POSTER_FALLBACK) {
                      target.src = POSTER_FALLBACK;
                    }
                  }}
                />
              </section>
            )}
          </div>

          <div className="space-y-6">
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Streaming Platforms
              </h2>

              {platforms.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                  No platform information available.
                </p>
              ) : (
                <ul className="space-y-3">
                  {platforms.map((platform) => (
                    <li
                      key={platform.key}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 px-4 py-3"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-900 shadow ring-1 ring-white/10 overflow-hidden">
                        {platform.logo ? (
                          <img
                            src={platform.logo}
                            alt={`${platform.name} logo`}
                            className="h-8 w-8 object-contain"
                            loading="lazy"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display =
                                'none';
                            }}
                          />
                        ) : (
                          <span className="text-xs font-bold uppercase text-white">
                            {platform.name.slice(0, 2)}
                          </span>
                        )}
                      </span>
                      <span className="capitalize text-sm font-medium text-gray-900 dark:text-white">
                        {platform.name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {movie.platforms_names && movie.platforms_names.length > 0 && (
                <div className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Platform Names
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {movie.platforms_names.map((name) => (
                      <span
                        key={name}
                        className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OttMovieDetailsPage;
