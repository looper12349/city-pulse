import React, { useRef, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NewsArticle } from '../types';
import { NewsCard } from '../components/NewsCard';
import { useBookmarkContext } from '../context/BookmarkContext';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { theme } from '../constants/theme';

/**
 * Bookmarks screen - Modern design
 * Requirements: 5.4
 */

interface BookmarksProps {
  navigation: {
    navigate: (screen: string, params?: object) => void;
  };
}

export function Bookmarks({ navigation }: BookmarksProps) {
  const { bookmarks, isLoading, isBookmarked, removeBookmark, addBookmark } =
    useBookmarkContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

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

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Bookmarks</Text>
      <Text style={styles.subtitle}>
        {bookmarks.length} saved article{bookmarks.length !== 1 ? 's' : ''}
      </Text>
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

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons
          name="bookmark-outline"
          size={64}
          color={theme.colors.textMuted}
        />
      </View>
      <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
      <Text style={styles.emptyText}>
        Save articles to read later by tapping the bookmark icon.
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.url}
          renderItem={renderArticle}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={[
            styles.listContent,
            bookmarks.length === 0 && styles.emptyListContent,
          ]}
          showsVerticalScrollIndicator={false}
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
  title: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  listContent: {
    paddingBottom: theme.spacing.xxl,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginTop: 100,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
