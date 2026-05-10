import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import OttMovieCard from '../components/OttMovieCard';
import { useOttMovies } from '../hooks/useOttMovies';
import { useSeo } from '../hooks/useSeo';

const PAGE_SIZE = 20;

const getPageFromSearchParams = (searchParams: URLSearchParams) => {
  const parsed = Number(searchParams.get('page'));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

const OttMovieCardSkeleton = () => (
  <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md animate-pulse">
    <div className="aspect-[2/3] bg-gray-300 dark:bg-gray-700" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
      <div className="flex gap-2">
        <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
        <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  </div>
);

const OttMoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = getPageFromSearchParams(searchParams);
  const { movies, pagination, loading, error, refetch } = useOttMovies(
    currentPage,
    PAGE_SIZE
  );

  const totalPages = useMemo(() => {
    const total = pagination?.total || 0;

    if (!total) {
      return pagination?.has_more ? currentPage + 1 : currentPage;
    }

    return Math.max(1, Math.ceil(total / PAGE_SIZE));
  }, [currentPage, pagination?.has_more, pagination?.total]);

  useSeo({
    title: 'OTT Movies | TitleSnap',
    description:
      'Browse OTT movies streaming across platforms — discover release years, languages, genres, and where to watch each title.',
    keywords:
      'ott movies, streaming movies, ott releases, where to watch, online streaming, titlesnap ott',
    canonicalPath:
      currentPage > 1 ? `/ott-movies?page=${currentPage}` : '/ott-movies',
    image: '/img/titlesnap-banner-moto.png',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'TitleSnap OTT Movies',
      url:
        currentPage > 1
          ? `${window.location.origin}/ott-movies?page=${currentPage}`
          : `${window.location.origin}/ott-movies`,
      description:
        'A directory of OTT movies streaming online with platform, release year, and language information.',
    },
  });

  const changePage = (nextPage: number) => {
    const normalizedPage = Math.max(1, nextPage);
    const nextSearchParams = new URLSearchParams(searchParams);

    if (normalizedPage === 1) {
      nextSearchParams.delete('page');
    } else {
      nextSearchParams.set('page', String(normalizedPage));
    }

    setSearchParams(nextSearchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-white/60">
              OTT Directory
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              OTT movies streaming now
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
              Discover movies streaming across OTT platforms — find release
              dates, supported languages, genres, and where to watch each
              title.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/80">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                {pagination?.total || movies.length} movie
                {(pagination?.total || movies.length) === 1 ? '' : 's'}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                Page {currentPage}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                Public listing
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <OttMovieCardSkeleton key={index} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/30 dark:bg-red-900/20">
            <h2 className="text-xl font-semibold text-red-700 dark:text-red-300">
              Could not load OTT movies
            </h2>
            <p className="mt-3 text-sm text-red-600 dark:text-red-200">{error}</p>
            <button
              type="button"
              onClick={refetch}
              className="mt-5 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              No OTT movies available
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              OTT titles will appear here as soon as they are indexed.
            </p>
          </div>
        )}

        {!loading && !error && movies.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                All OTT Movies
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages} -{' '}
                {pagination?.total || movies.length} total titles
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <OttMovieCard key={movie._id || movie.ott_id} movie={movie} />
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </p>
              <button
                type="button"
                onClick={() => changePage(currentPage + 1)}
                disabled={!pagination?.has_more}
                className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default OttMoviesPage;
