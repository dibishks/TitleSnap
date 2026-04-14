import { useEffect, useRef, useState } from 'react';
import { useLocation } from '../hooks/LocationContext';

interface LocationPickerProps {
  isMobile?: boolean;
}

const LocationPicker = ({ isMobile = false }: LocationPickerProps) => {
  const { states, loading, selectedLocation, setSelectedLocation } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const getDistanceInKm = (
    fromLat: number,
    fromLon: number,
    toLat: number,
    toLon: number
  ) => {
    const toRadians = (value: number) => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const deltaLat = toRadians(toLat - fromLat);
    const deltaLon = toRadians(toLon - fromLon);
    const originLat = toRadians(fromLat);
    const destinationLat = toRadians(toLat);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2) *
        Math.cos(originLat) *
        Math.cos(destinationLat);

    return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setLocationError(null);
      return;
    }

    searchInputRef.current?.focus();
  }, [isOpen]);

  const handleSelect = (cityId: string) => {
    const nextLocation = states.find((item) => item.city_id === cityId);

    if (!nextLocation) {
      return;
    }

    setSelectedLocation(nextLocation);
    setIsOpen(false);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Location access is not supported in this browser.');
      return;
    }

    setIsDetectingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const citiesWithCoordinates = states.filter(
          (item) => typeof item.city_lat === 'number' && typeof item.city_long === 'number'
        );

        if (citiesWithCoordinates.length === 0) {
          setLocationError('No city coordinates are available right now.');
          setIsDetectingLocation(false);
          return;
        }

        const nearestCity = citiesWithCoordinates.reduce((nearest, city) => {
          const currentDistance = getDistanceInKm(
            latitude,
            longitude,
            city.city_lat as number,
            city.city_long as number
          );

          if (!nearest) {
            return { city, distance: currentDistance };
          }

          return currentDistance < nearest.distance
            ? { city, distance: currentDistance }
            : nearest;
        }, null as { city: (typeof citiesWithCoordinates)[number]; distance: number } | null);

        if (!nearestCity) {
          setLocationError('Unable to match your current location to a city.');
          setIsDetectingLocation(false);
          return;
        }

        setSelectedLocation(nearestCity.city);
        setIsDetectingLocation(false);
        setIsOpen(false);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission was denied. Please allow access and try again.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Your current location is unavailable. Please try again.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. Please try again.');
            break;
          default:
            setLocationError('Unable to get your current location. Please try again.');
            break;
        }

        setIsDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredStates = normalizedQuery
    ? states.filter((item) => {
        const cityName = item.city_name.toLowerCase();
        const stateName = item.state_name.toLowerCase();

        return cityName.includes(normalizedQuery) || stateName.includes(normalizedQuery);
      })
    : states;
  const selectedLabel = selectedLocation?.city_name || 'Select City';

  const renderOptions = () => {
    if (loading) {
      return (
        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
          Loading cities...
        </div>
      );
    }

    if (states.length === 0) {
      return (
        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
          No cities available
        </div>
      );
    }

    if (filteredStates.length === 0) {
      return (
        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
          No cities found for &quot;{searchQuery.trim()}&quot;
        </div>
      );
    }

    return (
      <div className="max-h-80 overflow-y-auto py-2">
        {filteredStates.map((city) => (
          <button
            key={city.city_id}
            type="button"
            onClick={() => handleSelect(city.city_id)}
            className={`block w-full px-4 py-3 text-left transition-colors ${
              selectedLocation?.city_id === city.city_id
                ? 'bg-blue-50 dark:bg-blue-900/40'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            role="option"
            aria-selected={selectedLocation?.city_id === city.city_id}
          >
            <span
              className={`block text-sm font-medium ${
                selectedLocation?.city_id === city.city_id
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-200'
              }`}
            >
              {city.city_name}
            </span>
            <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
              {city.state_name}
            </span>
          </button>
        ))}
      </div>
    );
  };

  const renderLocationActions = () => (
    <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={loading || isDetectingLocation}
        className="text-sm font-medium text-blue-600 transition hover:text-blue-700 disabled:cursor-not-allowed disabled:text-gray-400 dark:text-blue-400 dark:hover:text-blue-300 dark:disabled:text-gray-500"
      >
        {isDetectingLocation ? 'Detecting current location...' : 'Use Current Location'}
      </button>
      {locationError && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">{locationError}</p>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <p className="mb-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Location
        </p>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <span>{selectedLabel}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {loading ? 'Loading...' : 'Change'}
            </span>
          </button>

          {isOpen && (
            <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Select City
                </p>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search city"
                  className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                />
              </div>
              {renderLocationActions()}
              {renderOptions()}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative mr-4" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.05 8.05A7 7 0 1110 17a7 7 0 01-4.95-8.95zm4.95-6a5 5 0 100 10A5 5 0 0010 2zm0 2a3 3 0 00-3 3c0 1.657 1.79 4.13 2.535 5.07a.6.6 0 00.93 0C11.21 11.18 13 8.707 13 7.05a3 3 0 00-3-3z"
            clipRule="evenodd"
          />
        </svg>
        <span>{selectedLabel}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-[28rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Select City
            </p>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search city"
              className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>
          {renderLocationActions()}
          {renderOptions()}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
