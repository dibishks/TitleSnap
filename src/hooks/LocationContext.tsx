import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useStates } from './useStates';
import type { StateLocationItem } from '../types/location';

interface LocationContextValue {
  selectedLocation: StateLocationItem | null;
  states: StateLocationItem[];
  loading: boolean;
  error: string | null;
  setSelectedLocation: (location: StateLocationItem) => void;
}

const DEFAULT_STATE = 'Kerala';
const STORAGE_KEY = 'titlesnap.selected_location';

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const { states, loading, error } = useStates();
  const [selectedLocation, setSelectedLocationState] = useState<StateLocationItem | null>(
    () => {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        return null;
      }

      try {
        return JSON.parse(stored) as StateLocationItem;
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
      ? states.find((item) => item.state_name === selectedLocation.state_name)
      : null;

    if (matchingSelection) {
      setSelectedLocationState(matchingSelection);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(matchingSelection));
      return;
    }

    const defaultLocation =
      states.find((item) => item.state_name === DEFAULT_STATE) || states[0];

    setSelectedLocationState(defaultLocation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLocation));
  }, [selectedLocation, states]);

  const setSelectedLocation = (location: StateLocationItem) => {
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
