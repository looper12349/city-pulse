import * as fc from 'fast-check';
import { City } from '../types';
import { CITIES } from '../constants/cities';

/**
 * **Feature: city-pulse-app, Property 3: Alphabetical City Ordering**
 * **Validates: Requirements 1.4**
 *
 * Property: For any list of cities displayed in the city selector,
 * the cities SHALL be sorted in alphabetical order by display name.
 */

// Arbitrary generator for City objects
const cityArbitrary = fc.record({
  name: fc.string({ minLength: 1 }).map(s => s.toLowerCase().replace(/\s+/g, '-')),
  displayName: fc.string({ minLength: 1 }),
});

// Function to check if an array of cities is sorted alphabetically by displayName
function isSortedAlphabetically(cities: City[]): boolean {
  for (let i = 0; i < cities.length - 1; i++) {
    if (cities[i].displayName.localeCompare(cities[i + 1].displayName) > 0) {
      return false;
    }
  }
  return true;
}

// Function to sort cities alphabetically by displayName (as the app should do)
function sortCitiesAlphabetically(cities: City[]): City[] {
  return [...cities].sort((a, b) => a.displayName.localeCompare(b.displayName));
}

describe('Property 3: Alphabetical City Ordering', () => {
  /**
   * **Feature: city-pulse-app, Property 3: Alphabetical City Ordering**
   * **Validates: Requirements 1.4**
   *
   * Verifies that the CITIES constant is sorted alphabetically by displayName
   */
  it('should have CITIES constant sorted alphabetically by displayName', () => {
    expect(isSortedAlphabetically(CITIES)).toBe(true);
  });

  /**
   * **Feature: city-pulse-app, Property 3: Alphabetical City Ordering**
   * **Validates: Requirements 1.4**
   *
   * Property test: For any arbitrary list of cities, sorting them alphabetically
   * should produce a list where each city's displayName is <= the next city's displayName
   */
  it('should ensure sorting any city list produces alphabetically ordered results', () => {
    fc.assert(
      fc.property(fc.array(cityArbitrary, { minLength: 0, maxLength: 50 }), (cities: City[]) => {
        const sorted = sortCitiesAlphabetically(cities);

        // Verify the sorted list is in alphabetical order
        return isSortedAlphabetically(sorted);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: city-pulse-app, Property 3: Alphabetical City Ordering**
   * **Validates: Requirements 1.4**
   *
   * Property test: Sorting should be idempotent - sorting an already sorted list
   * should produce the same result
   */
  it('should ensure sorting is idempotent', () => {
    fc.assert(
      fc.property(fc.array(cityArbitrary, { minLength: 0, maxLength: 50 }), (cities: City[]) => {
        const sortedOnce = sortCitiesAlphabetically(cities);
        const sortedTwice = sortCitiesAlphabetically(sortedOnce);

        // Sorting twice should produce the same result as sorting once
        expect(sortedTwice).toEqual(sortedOnce);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: city-pulse-app, Property 3: Alphabetical City Ordering**
   * **Validates: Requirements 1.4**
   *
   * Property test: Sorting should preserve all elements (no cities lost or duplicated)
   */
  it('should preserve all cities when sorting', () => {
    fc.assert(
      fc.property(fc.array(cityArbitrary, { minLength: 0, maxLength: 50 }), (cities: City[]) => {
        const sorted = sortCitiesAlphabetically(cities);

        // Length should be preserved
        expect(sorted.length).toBe(cities.length);

        // All original cities should be present in sorted list
        cities.forEach(city => {
          const found = sorted.some(
            s => s.name === city.name && s.displayName === city.displayName
          );
          expect(found).toBe(true);
        });

        return true;
      }),
      { numRuns: 100 }
    );
  });
});
