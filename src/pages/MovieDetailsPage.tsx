import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMovieDetails } from '../hooks/useMovieDetails';
import { useSeo } from '../hooks/useSeo';
import { apiClient } from '../services/api';
import ImageModal from '../components/ImageModal';
import TitleSnapCard from '../components/TitleSnapCard';
import type { MovieSnapsPagination, MovieSnapsResponse, TitleSnap } from '../types/movie';

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

const isAuthExpiredError = (status: number, message: string) =>
  status === 401 || /invalid or expired token/i.test(message);

const formatReleaseDateForSchema = (timestamp: string) => {
  const parsed = Number(timestamp);

  if (!parsed) {
    return undefined;
  }

  return new Date(parsed * 1000).toISOString();
};

const toAbsoluteImageUrl = (value: string) => {
  try {
    return new URL(value, window.location.origin).toString();
  } catch {
    return value;
  }
};

const getUploadDebugContext = (file: File | null, requestUrl: string, hasToken: boolean) => ({
  userAgent: navigator.userAgent,
  pageUrl: window.location.href,
  origin: window.location.origin,
  online: navigator.onLine,
  requestUrl,
  hasToken,
  file: file
    ? {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
      }
    : null,
});

interface SnapUploadResponse {
  status: boolean;
  data: {
    message: string;
    snap: {
      id: string;
      movie_id: string;
      user_id: string;
      image_url: string;
      image_key: string;
      thumbnail_url: string;
      status: string;
      created_at: string;
      updated_at: string;
    };
  };
}

const SNAPS_PAGE_LIMIT = 20;

const mapSnap = (snap: NonNullable<MovieSnapsResponse['data']>['snaps'][number]): TitleSnap => ({
  id: snap.id,
  movieId: snap.movie_id,
  userId: snap.user_id,
  image: snap.image_url,
  imageKey: snap.image_key,
  thumbnailUrl: snap.thumbnail_url,
  status: snap.status,
  uploadOn: snap.created_at,
  updatedAt: snap.updated_at,
  userName: snap.user?.name || 'Community User',
  userPicture: snap.user?.picture || '',
});

/**
 * MovieDetailsPage Component
 * Displays movie details with hero section and movie metadata
 */
