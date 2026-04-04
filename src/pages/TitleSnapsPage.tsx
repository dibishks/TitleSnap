import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';
import { apiClient } from '../services/api';
import type { PublicSnapsResponse, PublicTitleSnap } from '../types/movie';

const PAGE_SIZE = 20;

const formatCreatedDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const getPageFromSearchParams = (searchParams: URLSearchParams) => {
  const parsed = Number(searchParams.get('page'));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

const TitleSnapsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = getPageFromSearchParams(searchParams);
  const [snaps, setSnaps] = useState<PublicTitleSnap[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalPages = useMemo(() => {
    if (!total) {
      return hasMore ? currentPage + 1 : currentPage;
    }

    return Math.max(1, Math.ceil(total / PAGE_SIZE));
  }, [currentPage, hasMore, total]);

  useSeo({
    title: 'All Title Snaps | TitleSnap',
    description:
      'Browse every public title snap uploaded on TitleSnap across all movies, discover fresh community uploads, and open the movie pages behind each snap.',
    keywords:
      'all title snaps, public title snaps, movie title snap gallery, community movie uploads, titlesnap gallery',
    canonicalPath: currentPage > 1 ? `/titlesnaps?page=${currentPage}` : '/titlesnaps',
    image: '/img/titlesnap-banner-moto.png',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'TitleSnap Public Snaps',
      url:
        currentPage > 1
          ? `${window.location.origin}/titlesnaps?page=${currentPage}`
          : `${window.location.origin}/titlesnaps`,
      description:
        'A public collection of community-uploaded title snaps across all movies on TitleSnap.',
    },
  });

  const fetchSnaps = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiClient.get<PublicSnapsResponse>('titlesnap/snaps', {
        params: {
          page,
          limit: PAGE_SIZE,
        },
      });
      const nextSnaps = result.data?.snaps || [];
      const pagination = result.data?.pagination;

      setSnaps(nextSnaps);
      setTotal(pagination?.total || nextSnaps.length);
      setHasMore(Boolean(pagination?.has_more));
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load public title snaps.'
      );
      setSnaps([]);
      setTotal(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSnaps(currentPage);
  }, [currentPage, fetchSnaps]);

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
    <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 px-8 py-10 text-white shadow-xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/65">
              Public Gallery
            </p>
            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">All Title Snaps</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
              Browse public title snaps uploaded across every movie on TitleSnap, jump into the
              related movie pages, and explore the latest community submissions in one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/80">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                Public access
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                {total} snap{total === 1 ? '' : 's'}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                Page {currentPage}
              </span>
            </div>
          </div>
        </section>

        <div className="mt-10">
          {loading && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm animate-pulse dark:bg-gray-800"
                >
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
                  <div className="space-y-4 p-6">
                    <div className="h-6 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/30 dark:bg-red-900/20">
              <h2 className="text-xl font-semibold text-red-700 dark:text-red-300">
                Could not load title snaps
              </h2>
              <p className="mt-3 text-sm text-red-600 dark:text-red-200">{error}</p>
              <button
                type="button"
                onClick={() => void fetchSnaps(currentPage)}
                className="mt-5 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && snaps.length === 0 && (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                No title snaps yet
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                Public uploads will appear here as soon as users share them.
              </p>
              <Link
                to="/movies"
                className="mt-6 inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Explore Movies
              </Link>
            </div>
          )}

          {!loading && !error && snaps.length > 0 && (
            <>
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Community Uploads
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} of {totalPages} - {total} total uploads
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {snaps.map((snap) => (
                  <article
                    key={snap.id}
                    className="overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="relative">
                      <img
                        src={snap.thumbnail_url || snap.image_url}
                        alt={`Uploaded title snap for ${snap.movie.name}`}
                        className="aspect-video w-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                        {snap.status}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={snap.movie.image}
                          alt={`${snap.movie.name} poster`}
                          className="h-24 w-16 rounded-2xl object-cover shadow-sm"
                          loading="lazy"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 text-xl font-semibold text-gray-900 dark:text-white">
                            {snap.movie.name}
                          </h3>
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Uploaded on {formatCreatedDate(snap.created_at)}
                          </p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Movie ID: {snap.movie.movie_id}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {snap.movie.genres.slice(0, 3).map((genre) => (
                          <span
                            key={`${snap.id}-${genre}`}
                            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                          >
                            {genre}
                          </span>
                        ))}
                        {snap.movie.genres.length === 0 && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                            Community upload
                          </span>
                        )}
                      </div>

                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                        Explore this title snap, open the full movie page, and discover more
                        public uploads shared by the TitleSnap community.
                      </p>

                      <div className="mt-6 flex items-center justify-between gap-4">
                        <Link
                          to={`/movies/${snap.movie.movie_id}`}
                          className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                          View Movie
                        </Link>
                        <a
                          href={snap.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Open Upload
                        </a>
                      </div>
                    </div>
                  </article>
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
                  disabled={!hasMore}
                  className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TitleSnapsPage;
