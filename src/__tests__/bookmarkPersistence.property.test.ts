import * as fc from 'fast-check';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsArticle } from '../types';
import { addBookmark, getBookmarks, isBookmarked } from '../services/bookmarkService';

/**
 * **Feature: city-pulse-app, Property 5: Bookmark Addition Persistence**
 * **Validates: Requirements 5.1, 6.1**
 * 
 * Property: For any news article, when the bookmark action is performed,
 * the article SHALL be persisted to AsyncStorage and retrievable immediately after.
 */

// Arbitrary generator for valid NewsArticle objects
const newsArticleArbitrary = fc.record({
  title: fc.string({ minLength: 1 }),
  description: fc.string({ minLength: 1 }),
  image: fc.webUrl(),
  url: fc.webUrl(),
  date: fc.date({ min: new Date('2000-01-01'), max: new Date('2030-12-31') })
    .filter(d => !isNaN(d.getTime()))
    .map(d => d.toISOString()),
});

describe('Property 5: Bookmark Addition Persistence', () => {
  beforeEach(async () => {
    // Clear AsyncStorage before each test
    await AsyncStorage.clear();
  });

  /**
   * **Feature: city-pulse-app, Property 5: Bookmark Addition Persistence**
   * **Validates: Requirements 5.1, 6.1**
   * 
   * For any news article, adding it as a bookmark should persist it to storage
   * and make it immediately retrievable.
   */
  it('should persist any bookmarked article and make it retrievable immediately', async () => {
    await fc.assert(
      fc.asyncProperty(newsArticleArbitrary, async (article: NewsArticle) => {
        // Clear storage before each property check
        await AsyncStorage.clear();
        
        // Add the article as a bookmark
        await addBookmark(article);
        
        // Verify the article is now bookmarked
        const bookmarked = await isBookmarked(article.url);
        expect(bookmarked).toBe(true);
        
        // Verify the article can be retrieved from bookmarks
        const bookmarks = await getBookmarks();
        const found = bookmarks.find(b => b.url === article.url);
        
        expect(found).toBeDefined();
        expect(found?.title).toBe(article.title);
        expect(found?.description).toBe(article.description);
        expect(found?.image).toBe(article.image);
        expect(found?.url).toBe(article.url);
        expect(found?.date).toBe(article.date);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: city-pulse-app, Property 5: Bookmark Addition Persistence**
   * **Validates: Requirements 5.1, 6.1**
   * 
   * For any sequence of articles, adding them as bookmarks should persist all of them.
   */
  it('should persist multiple bookmarked articles', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(newsArticleArbitrary, { minLength: 1, maxLength: 10 }),
        async (articles: NewsArticle[]) => {
          // Clear storage before each property check
          await AsyncStorage.clear();
          
          // Deduplicate articles by URL to avoid duplicate bookmark issues
          const uniqueArticles = articles.filter(
            (article, index, self) => 
              self.findIndex(a => a.url === article.url) === index
          );
          
          // Add all articles as bookmarks
          for (const article of uniqueArticles) {
            await addBookmark(article);
          }
          
          // Verify all articles are retrievable
          const bookmarks = await getBookmarks();
          
          expect(bookmarks.length).toBe(uniqueArticles.length);
          
          for (const article of uniqueArticles) {
            const found = bookmarks.find(b => b.url === article.url);
            expect(found).toBeDefined();
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
