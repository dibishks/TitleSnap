import { Link } from 'react-router-dom';
import type { TheatreShowtimeItem } from '../types/theatre';
import { parseApiUtcDateTime } from '../utils/dateTime';

const formatShowDate = (value?: string | null) => {
  if (!value) {
    return 'Today';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (value: string) => {
  const parsed = parseApiUtcDateTime(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const formatLastSeen = (value?: string) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const getShowtimeTone = (statusColor?: string) => {
  switch ((statusColor || '').toUpperCase()) {
    case 'G':
      return 'border-emerald-200 text-emerald-600 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300';
    case 'Y':
      return 'border-amber-200 text-amber-600 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300';
    case 'R':
      return 'border-red-200 text-red-600 bg-red-50 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300';
    default:
      return 'border-stone-300 text-amber-600 bg-white dark:border-gray-700 dark:bg-gray-900 dark:text-amber-300';
  }
};

interface MovieShowtimesSectionProps {
  theatres: TheatreShowtimeItem[];
  showDate: string | null;
  loading: boolean;
  error: string | null;
  cityName?: string;
  onRetry: () => void;
}

const MovieShowtimesSection = ({
  theatres,
  showDate,
  loading,
  error,
  cityName,
  onRetry,
}: MovieShowtimesSectionProps) => {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Theatres &amp; Showtimes
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {cityName
              ? `${formatShowDate(showDate)} in ${cityName}`
              : formatShowDate(showDate)}
          </p>
        </div>
      </div>

      {loading && (
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-stone-200 p-6 dark:border-gray-700"
            >
              <div className="animate-pulse space-y-4">
                <div className="h-6 w-1/3 rounded bg-stone-200 dark:bg-gray-700" />
                <div className="h-4 w-2/3 rounded bg-stone-200 dark:bg-gray-700" />
                <div className="flex flex-wrap gap-3">
                  <div className="h-16 w-32 rounded-xl bg-stone-200 dark:bg-gray-700" />
                  <div className="h-16 w-32 rounded-xl bg-stone-200 dark:bg-gray-700" />
                  <div className="h-16 w-32 rounded-xl bg-stone-200 dark:bg-gray-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && theatres.length === 0 && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/40 dark:bg-red-900/20">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && theatres.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center dark:border-gray-600 dark:bg-gray-900/50">
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            No showtimes listed right now
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Check back later for the latest theatre schedule.
          </p>
        </div>
      )}

      {!loading && theatres.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {theatres.map((theatre) => {
            const movieGroup = theatre.movies?.[0];
            const shows = movieGroup?.shows || [];
            const language = movieGroup?.movie.movie_variants?.[0]?.language;
            const format = movieGroup?.movie.movie_variants?.[0]?.format;
            const lastSeen = formatLastSeen(theatre.last_seen_at);

            return (
              <div
                key={theatre.theatre_id}
                className="grid gap-6 border-b border-stone-200 px-6 py-6 last:border-b-0 md:grid-cols-[minmax(0,1fr)_minmax(320px,42%)] dark:border-gray-700"
              >
                <div className="min-w-0">
                  <div className="flex items-start gap-4">
                    {theatre.cinema_logo_url ? (
                      <img
                        src={theatre.cinema_logo_url}
                        alt={theatre.name}
                        className="h-12 w-12 rounded-xl border border-stone-200 bg-white object-contain p-2 dark:border-gray-700"
                        loading="lazy"
                      />
                    ) : null}
                    <div className="min-w-0">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        <Link to={`/theatres/${theatre.theatre_id}`} className="hover:underline">
                          {theatre.name}
                        </Link>
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {theatre.address}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        {(language || format) && (
                          <span className="text-gray-500 dark:text-gray-400">
                            {language ? (
                              <span className="font-medium text-rose-500 dark:text-rose-400">
                                {language}
                              </span>
                            ) : null}
                            {format ? ` ${language ? '-' : ''} ${format}` : ''}
                          </span>
                        )}
                        {movieGroup?.movie.censor ? (
                          <span className="text-gray-500 dark:text-gray-400">
                            {movieGroup.movie.censor}
                          </span>
                        ) : null}
                        {lastSeen ? (
                          <span className="text-gray-500 dark:text-gray-400">
                            Updated {lastSeen}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-start gap-4">
                  {shows.map((show) => (
                    <div
                      key={show.show_id}
                      className={`flex min-h-[58px] min-w-[132px] flex-col items-center justify-center rounded-xl border px-3 py-2 text-center ${getShowtimeTone(show.status_color)}`}
                    >
                      <span className="text-lg font-semibold leading-none">
                        {formatTime(show.show_time)}
                      </span>
                      <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em]">
                        {show.audi || show.screen_format || 'Show'}
                      </span>
                      {(show.subtitle || show.screen_format) && (
                        <span className="mt-0.5 text-[11px]">
                          {show.subtitle || show.screen_format}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MovieShowtimesSection;
