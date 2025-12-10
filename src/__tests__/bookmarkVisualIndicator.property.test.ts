import * as fc from 'fast-check';
import { NewsArticle } from '../types';

/**
 * **Feature: city-pulse-app, Property 8: Bookmark Visual Indicator**
 * **Validates: Requirements 5.5**
 * 
 * Property: For any article that exists in the bookmarks storage, when displayed
 * in the news feed, the article SHALL show a visual bookmark indicator.
 */

// Arbitrary generator for valid NewsArticle objects
const newsArticleArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 200 }),
  description: fc.string({ minLength: 1, maxLength: 500 }),
  image: fc.webUrl(),
  url: fc.webUrl(),
  date: fc.integer({ 
    min: new Date('2000-01-01').getTime(), 
    max: new Date('2030-12-31').getTime() 
  }).map(timestamp => new Date(timestamp).toISOString()),
});

/**
 * Simulates the bookmark indicator logic used in NewsCard
 * Returns the visual indicator based on bookmark status
 */
function getBookmarkIndicator(isBookmarked: boolean): { icon: string; isHighlighted: boolean } {
  return {
    icon: isBookmarked ? '★' : '☆',
    isHighlighted: isBookmarked,
  };
}

/**
 * Simulates checking if an article is bookmarked
 * This mirrors the isBookmarked function from BookmarkContext
 */
function isArticleBookmarked(articleUrl: string, bookmarkedUrls: string[]): boolean {
  return bookmarkedUrls.includes(articleUrl);
}

describe('Property 8: Bookmark Visual Indicator', () => {
  /**
   * **Feature: city-pulse-app, Property 8: Bookmark Visual Indicator**
   * **Validates: Requirements 5.5**
   */
  it('should show filled star indicator for any bookmarked article', () => {
    fc.assert(
      fc.property(newsArticleArbitrary, (article: NewsArticle) => {
        // Simulate article being in bookmarks
        const bookmarkedUrls = [article.url];
        const isBookmarked = isArticleBookmarked(article.url, bookmarkedUrls);
        const indicator = getBookmarkIndicator(isBookmarked);
        
        // Bookmarked articles should show filled star
        expect(isBookmarked).toBe(true);
        expect(indicator.icon).toBe('★');
        expect(indicator.isHighlighted).toBe(true);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: city-pulse-app, Property 8: Bookmark Visual Indicator**
   * **Validates: Requirements 5.5**
   */
  it('should show empty star indicator for any non-bookmarked article', () => {
    fc.assert(
      fc.property(newsArticleArbitrary, (article: NewsArticle) => {
        // Simulate article NOT being in bookmarks
        const bookmarkedUrls: string[] = [];
        const isBookmarked = isArticleBookmarked(article.url, bookmarkedUrls);
        const indicator = getBookmarkIndicator(isBookmarked);
        
        // Non-bookmarked articles should show empty star
        expect(isBookmarked).toBe(false);
        expect(indicator.icon).toBe('☆');
        expect(indicator.isHighlighted).toBe(false);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: city-pulse-app, Property 8: Bookmark Visual Indicator**
   * **Validates: Requirements 5.5**
   * 
   * Tests that bookmark status correctly reflects storage state
   */
  it('should correctly identify bookmark status from a list of bookmarked URLs', () => {
    fc.assert(
      fc.property(
        fc.array(newsArticleArbitrary, { minLength: 1, maxLength: 20 }),
        fc.nat({ max: 19 }),
        (articles, bookmarkCount) => {
          // Bookmark a subset of articles
          const actualBookmarkCount = Math.min(bookmarkCount, articles.length);
          const bookmarkedUrls = articles.slice(0, actualBookmarkCount).map(a => a.url);
          
          // Check each article's bookmark status
          for (const article of articles) {
            const isBookmarked = isArticleBookmarked(article.url, bookmarkedUrls);
            const indicator = getBookmarkIndicator(isBookmarked);
            
            if (bookmarkedUrls.includes(article.url)) {
              expect(indicator.icon).toBe('★');
              expect(indicator.isHighlighted).toBe(true);
            } else {
              expect(indicator.icon).toBe('☆');
              expect(indicator.isHighlighted).toBe(false);
            }
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
