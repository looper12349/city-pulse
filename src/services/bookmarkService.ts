import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsArticle } from '../types';

const BOOKMARKS_STORAGE_KEY = '@city_pulse/bookmarks';


export class BookmarkServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BookmarkServiceError';
  }
}

/**
 * Serializes a NewsArticle to JSON string
 * Requirements: 9.2
 */
export function serializeArticle(article: NewsArticle): string {
  return JSON.stringify(article);
}

/**
 * Deserializes a JSON string to NewsArticle
 * Requirements: 9.3
 */
export function deserializeArticle(json: string): NewsArticle {
  return JSON.parse(json) as NewsArticle;
}

/**
 * Retrieves all bookmarked articles from AsyncStorage
 * Requirements: 5.3, 6.3
 * 
 * @returns Promise resolving to array of bookmarked NewsArticle objects
 */
export async function getBookmarks(): Promise<NewsArticle[]> {
  try {
    const stored = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to retrieve bookmarks:', error);
    return [];
  }
}

/**
 * Adds an article to bookmarks in AsyncStorage
 * Requirements: 5.1, 6.1
 * 
 * @param article - The NewsArticle to bookmark
 */
export async function addBookmark(article: NewsArticle): Promise<void> {
  try {
    const bookmarks = await getBookmarks();
    
    // Check if already bookmarked to avoid duplicates
    const exists = bookmarks.some((b) => b.url === article.url);
    if (exists) {
      return;
    }
    
    const updated = [...bookmarks, article];
    await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to add bookmark:', error);
    throw new BookmarkServiceError('Failed to save bookmark');
  }
}

/**
 * Removes an article from bookmarks in AsyncStorage
 * Requirements: 5.2, 6.2
 * 
 * @param articleUrl - The URL of the article to remove
 */
export async function removeBookmark(articleUrl: string): Promise<void> {
  try {
    const bookmarks = await getBookmarks();
    const updated = bookmarks.filter((b) => b.url !== articleUrl);
    await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to remove bookmark:', error);
    throw new BookmarkServiceError('Failed to remove bookmark');
  }
}

/**
 * Checks if an article is bookmarked
 * Requirements: 5.5
 * 
 * @param articleUrl - The URL of the article to check
 * @returns Promise resolving to boolean indicating bookmark status
 */
export async function isBookmarked(articleUrl: string): Promise<boolean> {
  const bookmarks = await getBookmarks();
  return bookmarks.some((b) => b.url === articleUrl);
}

export const BookmarkService = {
  getBookmarks,
  addBookmark,
  removeBookmark,
  isBookmarked,
  serializeArticle,
  deserializeArticle,
};
