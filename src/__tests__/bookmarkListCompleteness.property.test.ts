/**
 * Property Test: Bookmark List Completeness
 * **Feature: city-pulse-app, Property 7: Bookmark List Completeness**
 * **Validates: Requirements 5.4**
 * 
 * Property: For any set of bookmarked articles in storage, the Bookmarks screen
 * SHALL display all of them without omission.
 */

import * as fc from 'fast-check';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsArticle } from '../types';
import { addBookmark, getBookmarks } from '../services/bookmarkService';

// Arbitrary generator for valid NewsArticle objects with unique URLs
const newsArticleArbitrary = (index: number) => fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 200 }),
  image: fc.constant(`https://example.com/image${index}.jpg`),
  url: fc.constant(`https://example.com/article${index}`),
  date: fc.tuple(
    fc.integer({ min: 2000, max: 2030 }),
    fc.integer({ min: 1, max: 12 }),
    fc.integer({ min: 1, max: 28 })
  ).map(([year, month, day]) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${year}-${pad(month)}-${pad(day)}T00:00:00.000Z`;
  }),
});

// Generate array of unique articles
const uniqueArticlesArbitrary = fc.integer({ min: 1, max: 10 }).chain(count => 
  fc.tuple(...Array.from({ length: count }, (_, i) => newsArticleArbitrary(i)))
);

describe('Property 7: Bookmark List Completeness', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  /**
   * **Feature: city-pulse-app, Property 7: Bookmark List Completeness**
   * **Validates: Requirements 5.4**
   * 
   * For any set of bookmarked articles, getBookmarks should return all of them.
   */
  it('should return all bookmarked articles without omission', async () => {
    await fc.assert(
      fc.asyncProperty(uniqueArticlesArbitrary, async (articles: NewsArticle[]) => {
        // Clear storage before each property check
        await AsyncStorage.clear();
        
        // Add all articles as bookmarks
        for (const article of articles) {
          await addBookmark(article);
        }
        
        // Retrieve all bookmarks
        const bookmarks = await getBookmarks();
        
        // Property: The number of retrieved bookmarks must equal the number added
        expect(bookmarks.length).toBe(articles.length);
        
        // Property: Every added article must be present in the retrieved bookmarks
        for (const article of articles) {
          const found = bookmarks.find(b => b.url === article.url);
          expect(found).toBeDefined();
          expect(found?.title).toBe(article.title);
          expect(found?.description).toBe(article.description);
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: city-pulse-app, Property 7: Bookmark List Completeness**
   * **Validates: Requirements 5.4**
   * 
   * For any sequence of bookmark additions, the final list should contain
   * exactly those articles that were added.
   */
  it('should maintain completeness after multiple bookmark operations', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 5 }).chain(count =>
          fc.tuple(...Array.from({ length: count }, (_, i) => newsArticleArbitrary(i)))
        ),
        async (articles: NewsArticle[]) => {
          // Clear storage before each property check
          await AsyncStorage.clear();
          
          const addedUrls = new Set<string>();
          
          // Add articles one by one and verify completeness after each addition
          for (const article of articles) {
            await addBookmark(article);
            addedUrls.add(article.url);
            
            // Verify all added articles are present
            const currentBookmarks = await getBookmarks();
            expect(currentBookmarks.length).toBe(addedUrls.size);
            
            for (const url of addedUrls) {
              const found = currentBookmarks.find(b => b.url === url);
              expect(found).toBeDefined();
            }
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
