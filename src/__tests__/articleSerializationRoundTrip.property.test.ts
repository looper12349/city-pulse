import * as fc from 'fast-check';
import { NewsArticle } from '../types';
import { serializeArticle, deserializeArticle } from '../services/bookmarkService';

/**
 * **Feature: city-pulse-app, Property 12: Article Serialization Round-Trip**
 * **Validates: Requirements 9.2, 9.3**
 * 
 * Property: For any valid NewsArticle object, serializing to JSON and then
 * deserializing SHALL produce an equivalent NewsArticle object.
 */

// Arbitrary generator for valid ISO date strings
const isoDateArbitrary = fc
  .integer({ min: 946684800000, max: 1924905600000 }) // 2000-01-01 to 2030-12-31 in ms
  .map(timestamp => new Date(timestamp).toISOString());

// Arbitrary generator for valid NewsArticle objects
const newsArticleArbitrary = fc.record({
  title: fc.string({ minLength: 1 }),
  description: fc.string({ minLength: 1 }),
  image: fc.webUrl(),
  url: fc.webUrl(),
  date: isoDateArbitrary,
});

describe('Property 12: Article Serialization Round-Trip', () => {
  /**
   * **Feature: city-pulse-app, Property 12: Article Serialization Round-Trip**
   * **Validates: Requirements 9.2, 9.3**
   * 
   * For any valid NewsArticle object, serializing to JSON and then deserializing
   * should produce an equivalent NewsArticle object with all fields preserved.
   */
  it('should produce equivalent article after serialize then deserialize', () => {
    fc.assert(
      fc.property(newsArticleArbitrary, (article: NewsArticle) => {
        // Serialize the article to JSON
        const serialized = serializeArticle(article);
        
        // Deserialize back to NewsArticle
        const deserialized = deserializeArticle(serialized);
        
        // Verify all fields are preserved
        expect(deserialized.title).toBe(article.title);
        expect(deserialized.description).toBe(article.description);
        expect(deserialized.image).toBe(article.image);
        expect(deserialized.url).toBe(article.url);
        expect(deserialized.date).toBe(article.date);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: city-pulse-app, Property 12: Article Serialization Round-Trip**
   * **Validates: Requirements 9.2, 9.3**
   * 
   * For any valid NewsArticle, the serialized output should be valid JSON.
   */
  it('should produce valid JSON when serializing', () => {
    fc.assert(
      fc.property(newsArticleArbitrary, (article: NewsArticle) => {
        const serialized = serializeArticle(article);
        
        // Should not throw when parsing
        expect(() => JSON.parse(serialized)).not.toThrow();
        
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
