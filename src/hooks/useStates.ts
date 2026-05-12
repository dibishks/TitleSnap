import { useEffect, useState } from 'react';
import { apiClient, ApiError } from '../services/api';
import type { CitiesResponse, CityLocationItem } from '../types/location';

interface UseStatesReturn {
  states: CityLocationItem[];
  loading: boolean;
  error: string | null;
}

const DEFAULT_CITY_KEYS = ['kochi'];

const normalizeCityValue = (value?: string) => value?.trim().toLowerCase() || '';

export const useStates = (): UseStatesReturn => {
  const [states, setStates] = useState<CityLocationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<CitiesResponse>('titlesnap/states');
        const uniqueStatesMap = new Map<string, CityLocationItem>();

        (response.data || []).forEach((item) => {
          if (!item.city_id || !item.city_name || uniqueStatesMap.has(item.city_id)) {
            return;
          }

          uniqueStatesMap.set(item.city_id, item);
        });

        const uniqueStates = Array.from(uniqueStatesMap.values()).sort((left, right) =>
          left.city_name.localeCompare(right.city_name)
        );

        const defaultCity = uniqueStates.find((item) => {
          const normalizedValues = [
            normalizeCityValue(item.city_name),
            normalizeCityValue(item.city_key),
            normalizeCityValue(item.cleaned_city_name),
          ];

          return DEFAULT_CITY_KEYS.some((key) => normalizedValues.includes(key));
        });

        setStates(
          defaultCity
            ? [
                defaultCity,
                ...uniqueStates.filter((item) => item.city_id !== defaultCity.city_id),
              ]
            : uniqueStates
        );
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch cities.');
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
