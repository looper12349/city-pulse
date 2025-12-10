import * as fc from 'fast-check';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsArticle } from '../types';
import { addBookmark, getBookmarks, isBookmarked, removeBookmark } from '../services/bookmarkService';

/**
 * **Feature: city-pulse-app, Property 6: Bookmark Removal Persistence**
 * **Validates: Requirements 5.2, 6.2**
 * 
 * Property: For any bookmarked article, when the unbookmark action is performed,
 * the article SHALL be removed from AsyncStorage and no longer retrievable.
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

describe('Property 6: Bookmark Removal Persistence', () => {
  beforeEach(async () => {
    // Clear AsyncStorage before each test
    await AsyncStorage.clear();
  });

  /**
   * **Feature: city-pulse-app, Property 6: Bookmark Removal Persistence**
   * **Validates: Requirements 5.2, 6.2**
   * 
   * For any bookmarked article, removing it should make it no longer retrievable.
   */
  it('should remove any bookmarked article and make it no longer retrievable', async () => {
    await fc.assert(
      fc.asyncProperty(newsArticleArbitrary, async (article: NewsArticle) => {
        // Clear storage before each property check
        await AsyncStorage.clear();
        
        // First add the article as a bookmark
        await addBookmark(article);
        
        // Verify the article is bookmarked
        const bookmarkedBefore = await isBookmarked(article.url);
        expect(bookmarkedBefore).toBe(true);
        
        // Remove the bookmark
        await removeBookmark(article.url);
        
        // Verify the article is no longer bookmarked
        const bookmarkedAfter = await isBookmarked(article.url);
        expect(bookmarkedAfter).toBe(false);
        
        // Verify the article is not in the bookmarks list
        const bookmarks = await getBookmarks();
        const found = bookmarks.find(b => b.url === article.url);
        expect(found).toBeUndefined();
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: city-pulse-app, Property 6: Bookmark Removal Persistence**
   * **Validates: Requirements 5.2, 6.2**
   * 
   * For any set of bookmarked articles, removing one should only remove that specific article.
   */
  it('should only remove the specified article while preserving others', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(newsArticleArbitrary, { minLength: 2, maxLength: 10 }),
        async (articles: NewsArticle[]) => {
          // Clear storage before each property check
          await AsyncStorage.clear();
          
          // Deduplicate articles by URL to avoid duplicate bookmark issues
          const uniqueArticles = articles.filter(
            (article, index, self) => 
              self.findIndex(a => a.url === article.url) === index
          );
          
          // Need at least 2 unique articles for this test
          if (uniqueArticles.length < 2) {
            return true; // Skip this case
          }
          
          // Add all articles as bookmarks
          for (const article of uniqueArticles) {
            await addBookmark(article);
          }
          
          // Pick the first article to remove
          const articleToRemove = uniqueArticles[0];
          const remainingArticles = uniqueArticles.slice(1);
          
          // Remove the first article
          await removeBookmark(articleToRemove.url);
          
          // Verify the removed article is no longer bookmarked
          const removedIsBookmarked = await isBookmarked(articleToRemove.url);
          expect(removedIsBookmarked).toBe(false);
          
          // Verify all other articles are still bookmarked
          const bookmarks = await getBookmarks();
          expect(bookmarks.length).toBe(remainingArticles.length);
          
          for (const article of remainingArticles) {
            const stillBookmarked = await isBookmarked(article.url);
            expect(stillBookmarked).toBe(true);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
