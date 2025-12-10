import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { NewsArticle } from '../types';
import { NewsCard } from '../components/NewsCard';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { useCityContext } from '../context/CityContext';
import { useBookmarkContext } from '../context/BookmarkContext';
import { fetchNewsByCity, NewsServiceError } from '../services/newsService';

/**
 * NewsFeed screen
 * Fetches and displays news articles for the selected city
 * Implements pull-to-refresh functionality
 * Requirements: 2.1, 2.2, 2.4, 2.5, 3.1, 3.2, 3.3
 */

interface NewsFeedProps {
  navigation: {
    navigate: (screen: string, params?: object) => void;
  };
}

export function NewsFeed({ navigation }: NewsFeedProps) {
  const { selectedCity } = useCityContext();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkContext();
  
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNews = useCallback(async (showRefreshIndicator = false) => {
    if (!selectedCity) {
      setIsLoading(false);
      return;
    }

    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const newsArticles = await fetchNewsByCity(selectedCity);
      setArticles(newsArticles);
    } catch (err) {
      if (err instanceof NewsServiceError) {
        setError(err.message);
      } else {
        setError('Failed to load news. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedCity]);


  // Fetch news when city changes
  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const handleRefresh = useCallback(() => {
    loadNews(true);
  }, [loadNews]);

  const handleArticlePress = (article: NewsArticle) => {
    navigation.navigate('NewsWebView', { url: article.url, title: article.title });
  };

  const handleBookmarkPress = async (article: NewsArticle) => {
    if (isBookmarked(article.url)) {
      await removeBookmark(article.url);
    } else {
      await addBookmark(article);
    }
  };

  const renderArticle = ({ item }: { item: NewsArticle }) => (
    <NewsCard
      article={item}
      isBookmarked={isBookmarked(item.url)}
      onPress={() => handleArticlePress(item)}
      onBookmarkPress={() => handleBookmarkPress(item)}
    />
  );

  const renderEmptyState = () => {
    if (isLoading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {selectedCity
            ? 'No news articles found for this city.'
            : 'Please select a city to view news.'}
        </Text>
      </View>
    );
  };

  if (isLoading && !isRefreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText} onPress={() => loadNews()}>
            Tap to retry
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.url}
        renderItem={renderArticle}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryText: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});
