import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CITY_STORAGE_KEY = '@city_pulse/selected_city';

/**
 * City context type definition
 * Requirements: 1.2, 1.3
 */
interface CityContextType {
  selectedCity: string | null;
  setSelectedCity: (city: string) => void;
  isLoading: boolean;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

interface CityProviderProps {
  children: ReactNode;
}

/**
 * CityProvider component that manages city selection state
 * - Provides selectedCity state and setSelectedCity function
 * - Persists selected city to AsyncStorage
 * - Loads saved city on app start
 * Requirements: 1.2, 1.3
 */
export function CityProvider({ children }: CityProviderProps) {
  const [selectedCity, setSelectedCityState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved city on mount
  useEffect(() => {
    loadSavedCity();
  }, []);

  const loadSavedCity = async () => {
    try {
      const savedCity = await AsyncStorage.getItem(CITY_STORAGE_KEY);
      if (savedCity) {
        setSelectedCityState(savedCity);
      }
    } catch (error) {
      console.error('Failed to load saved city:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setSelectedCity = async (city: string) => {
    try {
      await AsyncStorage.setItem(CITY_STORAGE_KEY, city);
      setSelectedCityState(city);
    } catch (error) {
      console.error('Failed to save city:', error);
    }
  };

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity, isLoading }}>
      {children}
    </CityContext.Provider>
  );
}

/**
 * Hook to access city context
 * @throws Error if used outside CityProvider
 */
export function useCityContext(): CityContextType {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCityContext must be used within a CityProvider');
  }
  return context;
}

export { CityContext, CITY_STORAGE_KEY };
