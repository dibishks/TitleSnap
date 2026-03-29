import { useEffect, useRef, useState } from 'react';
import { useLocation } from '../hooks/LocationContext';

interface LocationPickerProps {
  isMobile?: boolean;
}

const LocationPicker = ({ isMobile = false }: LocationPickerProps) => {
  const { states, loading, selectedLocation, setSelectedLocation } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleSelect = (cityId: string) => {
    const nextLocation = states.find((item) => item.city_id === cityId);

    if (!nextLocation) {
      return;
    }

    setSelectedLocation(nextLocation);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
          Location
        </p>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-full flex items-center justify-between rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-left text-sm text-gray-900 dark:text-white"
          >
            <span>{selectedLocation?.state_name || 'Select State'}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {loading ? 'Loading...' : 'Change'}
            </span>
          </button>

          {isOpen && states.length > 0 && (
            <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
              {states.map((state) => (
                <button
                  key={state.city_id}
                  type="button"
                  onClick={() => handleSelect(state.city_id)}
                  className={`block w-full px-4 py-3 text-left text-sm transition-colors ${
                    selectedLocation?.city_id === state.city_id
                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {state.state_name}
                </button>
              ))}
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
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <span>{selectedLocation?.state_name || 'Select State'}</span>
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
        <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl z-50">
          <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Select State
            </p>
          </div>

          {loading && (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              Loading states...
            </div>
          )}

          {!loading && states.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              No states available
            </div>
          )}

          {!loading && states.length > 0 && (
            <div className="max-h-72 overflow-y-auto py-2">
              {states.map((state) => (
                <button
                  key={state.city_id}
                  type="button"
                  onClick={() => handleSelect(state.city_id)}
                  className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                    selectedLocation?.city_id === state.city_id
                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  role="option"
                  aria-selected={selectedLocation?.city_id === state.city_id}
                >
                  {state.state_name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
