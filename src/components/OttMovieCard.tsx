import { Link } from 'react-router-dom';
import type { OttMovieApiItem } from '../types/ott';

interface OttMovieCardProps {
  movie: OttMovieApiItem;
}

const POSTER_FALLBACK =
  'https://via.placeholder.com/400x600/cccccc/666666?text=No+Image';

const formatStreamingDate = (value?: string): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const direct = new Date(trimmed);
  if (!Number.isNaN(direct.getTime())) {
    return direct.toLocaleDateString(undefined, formatOptions);
  }

  // Strip trailing non-digit junk (e.g. "14 Apr 2026A" from upstream scraper).
  const cleaned = trimmed.replace(/[^\d]+$/, '').trim();
  if (cleaned && cleaned !== trimmed) {
    const retry = new Date(cleaned);
    if (!Number.isNaN(retry.getTime())) {
      return retry.toLocaleDateString(undefined, formatOptions);
    }
  }

  return trimmed;
};

interface PlatformBadge {
  logo: string | null;
  name: string;
  key: string;
}

const buildPlatformBadges = (movie: OttMovieApiItem): PlatformBadge[] => {
  const logos = movie.platforms || [];
  const names = movie.platforms_names || [];
  const count = Math.max(logos.length, names.length);
  const badges: PlatformBadge[] = [];

  for (let i = 0; i < count; i += 1) {
    const logo = (logos[i] || '').trim();
    const name = (names[i] || '').trim();

    if (!logo && !name) continue;

    badges.push({
      logo: logo || null,
      name: name || 'Streaming platform',
      key: `${logo || ''}::${name || ''}::${i}`,
    });
  }

  return badges;
};

const OttMovieCard = ({ movie }: OttMovieCardProps) => {
  const poster = movie.big_image || movie.image || POSTER_FALLBACK;
  const platforms = buildPlatformBadges(movie);
  const streamingDate = formatStreamingDate(movie.streaming_date);
  const metaParts = [movie.release_year, movie.category, movie.genre]
    .map((part) => (part || '').trim())
    .filter(Boolean);

  const cardBody = (
    <>
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={poster}
          alt={`${movie.title} poster`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== POSTER_FALLBACK) {
              target.src = POSTER_FALLBACK;
            }
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {platforms.length > 0 && (
          <div className="absolute left-2 top-2 flex flex-wrap items-center gap-1">
            {platforms.slice(0, 3).map((platform) => (
              <span
                key={platform.key}
                title={platform.name}
                className="flex items-center justify-center h-7 w-7 rounded-full bg-white/95 shadow ring-1 ring-black/10 backdrop-blur dark:bg-gray-900/90 dark:ring-white/10 overflow-hidden"
              >
                {platform.logo ? (
                  <img
                    src={platform.logo}
                    alt={platform.name}
                    loading="lazy"
                    className="h-5 w-5 object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        'none';
                    }}
                  />
                ) : (
                  <span className="text-[10px] font-bold uppercase text-gray-700 dark:text-gray-200">
                    {platform.name.slice(0, 2)}
                  </span>
                )}
              </span>
            ))}
            {platforms.length > 3 && (
              <span className="rounded-full bg-black/70 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
                +{platforms.length - 3}
              </span>
            )}
          </div>
        )}

        {streamingDate && (
          <div className="absolute bottom-2 left-2 right-2">
            <span className="inline-block rounded-md bg-blue-600/90 px-2 py-1 text-xs font-semibold text-white shadow">
              Streaming: {streamingDate}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {movie.title}
        </h3>

        {metaParts.length > 0 && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
            {metaParts.join(' • ')}
          </p>
        )}

        {platforms.some((p) => p.name && p.name !== 'Streaming platform') && (
          <p className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-1">
            <span className="text-gray-500 dark:text-gray-400">Streaming on: </span>
            <span className="capitalize">
              {platforms
                .filter((p) => p.name && p.name !== 'Streaming platform')
                .map((p) => p.name)
                .join(', ')}
            </span>
          </p>
        )}

        {movie.languages && movie.languages.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {movie.languages.slice(0, 3).map((lang) => (
              <span
                key={lang}
                className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-700/40 dark:text-gray-300"
              >
                {lang}
              </span>
            ))}
            {movie.languages.length > 3 && (
              <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-700/40 dark:text-gray-300">
                +{movie.languages.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );

  const sharedClasses =
    'group block rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50';

  if (movie.slug) {
    return (
      <Link
        to={`/ott-movies/${movie.slug}`}
        className={sharedClasses}
        aria-label={`View streaming details for ${movie.title}`}
      >
        {cardBody}
      </Link>
    );
  }

  if (movie.link) {
    return (
      <a
        href={movie.link}
        target="_blank"
        rel="noopener noreferrer"
        className={sharedClasses}
        aria-label={`Open streaming details for ${movie.title}`}
      >
        {cardBody}
      </a>
    );
  }

  return (
    <div className={sharedClasses} aria-label={movie.title}>
      {cardBody}
    </div>
  );
};

export default OttMovieCard;
