import * as fc from 'fast-check';
import { NewsArticle } from '../types';
import { extractNewsCardContent } from '../components/NewsCard';

/**
 * **Feature: city-pulse-app, Property 4: News Article Rendering Completeness**
 * **Validates: Requirements 2.3**
 * 
 * Property: For any news article displayed in the news feed, the rendered output
 * SHALL contain the article's title, description, image, and publication date.
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

describe('Property 4: News Article Rendering Completeness', () => {
  /**
   * **Feature: city-pulse-app, Property 4: News Article Rendering Completeness**
   * **Validates: Requirements 2.3**
   */
  it('should extract all required fields from any news article for rendering', () => {
    fc.assert(
      fc.property(newsArticleArbitrary, (article: NewsArticle) => {
        const content = extractNewsCardContent(article);
        
        // Verify title is present and matches
        expect(content.title).toBe(article.title);
        expect(content.title.length).toBeGreaterThan(0);
        
        // Verify description is present and matches
        expect(content.description).toBe(article.description);
        expect(content.description.length).toBeGreaterThan(0);
        
        // Verify image URL is present and matches
        expect(content.image).toBe(article.image);
        expect(content.image.length).toBeGreaterThan(0);
        
        // Verify date is present (formatted)
        expect(content.date).toBeDefined();
        expect(content.date.length).toBeGreaterThan(0);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: city-pulse-app, Property 4: News Article Rendering Completeness**
   * **Validates: Requirements 2.3**
   * 
   * Verifies that the extracted content contains all four required display fields
   */
  it('should always include title, description, image, and date in extracted content', () => {
    fc.assert(
      fc.property(newsArticleArbitrary, (article: NewsArticle) => {
        const content = extractNewsCardContent(article);
        
        // Check that all required keys exist
        const requiredKeys = ['title', 'description', 'image', 'date'];
        for (const key of requiredKeys) {
          expect(content).toHaveProperty(key);
          expect((content as Record<string, string>)[key]).not.toBeNull();
          expect((content as Record<string, string>)[key]).not.toBeUndefined();
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
