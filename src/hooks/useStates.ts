import { useEffect, useState } from 'react';
import { apiClient, ApiError } from '../services/api';
import type { StateLocationItem, StatesResponse } from '../types/location';

interface UseStatesReturn {
  states: StateLocationItem[];
  loading: boolean;
  error: string | null;
}

const DEFAULT_STATE = 'Kerala';

export const useStates = (): UseStatesReturn => {
  const [states, setStates] = useState<StateLocationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<StatesResponse>('titlesnap/states');
        const uniqueStatesMap = new Map<string, StateLocationItem>();

        (response.data || []).forEach((item) => {
          if (!item.state_name || uniqueStatesMap.has(item.state_name)) {
            return;
          }

          uniqueStatesMap.set(item.state_name, item);
        });

        const uniqueStates = Array.from(uniqueStatesMap.values()).sort((left, right) =>
          left.state_name.localeCompare(right.state_name)
        );

        setStates(
          uniqueStates.some((item) => item.state_name === DEFAULT_STATE)
            ? [
                uniqueStates.find((item) => item.state_name === DEFAULT_STATE)!,
                ...uniqueStates.filter((item) => item.state_name !== DEFAULT_STATE),
              ]
            : uniqueStates
        );
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch states.');
        }
        setStates([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchStates();
  }, []);

  return { states, loading, error };
};
