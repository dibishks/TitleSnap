import { Link } from 'react-router-dom';

/**
 * Logo Component
 * Clickable logo that links to the home page
 */
const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1 transition-all"
      aria-label="TitleSnap Home"
    >
      <div className="flex items-center space-x-2">
        {/* Movie Camera Icon */}
        <svg
          className="w-8 h-8 text-blue-600 dark:text-blue-400"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z" />
        </svg>
        
        {/* Logo Text */}
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          TitleSnap
        </span>
      </div>
    </Link>
  );
};

export default Logo;

