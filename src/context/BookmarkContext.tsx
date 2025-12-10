import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { NewsArticle } from '../types';
import {
  getBookmarks as getBookmarksFromStorage,
  addBookmark as addBookmarkToStorage,
  removeBookmark as removeBookmarkFromStorage,
} from '../services/bookmarkService';

/**
 * Bookmark context type definition
 * Requirements: 5.3, 6.3
 */
interface BookmarkContextType {
  bookmarks: NewsArticle[];
  isLoading: boolean;
  addBookmark: (article: NewsArticle) => Promise<void>;
  removeBookmark: (articleUrl: string) => Promise<void>;
  isBookmarked: (articleUrl: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

interface BookmarkProviderProps {
  children: ReactNode;
}

/**
 * BookmarkProvider component that manages bookmark state
 * - Provides bookmarks state and bookmark management functions
 * - Loads bookmarks from AsyncStorage on initialization
 * - Exposes addBookmark, removeBookmark, isBookmarked functions
 * Requirements: 5.3, 6.3
 */
export function BookmarkProvider({ children }: BookmarkProviderProps) {
  const [bookmarks, setBookmarks] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookmarks on mount
  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const savedBookmarks = await getBookmarksFromStorage();
      setBookmarks(savedBookmarks);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addBookmark = useCallback(async (article: NewsArticle) => {
    try {
      await addBookmarkToStorage(article);
      setBookmarks((prev) => {
        // Avoid duplicates
        if (prev.some((b) => b.url === article.url)) {
          return prev;
        }
        return [...prev, article];
      });
    } catch (error) {
      console.error('Failed to add bookmark:', error);
      throw error;
    }
  }, []);

  const removeBookmark = useCallback(async (articleUrl: string) => {
    try {
      await removeBookmarkFromStorage(articleUrl);
      setBookmarks((prev) => prev.filter((b) => b.url !== articleUrl));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      throw error;
    }
  }, []);

  const isBookmarked = useCallback((articleUrl: string): boolean => {
    return bookmarks.some((b) => b.url === articleUrl);
  }, [bookmarks]);

  return (
    <BookmarkContext.Provider
      value={{ bookmarks, isLoading, addBookmark, removeBookmark, isBookmarked }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

/**
 * Hook to access bookmark context
 * @throws Error if used outside BookmarkProvider
 */
export function useBookmarkContext(): BookmarkContextType {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarkContext must be used within a BookmarkProvider');
  }
  return context;
}

export { BookmarkContext };
