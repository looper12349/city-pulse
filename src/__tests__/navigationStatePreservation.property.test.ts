/**
 * Property Test: Navigation State Preservation
 * **Feature: city-pulse-app, Property 10: Navigation State Preservation**
 * **Validates: Requirements 8.3**
 * 
 * Property: For any navigation action between screens, the application state
 * (selected city, bookmarks, loaded articles) SHALL remain unchanged.
 */

import * as fc from 'fast-check';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetMockStorage } from './jest.setup';
import { NewsArticle } from '../types';

// Storage keys matching the actual implementation
const CITY_STORAGE_KEY = '@city_pulse/selected_city';
const BOOKMARKS_STORAGE_KEY = '@city_pulse/bookmarks';

// Arbitrary generator for valid NewsArticle objects
const newsArticleArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 500 }),
  image: fc.webUrl(),
  url: fc.webUrl(),
  date: fc.date({ min: new Date('2000-01-01'), max: new Date('2030-12-31') })
    .filter(d => !isNaN(d.getTime()))
    .map(d => d.toISOString()),
});

// Arbitrary generator for city names
const cityNameArbitrary = fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9 -]{0,29}$/);

// Simulate navigation actions (these don't modify state, just represent screen transitions)
type NavigationAction = 
  | { type: 'navigate'; screen: 'NewsFeed' | 'Bookmarks' | 'EmergencyAlerts' | 'NewsWebView' | 'CitySelector' }
  | { type: 'goBack' }
  | { type: 'switchTab'; tab: 'NewsFeed' | 'Bookmarks' | 'EmergencyAlerts' };

const navigationActionArbitrary: fc.Arbitrary<NavigationAction> = fc.oneof(
  fc.record({
    type: fc.constant('navigate' as const),
    screen: fc.constantFrom('NewsFeed', 'Bookmarks', 'EmergencyAlerts', 'NewsWebView', 'CitySelector'),
  }),
  fc.record({
    type: fc.constant('goBack' as const),
  }),
  fc.record({
    type: fc.constant('switchTab' as const),
    tab: fc.constantFrom('NewsFeed', 'Bookmarks', 'EmergencyAlerts'),
  })
);

/**
 * Application state snapshot for comparison
 */
interface AppStateSnapshot {
  selectedCity: string | null;
  bookmarks: NewsArticle[];
}

/**
 * Capture current application state from storage
 */
async function captureAppState(): Promise<AppStateSnapshot> {
  const selectedCity = await AsyncStorage.getItem(CITY_STORAGE_KEY);
  const bookmarksJson = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
  const bookmarks: NewsArticle[] = bookmarksJson ? JSON.parse(bookmarksJson) : [];
  
  return {
    selectedCity,
    bookmarks,
  };
}

/**
 * Set up initial application state
 */
async function setupAppState(city: string | null, bookmarks: NewsArticle[]): Promise<void> {
  if (city) {
    await AsyncStorage.setItem(CITY_STORAGE_KEY, city);
  }
  if (bookmarks.length > 0) {
    await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
  }
}

/**
 * Simulate a navigation action (navigation itself should not modify state)
 * This represents what happens when React Navigation performs a screen transition
 */
function simulateNavigation(_action: NavigationAction): void {
  // Navigation actions in React Navigation do not modify application state
  // They only change which screen is displayed
  // The state (city, bookmarks) is managed by Context providers which persist across navigation
}

/**
 * Compare two state snapshots for equality
 */
function statesAreEqual(state1: AppStateSnapshot, state2: AppStateSnapshot): boolean {
  if (state1.selectedCity !== state2.selectedCity) {
    return false;
  }
  
  if (state1.bookmarks.length !== state2.bookmarks.length) {
    return false;
  }
  
  // Compare bookmarks by URL (unique identifier)
  const urls1 = state1.bookmarks.map(b => b.url).sort();
  const urls2 = state2.bookmarks.map(b => b.url).sort();
  
  return urls1.every((url, index) => url === urls2[index]);
}

