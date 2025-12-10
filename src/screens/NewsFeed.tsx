import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  RefreshControl,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NewsArticle } from '../types';
import { NewsCard } from '../components/NewsCard';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { useCityContext } from '../context/CityContext';
import { useBookmarkContext } from '../context/BookmarkContext';
import { fetchNewsByCity, NewsServiceError } from '../services/newsService';
import { theme } from '../constants/theme';
import { getCityByName } from '../constants/cities';

/**
 * NewsFeed screen - Modern futuristic design
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
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadNews = useCallback(
    async (showRefreshIndicator = false) => {
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
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
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
    },
    [selectedCity]
  );

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const handleRefresh = useCallback(() => {
    loadNews(true);
  }, [loadNews]);

  const handleArticlePress = (article: NewsArticle) => {
    navigation.navigate('NewsWebView', {
      url: article.url,
      title: article.title,
    });
  };

  const handleBookmarkPress = async (article: NewsArticle) => {
    if (isBookmarked(article.url)) {
      await removeBookmark(article.url);
    } else {
      await addBookmark(article);
    }
  };

  const cityDisplayName =
    getCityByName(selectedCity || '')?.displayName || selectedCity;

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerLabel}>NEWS FROM</Text>
          <Text style={styles.headerCity}>{cityDisplayName}</Text>
        </View>
        <AnimatedPressable
          onPress={() => navigation.navigate('Settings' as any)}
          style={styles.settingsButton}
        >
          <Ionicons
            name="settings-outline"
            size={24}
            color={theme.colors.textPrimary}
          />
        </AnimatedPressable>
      </View>
    </View>
  );

  const renderArticle = ({
    item,
    index,
  }: {
    item: NewsArticle;
    index: number;
  }) => (
    <NewsCard
      article={item}
      isBookmarked={isBookmarked(item.url)}
      onPress={() => handleArticlePress(item)}
      onBookmarkPress={() => handleBookmarkPress(item)}
      index={index}
    />
  );

  const renderEmptyState = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="newspaper-outline"
          size={64}
          color={theme.colors.textMuted}
        />
        <Text style={styles.emptyTitle}>No News Found</Text>
        <Text style={styles.emptyText}>
          {selectedCity
            ? 'No articles available for this city right now.'
            : 'Please select a city to view news.'}
        </Text>
      </View>
    );
  };

  if (isLoading && !isRefreshing) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.errorContainer}>
          <Ionicons
            name="cloud-offline-outline"
            size={64}
            color={theme.colors.textMuted}
          />
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <AnimatedPressable onPress={() => loadNews()} style={styles.retryButton}>
            <Text style={styles.retryText}>Try Again</Text>
          </AnimatedPressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <FlatList
          data={articles}
          keyExtractor={(item) => item.url}
          renderItem={renderArticle}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.textPrimary}
              colors={[theme.colors.textPrimary]}
              progressBackgroundColor={theme.colors.surface}
            />
          }
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  headerCity: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
  },
  settingsButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  listContent: {
    paddingBottom: theme.spacing.xxl,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginTop: 100,
  },
  emptyTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  retryText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
});
