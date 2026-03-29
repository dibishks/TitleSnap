import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface LoginButtonProps {
  isLoggedIn?: boolean;
  userEmail?: string;
  onLogin?: () => void;
  onLogout?: () => void;
  isMobile?: boolean;
}

/**
 * LoginButton Component
 * Displays Login button or user profile menu based on authentication state
 */
const LoginButton = ({
  isLoggedIn = false,
  userEmail = 'user@example.com',
  onLogin,
  onLogout,
  isMobile = false,
}: LoginButtonProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      // Default behavior: navigate to login page
      window.location.href = '/login';
    }
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  if (!isLoggedIn) {
    // Not logged in - show Login button
    return (
      <button
        onClick={handleLogin}
        className={`${
          isMobile
            ? 'w-full text-left px-4 py-3 text-base'
            : 'px-6 py-2 text-sm'
        } font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105 shadow-md hover:shadow-lg`}
      >
        Login
      </button>
    );
  }

  // Logged in - show profile dropdown
  if (isMobile) {
    return (
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <div className="px-4 py-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {userEmail}
          </p>
        </div>
        <div className="mt-2">
          <Link
            to="/profile"
            className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Profile
          </Link>
          <Link
            to="/my-uploads"
            className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            My Uploads
          </Link>
          <Link
            to="/settings"
            className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left block px-4 py-3 text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
          {userEmail.charAt(0).toUpperCase()}
        </div>
        
        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fade-in">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {userEmail}
            </p>
          </div>
          
          <div className="py-1">
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/my-uploads"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              My Uploads
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              Settings
            </Link>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 py-1">
            <button
              onClick={handleLogout}
              className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginButton;

