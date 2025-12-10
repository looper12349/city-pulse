import * as fc from 'fast-check';
import { NewsArticle } from '../types';

/**
 * **Feature: city-pulse-app, Property 11: Article Data Model Validation**
 * **Validates: Requirements 9.1**
 * 
 * Property: For any news article object, the object SHALL contain non-null values
 * for title, description, image, url, and date fields.
 */

// Arbitrary generator for valid NewsArticle objects
// Use integer timestamps to avoid invalid date issues with fc.date()
const newsArticleArbitrary = fc.record({
  title: fc.string({ minLength: 1 }),
  description: fc.string({ minLength: 1 }),
  image: fc.webUrl(),
  url: fc.webUrl(),
  date: fc.integer({ 
    min: new Date('2000-01-01').getTime(), 
    max: new Date('2030-12-31').getTime() 
  }).map(timestamp => new Date(timestamp).toISOString()),
});

// Validation function that checks if an article has all required fields
function isValidNewsArticle(article: unknown): article is NewsArticle {
  if (typeof article !== 'object' || article === null) {
    return false;
  }
  
  const obj = article as Record<string, unknown>;
  
  return (
    typeof obj.title === 'string' &&
    obj.title !== null &&
    typeof obj.description === 'string' &&
    obj.description !== null &&
    typeof obj.image === 'string' &&
    obj.image !== null &&
    typeof obj.url === 'string' &&
    obj.url !== null &&
    typeof obj.date === 'string' &&
    obj.date !== null
  );
}

describe('Property 11: Article Data Model Validation', () => {
  /**
   * **Feature: city-pulse-app, Property 11: Article Data Model Validation**
   * **Validates: Requirements 9.1**
   */
  it('should ensure all generated NewsArticle objects contain non-null values for all required fields', () => {
    fc.assert(
      fc.property(newsArticleArbitrary, (article: NewsArticle) => {
        // Verify all required fields exist and are non-null
        expect(article.title).not.toBeNull();
        expect(article.title).toBeDefined();
        expect(typeof article.title).toBe('string');

        expect(article.description).not.toBeNull();
        expect(article.description).toBeDefined();
        expect(typeof article.description).toBe('string');

        expect(article.image).not.toBeNull();
        expect(article.image).toBeDefined();
        expect(typeof article.image).toBe('string');

        expect(article.url).not.toBeNull();
        expect(article.url).toBeDefined();
        expect(typeof article.url).toBe('string');

        expect(article.date).not.toBeNull();
        expect(article.date).toBeDefined();
        expect(typeof article.date).toBe('string');

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: city-pulse-app, Property 11: Article Data Model Validation**
   * **Validates: Requirements 9.1**
   * 
   * Validates that the isValidNewsArticle function correctly identifies valid articles
   */
  it('should validate that generated articles pass the validation function', () => {
    fc.assert(
      fc.property(newsArticleArbitrary, (article: NewsArticle) => {
        return isValidNewsArticle(article);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: city-pulse-app, Property 11: Article Data Model Validation**
   * **Validates: Requirements 9.1**
   * 
   * Validates that objects with missing or null fields are rejected
   */
  it('should reject objects with missing or null fields', () => {
    // Test with null values
    expect(isValidNewsArticle(null)).toBe(false);
    expect(isValidNewsArticle(undefined)).toBe(false);
    expect(isValidNewsArticle({})).toBe(false);
    
    // Test with partial objects
    expect(isValidNewsArticle({ title: 'Test' })).toBe(false);
    expect(isValidNewsArticle({ title: 'Test', description: 'Desc' })).toBe(false);
    
    // Test with null field values
    expect(isValidNewsArticle({
      title: null,
      description: 'Desc',
      image: 'http://example.com/img.jpg',
      url: 'http://example.com',
      date: '2025-01-01T00:00:00Z'
    })).toBe(false);
  });
});
