import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useStates } from './useStates';
import type { CityLocationItem } from '../types/location';

interface LocationContextValue {
  selectedLocation: CityLocationItem | null;
  states: CityLocationItem[];
  loading: boolean;
  error: string | null;
  setSelectedLocation: (location: CityLocationItem) => void;
}

const DEFAULT_CITY_KEYS = ['trivandrum', 'thiruvananthapuram'];
const STORAGE_KEY = 'titlesnap.selected_location';

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

const normalizeCityValue = (value?: string) => value?.trim().toLowerCase() || '';

const isDefaultCity = (location: CityLocationItem) => {
  const normalizedValues = [
    normalizeCityValue(location.city_name),
    normalizeCityValue(location.city_key),
    normalizeCityValue(location.cleaned_city_name),
  ];

  return DEFAULT_CITY_KEYS.some((key) => normalizedValues.includes(key));
};

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const { states, loading, error } = useStates();
  const [selectedLocation, setSelectedLocationState] = useState<CityLocationItem | null>(
    () => {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        return null;
      }

      try {
        return JSON.parse(stored) as CityLocationItem;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
    }
  );

  useEffect(() => {
    if (states.length === 0) {
      return;
    }

    const matchingSelection = selectedLocation
      ? states.find(
          (item) =>
            item.city_id === selectedLocation.city_id ||
            (normalizeCityValue(item.city_name) === normalizeCityValue(selectedLocation.city_name) &&
              normalizeCityValue(item.state_name) === normalizeCityValue(selectedLocation.state_name))
        )
      : null;

    if (matchingSelection) {
      setSelectedLocationState(matchingSelection);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(matchingSelection));
      return;
    }

    const defaultLocation = states.find(isDefaultCity) || states[0];

    setSelectedLocationState(defaultLocation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLocation));
  }, [selectedLocation, states]);

  const setSelectedLocation = (location: CityLocationItem) => {
    setSelectedLocationState(location);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  };

  const value = useMemo<LocationContextValue>(
    () => ({
      selectedLocation,
      states,
      loading,
      error,
      setSelectedLocation,
    }),
    [error, loading, selectedLocation, states]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useLocation = () => {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }

  return context;
};
