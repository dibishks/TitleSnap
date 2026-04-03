import { useState } from 'react';
import type { TitleSnap } from '../types/movie';

interface TitleSnapCardProps {
  titleSnap: TitleSnap;
  movieName: string;
  onClick: () => void;
  onShare: () => void;
}

/**
 * Format ISO date string to readable format
 * @param isoDate - ISO date string
 * @returns Formatted date string (e.g., "Oct 19, 2025")
 */
const formatDate = (isoDate: string): string => {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoDate;
  }
};

/**
 * TitleSnapCard Component
 * Displays a title snap image with uploader info
 */
const TitleSnapCard = ({ titleSnap, movieName, onClick, onShare }: TitleSnapCardProps) => {
  const formattedDate = formatDate(titleSnap.uploadOn);
  const userName = titleSnap.userName || 'Community User';
  const [avatarFailed, setAvatarFailed] = useState(false);

  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer focus-within:ring-4 focus-within:ring-blue-500"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View title snap for ${movieName} uploaded by ${userName}`}
    >
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={titleSnap.image}
          alt={`Title card for ${movieName} uploaded by ${userName}`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/800x450/cccccc/666666?text=Image+Not+Found';
          }}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="text-white">
            <svg
              className="w-8 h-8 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
            <p className="text-sm text-center mt-1">Click to view</p>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {/* User Avatar */}
            {titleSnap.userPicture && !avatarFailed ? (
              <img
                src={titleSnap.userPicture}
                alt={userName}
                className="flex-shrink-0 w-10 h-10 rounded-full object-cover"
                onError={() => setAvatarFailed(true)}
              />
            ) : (
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onShare();
              }}
              className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={`Share title snap for ${movieName}`}
            >
              <svg
                className="mr-1.5 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C9.358 12.58 10.35 12 11.5 12c1.15 0 2.142.58 2.816 1.342m-5.632 0A3.997 3.997 0 004 17c0 2.21 1.79 4 4 4h8a4 4 0 004-4 3.997 3.997 0 00-4.684-3.658m-6.632 0A4 4 0 1115.316 9.34M12 16V4m0 0l-3 3m3-3l3 3"
                />
              </svg>
              Share
            </button>

            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleSnapCard;
