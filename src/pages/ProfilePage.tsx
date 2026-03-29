import ProfileCard from '../components/auth/ProfileCard';

/**
 * Profile Page
 * Displays the user's profile information
 */
const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your account information
          </p>
        </div>

        <ProfileCard />
      </div>
    </div>
  );
};

export default ProfilePage;

