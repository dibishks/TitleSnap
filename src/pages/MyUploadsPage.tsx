import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSeo } from '../hooks/useSeo';
import { ApiError, apiClient } from '../services/api';
import type { MyUploadsResponse, UserUploadedSnap } from '../types/movie';

const PAGE_SIZE = 20;

const formatReleaseDate = (timestamp?: string) => {
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

const formatCreatedDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const MyUploadsPage = () => {
  const { user, getAccessToken, logout, loginRedirect } = useAuth();
  const [snaps, setSnaps] = useState<UserUploadedSnap[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useSeo({
    title: 'My Uploads | TitleSnap',
    description:
      'View and manage your uploaded movie title snaps, track your latest contributions, and continue sharing title moments on TitleSnap.',
    keywords: 'my uploads, uploaded movie title snaps, user title snaps, titlesnap profile',
    canonicalPath: '/my-uploads',
    robots: 'noindex, nofollow',
  });

  const fetchUploads = useCallback(
    async (nextPage: number, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      try {
        const token = await getAccessToken();

        if (!token) {
          logout();
          await loginRedirect();
          return;
        }

        const response = await apiClient.get<MyUploadsResponse>('titlesnap/me/snaps', {
          params: {
            page: nextPage,
            limit: PAGE_SIZE,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const nextSnaps = response.data?.snaps || [];
        const pagination = response.data?.pagination;
        setSnaps((current) => (append ? [...current, ...nextSnaps] : nextSnaps));
        setPage(pagination?.page || nextPage);
        setHasMore(Boolean(pagination?.has_more));
        setTotal(pagination?.total || nextSnaps.length);
        setError(null);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          logout();
          await loginRedirect();
          return;
        }

        setError(
          err instanceof Error ? err.message : 'Failed to load your uploaded title snaps.'
        );

        if (!append) {
          setSnaps([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [getAccessToken, loginRedirect, logout]
  );

  useEffect(() => {
    void fetchUploads(1);
  }, [fetchUploads]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 px-8 py-10 text-white shadow-xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/65">
              Protected Dashboard
            </p>
            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">My Uploads</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
              Review the title snaps you have shared with the community, revisit the movie pages,
              and keep track of your latest uploads in one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/80">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                {user?.name || user?.email || 'TitleSnap User'}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                {total} upload{total === 1 ? '' : 's'}
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
                Could not load your uploads
              </h2>
              <p className="mt-3 text-sm text-red-600 dark:text-red-200">{error}</p>
              <button
                type="button"
                onClick={() => void fetchUploads(1)}
                className="mt-5 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && snaps.length === 0 && (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                No uploads yet
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                Start sharing your first movie title snap and it will appear here.
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
                    Uploaded Title Snaps
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Page {page} - {total} total uploads
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
                        src={snap.image_url}
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
                            Release: {formatReleaseDate(snap.movie.release_date)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {snap.movie.genres.slice(0, 3).map((genre) => (
                          <span
                            key={genre}
                            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                          >
                            {genre}
                          </span>
                        ))}
                        {snap.movie.movie_variants.slice(0, 2).map((variant) => (
                          <span
                            key={`${snap.id}-${variant.language}-${variant.format}`}
                            className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                          >
                            {variant.language} | {variant.format}
                          </span>
                        ))}
                      </div>

                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                        {snap.movie.description ||
                          snap.movie.reason_to_watch ||
                          'Movie details not available.'}
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

              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() => void fetchUploads(page + 1, true)}
                    disabled={loadingMore}
                    className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    {loadingMore ? 'Loading more uploads...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyUploadsPage;
