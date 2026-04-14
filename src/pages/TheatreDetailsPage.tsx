import { Link, useParams } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';
import { useTheatreShowtimes } from '../hooks/useTheatreShowtimes';

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
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleTimeString('en-IN', {
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
    year: 'numeric',
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

const TheatreDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { theatre, showDate, loading, error, refetch } = useTheatreShowtimes(id || '');
  const movies = theatre?.movies || [];
  const lastSeen = formatLastSeen(theatre?.last_seen_at);
  const mapUrl =
    theatre && typeof theatre.latitude === 'number' && typeof theatre.longitude === 'number'
      ? `https://www.google.com/maps?q=${theatre.latitude},${theatre.longitude}`
      : null;

  useSeo({
    title: theatre ? `${theatre.name} Show Times | TitleSnap` : 'Theatre Show Times | TitleSnap',
    description: theatre
      ? `Browse movies and showtimes for ${theatre.name} in ${theatre.city_name}.`
      : 'Browse theatre details and movie showtimes on TitleSnap.',
    keywords: theatre
      ? [
          `${theatre.name} showtimes`,
          `${theatre.city_name} theatre showtimes`,
          `${theatre.name} movies`,
        ].join(', ')
      : 'theatre showtimes, cinema timings',
    canonicalPath: `${window.location.pathname}${window.location.search}`,
    image: theatre?.cinema_logo_url || '/img/titlesnap-banner-moto.png',
    structuredData: theatre
      ? {
          '@context': 'https://schema.org',
          '@type': 'MovieTheater',
          name: theatre.name,
          address: theatre.address,
          url: window.location.href,
        }
      : undefined,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.22),_transparent_32%),linear-gradient(135deg,#111827_0%,#1f2937_48%,#7c2d12_100%)]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-16">
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-32 rounded bg-white/20" />
              <div className="h-12 w-2/3 rounded bg-white/20" />
              <div className="h-5 w-1/2 rounded bg-white/20" />
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800"
              >
                <div className="animate-pulse space-y-4">
                  <div className="h-6 w-1/3 rounded bg-stone-200 dark:bg-gray-700" />
                  <div className="h-4 w-1/4 rounded bg-stone-200 dark:bg-gray-700" />
                  <div className="flex gap-3">
                    <div className="h-16 w-40 rounded-2xl bg-stone-200 dark:bg-gray-700" />
                    <div className="h-16 w-40 rounded-2xl bg-stone-200 dark:bg-gray-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !theatre) {
    return (
      <div className="min-h-screen bg-stone-50 px-4 py-16 text-center dark:bg-gray-900">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-red-200 bg-white p-10 shadow-sm dark:border-red-900/30 dark:bg-gray-800">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Theatre details unavailable
          </h1>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {error || 'No showtimes available for this theatre right now.'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={refetch}
              className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
            <Link
              to="/theatres"
              className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-stone-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Back to theatres
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
      <section className="bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.22),_transparent_32%),linear-gradient(135deg,#111827_0%,#1f2937_48%,#7c2d12_100%)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-16">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-white/70">
              <li>
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/theatres" className="hover:text-white">
                  Theatres
                </Link>
              </li>
              <li>/</li>
              <li className="text-white">{theatre.name}</li>
            </ol>
          </nav>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-start gap-4">
                {theatre.cinema_logo_url ? (
                  <img
                    src={theatre.cinema_logo_url}
                    alt={theatre.name}
                    className="h-20 w-20 rounded-3xl border border-white/15 bg-white p-3 object-contain"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-3xl font-bold text-white">
                    {theatre.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-200/80">
                    Theatre Show Times
                  </p>
                  <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
                    {theatre.name}
                  </h1>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-white/80">
                    {theatre.address}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/80">
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                  {theatre.city_name}, {theatre.state_name || 'India'}
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                  {formatShowDate(showDate)}
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                  {movies.length} movie{movies.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <div className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <h2 className="text-lg font-semibold text-white">Theatre Details</h2>
              <div className="mt-4 space-y-3 text-sm text-white/80">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/60">Pincode</span>
                  <span>{theatre.pincode || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/60">Chain</span>
                  <span>{theatre.chain_key || 'Independent'}</span>
                </div>
                {lastSeen && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/60">Last seen</span>
                    <span>{lastSeen}</span>
                  </div>
                )}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {(theatre.amenity_names || []).slice(0, 5).map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-stone-100"
                >
                  Open Map
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="border-b border-stone-200 bg-stone-100 px-6 py-4 dark:border-gray-700 dark:bg-gray-900/60">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Movies & Show Times</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Showtimes displayed in local 12-hour format for easy scanning.
            </p>
          </div>

          {movies.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                No showtimes listed right now
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Check back later for the latest movie schedule.
              </p>
            </div>
          )}

          {movies.map((movieGroup) => {
            const language = movieGroup.movie.movie_variants?.[0]?.language;
            const format = movieGroup.movie.movie_variants?.[0]?.format;
            return (
              <div
                key={movieGroup.movie.movie_id}
                className="grid gap-6 border-b border-stone-200 px-6 py-6 last:border-b-0 md:grid-cols-[minmax(0,1fr)_minmax(320px,42%)] dark:border-gray-700"
              >
                <div className="min-w-0">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {movieGroup.movie.name}
                    {movieGroup.movie.censor ? ` (${movieGroup.movie.censor})` : ''}
                  </h3>
                  <p className="mt-3 text-lg">
                    {language && (
                      <span className="font-medium text-rose-500 dark:text-rose-400">
                        {language}
                      </span>
                    )}
                    {format && (
                      <span className="text-gray-500 dark:text-gray-400">
                        {language ? `, ${format}` : format}
                      </span>
                    )}
                  </p>
                  {movieGroup.movie.genres && movieGroup.movie.genres.length > 0 && (
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      {movieGroup.movie.genres.join(' | ')}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-start gap-4">
                  {movieGroup.shows.map((show) => (
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
        </section>
      </main>
    </div>
  );
};

export default TheatreDetailsPage;