const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, loginRedirect, getAccessToken, logout } = useAuth();
  const { data: movie, loading, error, refetch } = useMovieDetails(id || '');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [snaps, setSnaps] = useState<TitleSnap[]>([]);
  const [snapsLoading, setSnapsLoading] = useState(false);
  const [snapsError, setSnapsError] = useState<string | null>(null);
  const [selectedSnap, setSelectedSnap] = useState<TitleSnap | null>(null);
  const [snapsPagination, setSnapsPagination] = useState<MovieSnapsPagination | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useSeo({
    title: movie
      ? `${movie.name} Title Snap Download HD | TitleSnap`
      : 'Movie Title Snaps | TitleSnap',
    description: movie
      ? `Download ${movie.name} title snap images in HD, explore movie details, and discover community-uploaded movie title screenshots on TitleSnap.`
      : 'Browse movie title snaps and movie details on TitleSnap.',
    keywords: movie
      ? [
          `${movie.name} title snap download`,
          `${movie.name} title card HD image`,
          `${movie.name} movie title screenshots`,
          `${movie.name} title screen download`,
          'download movie title cards',
          'high quality movie title screenshots',
          'movie title images for WhatsApp status',
        ].join(', ')
      : 'movie title snaps, movie title images',
    image: movie?.image || '/img/title-snap-logo.png',
    type: 'article',
    canonicalPath: `${window.location.pathname}${window.location.search}`,
    structuredData: movie
      ? {
          '@context': 'https://schema.org',
          '@type': 'Movie',
          name: movie.name,
          image: toAbsoluteImageUrl(movie.image),
          description:
            movie.description ||
            `Download ${movie.name} title snap images and browse community title screenshots.`,
          genre: movie.genres,
          datePublished: formatReleaseDateForSchema(movie.releaseDate),
          url: window.location.href,
        }
      : undefined,
  });

  const fetchSnaps = async (page: number, append = false) => {
    setSnapsLoading(true);
    setSnapsError(null);

    try {
      const response = await apiClient.get<MovieSnapsResponse>(
        `titlesnap/movies/${id}/snaps`,
        {
          params: {
            page,
            limit: SNAPS_PAGE_LIMIT,
          },
        }
      );

      const nextSnaps = (response.data?.snaps || []).map(mapSnap);
      setSnaps((previous) => (append ? [...previous, ...nextSnaps] : nextSnaps));
      setSnapsPagination(response.data?.pagination || null);
    } catch (err) {
      setSnapsError(
        err instanceof Error ? err.message : 'Failed to fetch community title snaps.'
      );
      if (!append) {
        setSnaps([]);
      }
    } finally {
      setSnapsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }

    void fetchSnaps(1);
  }, [id]);

  const handleUploadClick = async () => {
    if (!isAuthenticated) {
      await loginRedirect();
      return;
    }

    setUploadMessage(null);
    setUploadError(null);
    setShowUploadForm(true);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadMessage(null);
    setUploadError(null);
  };

  const handleUploadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!movie) {
      setUploadError('Movie details are not available yet. Please try again.');
      return;
    }

    if (!selectedFile) {
      setUploadError('Please select an image to upload.');
      return;
    }

    const appToken = await getAccessToken();

    if (!appToken) {
      logout();
      setShowUploadForm(false);
      setUploadError('Session expired. Please sign in again.');
      await loginRedirect();
      return;
    }

    setUploading(true);
    setUploadMessage(null);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
      const requestUrl = `${baseUrl}/titlesnap/movies/${movie.id}/snaps`;

      console.groupCollapsed('[TitleSnap Upload] Starting upload');
      console.log(
        '[TitleSnap Upload] Request context:',
        getUploadDebugContext(selectedFile, requestUrl, Boolean(appToken))
      );

      const response = await fetch(
        requestUrl,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${appToken}`,
          },
          body: formData,
        }
      );
      const responseText = await response.text();
      let result: SnapUploadResponse | null = null;

      try {
        result = responseText ? (JSON.parse(responseText) as SnapUploadResponse) : null;
      } catch (parseError) {
        console.error('[TitleSnap Upload] Failed to parse upload response JSON:', parseError);
      }

      console.log('[TitleSnap Upload] Response status:', response.status, response.statusText);
      console.log('[TitleSnap Upload] Response body:', responseText);

      if (!response.ok || !result?.status) {
        const errorMessage = result?.data?.message || 'Failed to upload title snap.';

        if (isAuthExpiredError(response.status, errorMessage)) {
          logout();
          setShowUploadForm(false);
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          setUploadError('Session expired. Please sign in again.');
          await loginRedirect();
          return;
        }

        throw new Error(errorMessage);
      }

      setUploadMessage(result.data.message || 'Image uploaded successfully!');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await fetchSnaps(1);
    } catch (err) {
      console.error('[TitleSnap Upload] Upload failed before completion:', err);
      console.log(
        '[TitleSnap Upload] Failure context:',
        getUploadDebugContext(
          selectedFile,
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'}/titlesnap/movies/${movie.id}/snaps`,
          Boolean(appToken)
        )
      );
      setUploadError(
        err instanceof Error
          ? `${err.message}. Check the browser console for upload diagnostics.`
          : 'Failed to upload title snap. Check the browser console for upload diagnostics.'
      );
    } finally {
      console.groupEnd();
      setUploading(false);
    }
  };

  const handleSnapClick = (snap: TitleSnap) => {
    setSelectedSnap(snap);
  };

  const handleSnapShare = async (snap: TitleSnap) => {
    const movieName = movie?.name || 'Movie';
    const shareData = {
      title: `${movieName} Title Snap`,
      text: `Check out this title snap from ${movieName}`,
      url: snap.image,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(snap.image);
        window.alert('Snap link copied. You can now paste it into WhatsApp, Instagram, or Facebook.');
        return;
      }

      window.prompt('Copy this snap link:', snap.image);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      window.prompt('Copy this snap link:', snap.image);
    }
  };

  const handleCloseModal = () => {
    setSelectedSnap(null);
  };

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
              Community Title Snaps
            </h2>
            {snapsLoading && snaps.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-gray-100 dark:bg-gray-900/50 overflow-hidden animate-pulse"
                  >
                    <div className="aspect-video bg-gray-300 dark:bg-gray-700" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-700" />
                      <div className="h-3 w-1/3 rounded bg-gray-300 dark:bg-gray-700" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {snapsError && snaps.length === 0 && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/40 dark:bg-red-900/20">
                <p className="text-sm text-red-700 dark:text-red-300">{snapsError}</p>
                <button
                  type="button"
                  onClick={() => void fetchSnaps(1)}
                  className="mt-4 inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            )}

            {!snapsLoading && !snapsError && snaps.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 p-10 text-center">
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  No community title snaps yet
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Be the first user to upload one for this movie.
                </p>
              </div>
            )}

            {snaps.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {snaps.map((snap) => (
                    <TitleSnapCard
                      key={snap.id}
                      titleSnap={snap}
                      movieName={movie.name}
                      onClick={() => handleSnapClick(snap)}
                      onShare={() => void handleSnapShare(snap)}
                    />
                  ))}
                </div>

                {snapsPagination?.has_more && (
                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      onClick={() => void fetchSnaps((snapsPagination.page || 1) + 1, true)}
                      disabled={snapsLoading}
                      className="inline-flex items-center rounded-lg border border-gray-300 dark:border-gray-600 px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {snapsLoading ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </>
            )}
          </section>

          <div className="space-y-6">
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Title Snap Upload
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload a single title snap for {movie.name}. If you are not signed in,
                clicking the upload button will take you to login first.
              </p>

              <div className="mt-4">
                {!showUploadForm && (
                  <button
                    type="button"
                    onClick={() => void handleUploadClick()}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Title Snap Upload
                  </button>
                )}

                {showUploadForm && (
                  <form onSubmit={(event) => void handleUploadSubmit(event)} className="space-y-4">
                    <div>
                      <label
                        htmlFor="title-snap-image"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Select image
                      </label>
                      <input
                        ref={fileInputRef}
                        id="title-snap-image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>

                    {selectedFile && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedFile.name}
                      </p>
                    )}

                    {uploadMessage && (
                      <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        {uploadMessage}
                      </div>
                    )}

                    {uploadError && (
                      <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
                        {uploadError}
                      </div>
                    )}

                    <div className="flex flex-col gap-3">
                      <button
                        type="submit"
                        disabled={uploading}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {uploading ? 'Uploading...' : 'Upload Image'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowUploadForm(false);
                          setSelectedFile(null);
                          setUploadError(null);
                          setUploadMessage(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </section>

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

      {selectedSnap && (
        <ImageModal
          isOpen={Boolean(selectedSnap)}
          onClose={handleCloseModal}
          imageSrc={selectedSnap.image}
          imageAlt={`Title snap for ${movie.name}`}
          uploaderName={selectedSnap.userName}
          uploadDate={new Date(selectedSnap.uploadOn).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        />
      )}
    </div>
  );
};

export default MovieDetailsPage;
