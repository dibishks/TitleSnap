import { useAuth } from '../../hooks/useAuth';

/**
 * Profile Card Component
 * Displays user profile information with picture, name, and email
 */
const ProfileCard = () => {
  const { user, isLoading } = useAuth();

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-pulse">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mb-4" />
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-4" />
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-center text-gray-600 dark:text-gray-400">
          Please log in to view your profile
        </p>
      </div>
    );
  }

  const displayName = user.name || user.email || 'User';
  const userEmail = user.email || 'No email provided';
  const userPicture = user.picture || '';
  const userInitial = displayName.charAt(0).toUpperCase();
  const emailVerified = user.email_verified || false;

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header with gradient background */}
      <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600" />

      {/* Profile content */}
      <div className="px-6 pb-6 -mt-16">
        <div className="flex flex-col items-center">
          {/* Avatar */}
          {userPicture ? (
            <img
              src={userPicture}
              alt={displayName}
              className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-white dark:border-gray-800 shadow-lg">
              {userInitial}
            </div>
          )}

          {/* Name */}
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            {displayName}
          </h2>

          {/* Email */}
          <div className="flex items-center mt-2 space-x-2">
            <p className="text-gray-600 dark:text-gray-400">{userEmail}</p>
            {emailVerified && (
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-label="Verified email"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>

          {/* User ID */}
          {user.sub && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500 font-mono">
              ID: {user.sub}
            </p>
          )}

          {/* Stats or additional info */}
          <div className="mt-6 w-full grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Uploads</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Favorites</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">0</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Downloads</p>
            </div>
          </div>

          {/* Last updated */}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
