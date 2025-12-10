/**
 * Property Test: City-Based News Fetch
 * **Feature: city-pulse-app, Property 2: City-Based News Fetch**
 * **Validates: Requirements 1.3, 2.1, 3.3**
 * 
 * Property: For any city selection or change, the news service SHALL be called
 * with that city as the query parameter, and the resulting articles SHALL be
 * displayed in the news feed.
 */

import * as fc from 'fast-check';
import axios from 'axios';
import { fetchNewsByCity } from '../services/newsService';
import { NewsArticle } from '../types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Generator for valid city names
const cityNameArbitrary = fc.stringMatching(/^[a-zA-Z][a-zA-Z\s-]{0,29}$/);

// Generator for valid ISO date strings using integer components
const isoDateArbitrary = fc.tuple(
  fc.integer({ min: 2000, max: 2030 }),
  fc.integer({ min: 1, max: 12 }),
  fc.integer({ min: 1, max: 28 }),
  fc.integer({ min: 0, max: 23 }),
  fc.integer({ min: 0, max: 59 }),
  fc.integer({ min: 0, max: 59 })
).map(([year, month, day, hour, min, sec]) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(min)}:${pad(sec)}.000Z`;
});

// Generator for valid news article data from API
const apiArticleArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.option(fc.string({ maxLength: 200 }), { nil: null }),
  urlToImage: fc.option(fc.webUrl(), { nil: null }),
  url: fc.webUrl(),
  publishedAt: isoDateArbitrary,
});

describe('Property 2: City-Based News Fetch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call news API with the exact city name as query parameter', async () => {
    await fc.assert(
      fc.asyncProperty(
        cityNameArbitrary,
        async (cityName) => {
          // Clear mocks before each iteration
          jest.clearAllMocks();
          
          // Setup mock response
          mockedAxios.get.mockResolvedValueOnce({
            data: {
              status: 'ok',
              totalResults: 0,
              articles: [],
            },
          });

          // Call the service
          await fetchNewsByCity(cityName);

          // Verify the API was called with the correct city parameter
          expect(mockedAxios.get).toHaveBeenCalledTimes(1);
          expect(mockedAxios.get).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
              params: expect.objectContaining({
                q: cityName,
              }),
            })
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return articles mapped correctly from API response for any city', async () => {
    await fc.assert(
      fc.asyncProperty(
        cityNameArbitrary,
        fc.array(apiArticleArbitrary, { minLength: 0, maxLength: 10 }),
        async (cityName, apiArticles) => {
          // Clear mocks before each iteration
          jest.clearAllMocks();
          
          // Setup mock response with generated articles
          mockedAxios.get.mockResolvedValueOnce({
            data: {
              status: 'ok',
              totalResults: apiArticles.length,
              articles: apiArticles,
            },
          });

          // Call the service
          const result = await fetchNewsByCity(cityName);

          // Filter out articles without title or url (as the service does)
          const validApiArticles = apiArticles.filter(a => a.title && a.url);

          // Verify the number of returned articles matches valid API articles
          expect(result.length).toBe(validApiArticles.length);

          // Verify each returned article has the correct structure
          result.forEach((article: NewsArticle) => {
            expect(article).toHaveProperty('title');
            expect(article).toHaveProperty('description');
            expect(article).toHaveProperty('image');
            expect(article).toHaveProperty('url');
            expect(article).toHaveProperty('date');
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should correctly map API article fields to NewsArticle interface', async () => {
    await fc.assert(
      fc.asyncProperty(
        cityNameArbitrary,
        apiArticleArbitrary.filter(a => a.title !== '' && a.url !== ''),
        async (cityName, apiArticle) => {
          // Clear mocks before each iteration
          jest.clearAllMocks();
          
          // Setup mock response with single article
          mockedAxios.get.mockResolvedValueOnce({
            data: {
              status: 'ok',
              totalResults: 1,
              articles: [apiArticle],
            },
          });

          // Call the service
          const result = await fetchNewsByCity(cityName);

          // Verify the mapping is correct
          expect(result.length).toBe(1);
          const mappedArticle = result[0];
          
          expect(mappedArticle.title).toBe(apiArticle.title || 'Untitled');
          expect(mappedArticle.description).toBe(apiArticle.description || '');
          expect(mappedArticle.image).toBe(apiArticle.urlToImage || '');
          expect(mappedArticle.url).toBe(apiArticle.url);
          expect(mappedArticle.date).toBe(apiArticle.publishedAt);
        }
      ),
      { numRuns: 100 }
    );
  });
});