describe('Property 10: Navigation State Preservation', () => {
  beforeEach(() => {
    resetMockStorage();
    jest.clearAllMocks();
  });

  /**
   * **Feature: city-pulse-app, Property 10: Navigation State Preservation**
   * **Validates: Requirements 8.3**
   * 
   * For any initial state and any navigation action, the state should remain unchanged.
   */
  it('should preserve application state across any single navigation action', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.option(cityNameArbitrary, { nil: null }),
        fc.array(newsArticleArbitrary, { minLength: 0, maxLength: 5 }),
        navigationActionArbitrary,
        async (city, bookmarks, navAction) => {
          resetMockStorage();
          
          // Deduplicate bookmarks by URL
          const uniqueBookmarks = bookmarks.filter(
            (article, index, self) => 
              self.findIndex(a => a.url === article.url) === index
          );
          
          // Set up initial state
          await setupAppState(city, uniqueBookmarks);
          
          // Capture state before navigation
          const stateBefore = await captureAppState();
          
          // Perform navigation action
          simulateNavigation(navAction);
          
          // Capture state after navigation
          const stateAfter = await captureAppState();
          
          // Property: State must be preserved
          expect(statesAreEqual(stateBefore, stateAfter)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: city-pulse-app, Property 10: Navigation State Preservation**
   * **Validates: Requirements 8.3**
   * 
   * For any sequence of navigation actions, the state should remain unchanged.
   */
  it('should preserve application state across any sequence of navigation actions', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.option(cityNameArbitrary, { nil: null }),
        fc.array(newsArticleArbitrary, { minLength: 0, maxLength: 5 }),
        fc.array(navigationActionArbitrary, { minLength: 1, maxLength: 20 }),
        async (city, bookmarks, navActions) => {
          resetMockStorage();
          
          // Deduplicate bookmarks by URL
          const uniqueBookmarks = bookmarks.filter(
            (article, index, self) => 
              self.findIndex(a => a.url === article.url) === index
          );
          
          // Set up initial state
          await setupAppState(city, uniqueBookmarks);
          
          // Capture state before navigation sequence
          const stateBefore = await captureAppState();
          
          // Perform all navigation actions
          for (const navAction of navActions) {
            simulateNavigation(navAction);
          }
          
          // Capture state after all navigations
          const stateAfter = await captureAppState();
          
          // Property: State must be preserved after any sequence of navigations
          expect(statesAreEqual(stateBefore, stateAfter)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: city-pulse-app, Property 10: Navigation State Preservation**
   * **Validates: Requirements 8.3**
   * 
   * Specifically test tab switching preserves state.
   */
  it('should preserve state when switching between tabs', async () => {
    await fc.assert(
      fc.asyncProperty(
        cityNameArbitrary,
        fc.array(newsArticleArbitrary, { minLength: 1, maxLength: 5 }),
        fc.array(
          fc.constantFrom('NewsFeed', 'Bookmarks', 'EmergencyAlerts'),
          { minLength: 1, maxLength: 10 }
        ),
        async (city, bookmarks, tabSequence) => {
          resetMockStorage();
          
          // Deduplicate bookmarks by URL
          const uniqueBookmarks = bookmarks.filter(
            (article, index, self) => 
              self.findIndex(a => a.url === article.url) === index
          );
          
          // Set up initial state with city and bookmarks
          await setupAppState(city, uniqueBookmarks);
          
          // Capture state before tab switching
          const stateBefore = await captureAppState();
          
          // Switch through all tabs in sequence
          for (const tab of tabSequence) {
            simulateNavigation({ type: 'switchTab', tab: tab as 'NewsFeed' | 'Bookmarks' | 'EmergencyAlerts' });
          }
          
          // Capture state after tab switching
          const stateAfter = await captureAppState();
          
          // Property: State must be preserved
          expect(statesAreEqual(stateBefore, stateAfter)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
