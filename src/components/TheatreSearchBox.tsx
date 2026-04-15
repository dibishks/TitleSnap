import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError, apiClient } from '../services/api';
import type { TheatreItem, TheatresResponse } from '../types/theatre';

interface TheatreSearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  inputId?: string;
  placeholder?: string;
  submitLabel?: string;
  showSubmitButton?: boolean;
  suggestionLimit?: number;
  onSubmitSearch?: (query: string) => void;
  onSuggestionSelect?: (theatre: TheatreItem) => void;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
}

const TheatreSearchBox = ({
  value,
  onChange,
  inputId = 'theatre-search',
  placeholder = 'Search by theatre name, for example PVR',
  submitLabel = 'Search',
  showSubmitButton = true,
  suggestionLimit = 8,
  onSubmitSearch,
  onSuggestionSelect,
  className = '',
  inputClassName = '',
  buttonClassName = '',
  dropdownClassName = '',
}: TheatreSearchBoxProps) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<TheatreItem[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const normalizedSearch = value.trim();

    if (normalizedSearch.length < 2) {
      setSuggestions([]);
      setSuggestionsError(null);
      setSuggestionsLoading(false);
      setIsSuggestionsOpen(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const fetchSuggestions = async () => {
        setSuggestionsLoading(true);
        setSuggestionsError(null);

        try {
          const response = await apiClient.get<TheatresResponse>('titlesnap/theatres', {
            params: {
              search: normalizedSearch,
              page: 1,
              limit: suggestionLimit,
            },
          });

          const uniqueSuggestions = Array.from(
            new Map(
              (response.data?.theatres || []).map((theatre) => [theatre.theatre_id, theatre])
            ).values()
          );

          setSuggestions(uniqueSuggestions);
          setIsSuggestionsOpen(true);
        } catch (error) {
          if (error instanceof ApiError) {
            setSuggestionsError(error.message);
          } else if (error instanceof Error) {
            setSuggestionsError(error.message);
          } else {
            setSuggestionsError('Unable to load theatre suggestions.');
          }

          setSuggestions([]);
          setIsSuggestionsOpen(true);
        } finally {
          setSuggestionsLoading(false);
        }
      };

      void fetchSuggestions();
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [suggestionLimit, value]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedSearch = value.trim();
    setIsSuggestionsOpen(false);

    if (onSubmitSearch) {
      onSubmitSearch(normalizedSearch);
      return;
    }

    navigate(
      normalizedSearch ? `/theatres?search=${encodeURIComponent(normalizedSearch)}` : '/theatres'
    );
  };

  const handleSuggestionSelect = (theatre: TheatreItem) => {
    onChange(theatre.name);
    setIsSuggestionsOpen(false);

    if (onSuggestionSelect) {
      onSuggestionSelect(theatre);
      return;
    }

    navigate(`/theatres/${theatre.theatre_id}`);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-3">
        <div className="relative flex-1" ref={containerRef}>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400 dark:text-gray-500">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="h-5 w-5"
            >
              <path
                d="M14.1667 14.1667L18.3334 18.3334M16.6667 8.75C16.6667 13.1223 13.1223 16.6667 8.75 16.6667C4.37775 16.6667 0.833374 13.1223 0.833374 8.75C0.833374 4.37775 4.37775 0.833374 8.75 0.833374C13.1223 0.833374 16.6667 4.37775 16.6667 8.75Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <input
            id={inputId}
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onFocus={() => {
              if (value.trim().length >= 2) {
                setIsSuggestionsOpen(true);
              }
            }}
            placeholder={placeholder}
            className={`w-full rounded-2xl border border-stone-300 bg-white py-3 pl-11 pr-12 text-sm text-gray-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white ${inputClassName}`.trim()}
            autoComplete="off"
          />
          {value.trim() && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                onChange('');
                setSuggestions([]);
                setSuggestionsError(null);
                setSuggestionsLoading(false);
                setIsSuggestionsOpen(false);
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-stone-400 transition hover:text-stone-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4"
              >
                <path
                  d="M6 6L14 14M14 6L6 14"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
          {isSuggestionsOpen && (
            <div
              className={`absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900 ${dropdownClassName}`.trim()}
            >
              {suggestionsLoading && (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  Loading suggestions...
                </div>
              )}
              {!suggestionsLoading && suggestionsError && (
                <div className="px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {suggestionsError}
                </div>
              )}
              {!suggestionsLoading && !suggestionsError && suggestions.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  No matching theatres found
                </div>
              )}
              {!suggestionsLoading && !suggestionsError && suggestions.length > 0 && (
                <div className="max-h-72 overflow-y-auto py-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.theatre_id}
                      type="button"
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="block w-full px-4 py-3 text-left transition hover:bg-stone-100 dark:hover:bg-gray-800"
                    >
                      <span className="block text-sm font-medium text-gray-900 dark:text-white">
                        {suggestion.name}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                        {suggestion.city_name}
                        {suggestion.state_name ? `, ${suggestion.state_name}` : ''}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {showSubmitButton && (
          <button
            type="submit"
            className={`rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-gray-950 transition hover:bg-amber-400 ${buttonClassName}`.trim()}
          >
            {submitLabel}
          </button>
        )}
      </div>
    </form>
  );
};

export default TheatreSearchBox;
