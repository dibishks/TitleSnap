import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { useAllMovies } from '../hooks/useAllMovies';
import { useSeo } from '../hooks/useSeo';

const PAGE_SIZE = 20;

const getPageFromSearchParams = (searchParams: URLSearchParams) => {
  const parsed = Number(searchParams.get('page'));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

const MovieCardSkeleton = () => (
  <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md animate-pulse">
    <div className="aspect-[2/3] bg-gray-300 dark:bg-gray-700" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
    </div>
  </div>
);

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = getPageFromSearchParams(searchParams);
  const { movies, pagination, loading, error, refetch } = useAllMovies(currentPage, PAGE_SIZE);

  const totalPages = useMemo(() => {
    const total = pagination?.total || 0;

    if (!total) {
      return pagination?.has_more ? currentPage + 1 : currentPage;
    }

    return Math.max(1, Math.ceil(total / PAGE_SIZE));
  }, [currentPage, pagination?.has_more, pagination?.total]);

  useSeo({
    title: 'All Movies | TitleSnap',
    description:
      'Browse all movies on TitleSnap irrespective of city, explore current releases, and open each movie page for details and community title snaps.',
    keywords:
      'all movies, latest movies, movie listings, titlesnap movies, movies irrespective of city',
    canonicalPath: currentPage > 1 ? `/movies?page=${currentPage}` : '/movies',
    image: '/img/titlesnap-banner-moto.png',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'TitleSnap Movies',
      url:
        currentPage > 1
          ? `${window.location.origin}/movies?page=${currentPage}`
          : `${window.location.origin}/movies`,
      description:
        'A public list of all movies available on TitleSnap, independent of city-based discovery.',
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
      <section className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-white/60">
              Movies Directory
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Browse all movies on TitleSnap
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
              Explore every movie available on TitleSnap, independent of city filters, and open
              each title for posters, details, reminders, trailers, and community title snaps.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/80">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                {pagination?.total || movies.length} movie{(pagination?.total || movies.length) === 1 ? '' : 's'}
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
              <MovieCardSkeleton key={index} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/30 dark:bg-red-900/20">
            <h2 className="text-xl font-semibold text-red-700 dark:text-red-300">
              Could not load movies
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
              No movies available
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Movies will appear here as soon as they are available in TitleSnap.
            </p>
          </div>
        )}

        {!loading && !error && movies.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">All Movies</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages} - {pagination?.total || movies.length} total movies
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} film={movie} />
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

export default MoviesPage;
