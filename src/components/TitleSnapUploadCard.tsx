import { useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { MovieDetail } from '../types/movie';

interface TitleSnapUploadCardProps {
  movie: MovieDetail;
  onUploadSuccess: () => void;
  className?: string;
  cardId?: string;
}

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

const isAuthExpiredError = (status: number, message: string) =>
  status === 401 || /invalid or expired token/i.test(message);

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

const TitleSnapUploadCard = ({
  movie,
  onUploadSuccess,
  className = '',
  cardId,
}: TitleSnapUploadCardProps) => {
  const { isAuthenticated, loginRedirect, getAccessToken, logout } = useAuth();
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  const resetForm = () => {
    setShowUploadForm(false);
    setSelectedFile(null);
    setUploadError(null);
    setUploadMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      const requestUrl = `${baseUrl}/titlesnap/movies/${movie.movieId}/snaps`;

      console.groupCollapsed('[TitleSnap Upload] Starting upload');
      console.log(
        '[TitleSnap Upload] Request context:',
        getUploadDebugContext(selectedFile, requestUrl, Boolean(appToken))
      );

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${appToken}`,
        },
        body: formData,
      });
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
          resetForm();
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
      onUploadSuccess();
    } catch (err) {
      console.error('[TitleSnap Upload] Upload failed before completion:', err);
      console.log(
        '[TitleSnap Upload] Failure context:',
        getUploadDebugContext(
          selectedFile,
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'}/titlesnap/movies/${movie.movieId}/snaps`,
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

  return (
    <section
      id={cardId}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Share your Title Snap
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Upload your snap of <span className="font-semibold">{movie.name}</span> and help the
            community discover it. Sign in to upload.
          </p>
        </div>
      </div>

      <div className="mt-5">
        {!showUploadForm && (
          <button
            type="button"
            onClick={() => void handleUploadClick()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Upload Title Snap
          </button>
        )}

        {showUploadForm && (
          <form onSubmit={(event) => void handleUploadSubmit(event)} className="space-y-4">
            <div>
              <label
                htmlFor={inputId}
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Select image
              </label>
              <input
                ref={fileInputRef}
                id={inputId}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {selectedFile && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedFile.name}</p>
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
                onClick={resetForm}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default TitleSnapUploadCard;
