import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';
import { NewsArticle } from '../types';

// NewsAPI.org configuration
const NEWS_API_BASE_URL = 'https://newsapi.org/v2/everything';
const NEWS_API_KEY = Constants.expoConfig?.extra?.newsApiKey || 'YOUR_API_KEY_HERE';

/**
 * Response structure from NewsAPI.org
 */
interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: Array<{
    title: string;
    description: string | null;
    urlToImage: string | null;
    url: string;
    publishedAt: string;
  }>;
}

/**
 * Custom error class for news service errors
 */
export class NewsServiceError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'NewsServiceError';
  }
}

/**
 * Maps NewsAPI response article to our NewsArticle interface
 */
function mapToNewsArticle(apiArticle: NewsAPIResponse['articles'][0]): NewsArticle {
  return {
    title: apiArticle.title || 'Untitled',
    description: apiArticle.description || '',
    image: apiArticle.urlToImage || '',
    url: apiArticle.url,
    date: apiArticle.publishedAt,
  };
}

/**
 * Fetches news articles for a specific city from NewsAPI.org
 * Requirements: 2.1, 2.4
 * 
 * @param city - The city name to search for news
 * @returns Promise resolving to array of NewsArticle objects
 * @throws NewsServiceError on API failure
 */
export async function fetchNewsByCity(city: string): Promise<NewsArticle[]> {
  try {
    const response = await axios.get<NewsAPIResponse>(NEWS_API_BASE_URL, {
      params: {
        q: city,
        apiKey: NEWS_API_KEY,
        sortBy: 'publishedAt',
        language: 'en',
      },
    });

    if (response.data.status !== 'ok') {
      throw new NewsServiceError('News API returned an error status');
    }

    return response.data.articles
      .filter((article) => article.title && article.url)
      .map(mapToNewsArticle);
  } catch (error) {
    if (error instanceof NewsServiceError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const statusCode = axiosError.response?.status;
      
      switch (statusCode) {
        case 401:
          throw new NewsServiceError('Invalid API key', 401);
        case 429:
          throw new NewsServiceError('Rate limit exceeded. Please try again later.', 429);
        case 500:
        case 502:
        case 503:
          throw new NewsServiceError('News service is temporarily unavailable', statusCode);
        default:
          throw new NewsServiceError(
            axiosError.response?.data?.message || 'Failed to fetch news',
            statusCode
          );
      }
    }

    throw new NewsServiceError('An unexpected error occurred while fetching news');
  }
}

export const NewsService = {
  fetchNewsByCity,
};
