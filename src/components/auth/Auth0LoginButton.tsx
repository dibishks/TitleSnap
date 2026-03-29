import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface Auth0LoginButtonProps {
  isMobile?: boolean;
}

/**
 * Login Button Component
 * Starts the Google sign-in redirect flow.
 */
const Auth0LoginButton = ({ isMobile = false }: Auth0LoginButtonProps) => {
  const { loginRedirect, isLoading } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);

    try {
      await loginRedirect();
    } catch (error) {
      console.error('Google login failed:', error);
      setIsLoggingIn(false);
    }
  };

  const buttonClasses = isMobile
    ? 'w-full text-left px-4 py-3 text-base'
    : 'px-6 py-2 text-sm';

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading || isLoggingIn}
      className={`${buttonClasses} font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
    >
      {isLoading || isLoggingIn ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Signing in...
        </span>
      ) : (
        'Login with Google'
      )}
    </button>
  );
};

export default Auth0LoginButton;
