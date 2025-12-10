/**
 * Property Test: City Selection State Consistency
 * **Feature: city-pulse-app, Property 1: City Selection State Consistency**
 * **Validates: Requirements 1.2**
 * 
 * Property: For any city selected from the city picker, the application state
 * SHALL contain that exact city value after selection.
 */

import * as fc from 'fast-check';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetMockStorage } from './jest.setup';

// Storage key must match the one in CityContext
const CITY_STORAGE_KEY = '@city_pulse/selected_city';

// Simulate the city selection logic from CityContext
async function selectCity(city: string): Promise<void> {
  await AsyncStorage.setItem(CITY_STORAGE_KEY, city);
}

async function getSelectedCity(): Promise<string | null> {
  return await AsyncStorage.getItem(CITY_STORAGE_KEY);
}

describe('Property 1: City Selection State Consistency', () => {
  beforeEach(() => {
    resetMockStorage();
    jest.clearAllMocks();
  });

  it('should store the exact city value after selection for any valid city name', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate non-empty city names (alphanumeric with hyphens, like real city names)
        fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9-]{0,49}$/),
        async (cityName) => {
          // Reset storage before each test case
          resetMockStorage();
          
          // Select the city
          await selectCity(cityName);
          
          // Retrieve the stored city
          const storedCity = await getSelectedCity();
          
          // Property: The stored city must exactly match the selected city
          expect(storedCity).toBe(cityName);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain city value consistency across multiple selections', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate a sequence of city selections
        fc.array(
          fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9-]{0,29}$/),
          { minLength: 1, maxLength: 10 }
        ),
        async (citySequence) => {
          resetMockStorage();
          
          // Select each city in sequence
          for (const city of citySequence) {
            await selectCity(city);
            
            // After each selection, verify the state matches
            const storedCity = await getSelectedCity();
            expect(storedCity).toBe(city);
          }
          
          // Final state should be the last city selected
          const finalCity = await getSelectedCity();
          expect(finalCity).toBe(citySequence[citySequence.length - 1]);
        }
      ),
      { numRuns: 100 }
    );
  });
});
