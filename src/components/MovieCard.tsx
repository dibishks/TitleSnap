import { Link } from 'react-router-dom';
import type { Film } from '../types/film';

interface MovieCardProps {
  film: Film;
}

/**
 * MovieCard component - Displays a movie poster and title
 * @param {MovieCardProps} props - Component props containing film data
 */
const MovieCard = ({ film }: MovieCardProps) => {
  // Extract movie ID from the film.url or use film.id
  const movieSlug = film.id;

  return (
    <Link
      to={`/movies/${movieSlug}`}
      className="group block rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
      aria-label={`View details for ${film.name}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={film.image}
          alt={`${film.name} poster`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            // Fallback for broken images
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x600/cccccc/666666?text=No+Image';
          }}
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {film.name}
        </h3>
        {film.variant && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {film.variant}
          </p>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;
