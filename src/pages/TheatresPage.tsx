import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocation } from '../hooks/LocationContext';
import { useSeo } from '../hooks/useSeo';
import { useTheatres } from '../hooks/useTheatres';

const PAGE_SIZE = 20;

const getPageFromSearchParams = (searchParams: URLSearchParams) => {
  const parsed = Number(searchParams.get('page'));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

const TheatresPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { states } = useLocation();
  const currentPage = getPageFromSearchParams(searchParams);
  const selectedCityId = searchParams.get('city_id') || '';
  const locationFilter = searchParams.get('location') || '';
  const normalizedLocationFilter = locationFilter.trim().toLowerCase();
  const selectedCityFromLocation =
    states.find((item) => {
      const candidates = [item.city_key, item.cleaned_city_name, item.city_name]
        .filter(Boolean)
        .map((value) => value!.trim().toLowerCase());

      return candidates.includes(normalizedLocationFilter);
    }) || null;
  const effectiveCityId = selectedCityId || selectedCityFromLocation?.city_id || '';
  const activeSearch = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(activeSearch);
  const selectedCity =
    states.find((item) => item.city_id === effectiveCityId) || selectedCityFromLocation || null;
  const { theatres, pagination, loading, error, refetch } = useTheatres(
    currentPage,
    PAGE_SIZE,
    effectiveCityId || undefined,
    activeSearch || undefined
  );

  useEffect(() => {
    setSearchInput(activeSearch);
  }, [activeSearch]);

  const totalPages = useMemo(() => {
    const total = pagination?.total || 0;

    if (!total) {
      return pagination?.has_more ? currentPage + 1 : currentPage;
    }

    return Math.max(1, Math.ceil(total / PAGE_SIZE));
  }, [currentPage, pagination?.has_more, pagination?.total]);

  const canonicalParams = new URLSearchParams();
  if (currentPage > 1) {
    canonicalParams.set('page', String(currentPage));
  }
  if (locationFilter) {
    canonicalParams.set('location', locationFilter);
  } else if (selectedCityId) {
    canonicalParams.set('city_id', selectedCityId);
  }
  if (activeSearch) {
    canonicalParams.set('search', activeSearch);
  }

  const canonicalPath = canonicalParams.toString()
    ? `/theatres?${canonicalParams.toString()}`
    : '/theatres';
  const pageTitle = selectedCity
    ? `Theatres in ${selectedCity.city_name} | TitleSnap`
    : 'Theatres Listing | TitleSnap';
  const pageDescription = selectedCity
    ? `Browse theatres in ${selectedCity.city_name}, search cinema names, and explore amenities, addresses, and location details on TitleSnap.`
    : 'Browse all theatres on TitleSnap, filter by city, search cinema names, and explore amenities, addresses, and location details.';

  useSeo({
    title: pageTitle,
    description: pageDescription,
    keywords: [
      'theatres listing',
      'cinema listing',
      'movie theatres',
      selectedCity ? `theatres in ${selectedCity.city_name}` : '',
      activeSearch ? `search theatres ${activeSearch}` : '',
    ]
      .filter(Boolean)
      .join(', '),
    canonicalPath,
    image: '/img/titlesnap-banner-moto.png',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: selectedCity ? `Theatres in ${selectedCity.city_name}` : 'TitleSnap Theatres',
      url: `${window.location.origin}${canonicalPath}`,
      description: pageDescription,
    },
  });

  const updateParams = ({
    page,
    cityId,
    search,
  }: {
    page?: number;
    cityId?: string;
    search?: string;
  }) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    const nextPage = page ?? 1;
    const nextCityId = cityId ?? effectiveCityId;
    const nextSearch = search ?? activeSearch;

    if (nextPage <= 1) {
      nextSearchParams.delete('page');
    } else {
      nextSearchParams.set('page', String(nextPage));
    }

    if (nextCityId) {
      nextSearchParams.set('city_id', nextCityId);
      nextSearchParams.delete('location');
    } else {
      nextSearchParams.delete('city_id');
      nextSearchParams.delete('location');
    }

    if (nextSearch.trim()) {
      nextSearchParams.set('search', nextSearch.trim());
    } else {
      nextSearchParams.delete('search');
    }

    setSearchParams(nextSearchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateParams({ page: 1, search: searchInput });
  };

  const formatDate = (value?: string) => {
    if (!value) {
      return null;
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
      <section className="bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.22),_transparent_32%),linear-gradient(135deg,#111827_0%,#1f2937_48%,#7c2d12_100%)] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 md:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-200/80">
              Theatre Directory
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Find theatres across cities
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              Search cinema names, filter by city, and scan amenities, addresses, and location
              details before you head out for a show.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/80">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                {pagination?.total || theatres.length} theatre
                {(pagination?.total || theatres.length) === 1 ? '' : 's'}
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                {selectedCity ? selectedCity.city_name : 'All cities'}
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                Page {currentPage}
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800 md:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(220px,280px)_auto] lg:items-end">
            <form onSubmit={handleSearchSubmit} className="space-y-2">
              <label
                htmlFor="theatre-search"
                className="text-sm font-medium text-gray-800 dark:text-gray-200"
              >
                Search theatres
              </label>
              <div className="flex gap-3">
                <input
                  id="theatre-search"
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search by theatre name, for example PVR"
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-gray-950 transition hover:bg-amber-400"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="space-y-2">
              <label
                htmlFor="theatre-city"
                className="text-sm font-medium text-gray-800 dark:text-gray-200"
              >
                Filter by city
              </label>
              <select
                id="theatre-city"
                value={effectiveCityId}
                onChange={(event) => updateParams({ page: 1, cityId: event.target.value })}
                className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="">All cities</option>
                {states.map((city) => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.city_name} ({city.state_name})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                updateParams({ page: 1, cityId: '', search: '' });
              }}
              className="rounded-2xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-stone-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Reset
            </button>
          </div>
        </section>

        <section className="mt-8">
          {loading && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800"
                >
                  <div className="animate-pulse space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-stone-200 dark:bg-gray-700" />
                    <div className="h-6 w-3/4 rounded bg-stone-200 dark:bg-gray-700" />
                    <div className="h-4 w-full rounded bg-stone-200 dark:bg-gray-700" />
                    <div className="h-4 w-5/6 rounded bg-stone-200 dark:bg-gray-700" />
                    <div className="flex gap-2">
                      <div className="h-8 w-20 rounded-full bg-stone-200 dark:bg-gray-700" />
                      <div className="h-8 w-24 rounded-full bg-stone-200 dark:bg-gray-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/30 dark:bg-red-900/20">
              <h2 className="text-xl font-semibold text-red-700 dark:text-red-300">
                Could not load theatres
              </h2>
              <p className="mt-3 text-sm text-red-600 dark:text-red-200">{error}</p>
              <button
                type="button"
                onClick={refetch}
                className="mt-5 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && theatres.length === 0 && (
            <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white p-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                No theatres found
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                Try a different city or search term to find matching theatres.
              </p>
            </div>
          )}

          {!loading && !error && theatres.length > 0 && (
            <>
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Theatre Listings
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                    {pagination?.total ? ` | ${pagination.total} total theatres` : ''}
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedCity ? `Filtered for ${selectedCity.city_name}` : 'Showing all cities'}
                  {activeSearch ? ` | Search: ${activeSearch}` : ''}
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {theatres.map((theatre) => {
                  const lastSeen = formatDate(theatre.last_seen_at);
                  const mapUrl =
                    typeof theatre.latitude === 'number' && typeof theatre.longitude === 'number'
                      ? `https://www.google.com/maps?q=${theatre.latitude},${theatre.longitude}`
                      : null;

                  return (
                    <article
                      key={theatre.theatre_id}
                      className="group flex h-full flex-col rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-800"
                    >
                      <div className="flex items-start gap-4">
                        {theatre.cinema_logo_url ? (
                          <img
                            src={theatre.cinema_logo_url}
                            alt={theatre.name}
                            className="h-14 w-14 rounded-2xl border border-stone-200 object-contain bg-white p-2 dark:border-gray-700"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                            <span className="text-lg font-bold">
                              {theatre.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-600 dark:text-amber-300">
                            {theatre.city_name}, {theatre.state_name || 'India'}
                          </p>
                          <h3 className="mt-2 text-xl font-semibold leading-snug text-gray-900 dark:text-white">
                            {theatre.name}
                          </h3>
                          {theatre.theater_group_name && (
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              {theatre.theater_group_name}
                            </p>
                          )}
                        </div>
                      </div>

                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {theatre.address}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {(theatre.amenity_names || []).slice(0, 4).map((amenity) => (
                          <span
                            key={amenity}
                            className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                          >
                            {amenity}
                          </span>
                        ))}
                        {(theatre.amenity_names || []).length === 0 && (
                          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                            Amenities unavailable
                          </span>
                        )}
                      </div>

                      <div className="mt-6 grid gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-gray-500 dark:text-gray-400">Pincode</span>
                          <span>{theatre.pincode || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-gray-500 dark:text-gray-400">Source</span>
                          <span className="capitalize">{theatre.source || 'Unknown'}</span>
                        </div>
                        {lastSeen && (
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-gray-500 dark:text-gray-400">Last seen</span>
                            <span>{lastSeen}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        {mapUrl && (
                          <a
                            href={mapUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                          >
                            Open Map
                          </a>
                        )}
                        <span className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">
                          {theatre.chain_key || 'Independent theatre'}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => updateParams({ page: currentPage - 1 })}
                  disabled={currentPage <= 1}
                  className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </p>
                <button
                  type="button"
                  onClick={() => updateParams({ page: currentPage + 1 })}
                  disabled={!pagination?.has_more}
                  className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default TheatresPage;
