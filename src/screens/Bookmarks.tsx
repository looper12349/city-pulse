import React from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { NewsArticle } from '../types';
import { NewsCard } from '../components/NewsCard';
import { useBookmarkContext } from '../context/BookmarkContext';
import { LoadingIndicator } from '../components/LoadingIndicator';

/**
 * Bookmarks screen
 * Displays all bookmarked articles from context
 * Uses FlatList with NewsCard components
 * Shows empty state when no bookmarks exist
 * Requirements: 5.4
 */

interface BookmarksProps {
  navigation: {
    navigate: (screen: string, params?: object) => void;
  };
}

export function Bookmarks({ navigation }: BookmarksProps) {
  const { bookmarks, isLoading, isBookmarked, removeBookmark, addBookmark } = useBookmarkContext();

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

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📚</Text>
      <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
      <Text style={styles.emptyText}>
        Articles you bookmark will appear here for easy access.
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.url}
        renderItem={renderArticle}
        contentContainerStyle={[
          styles.listContent,
          bookmarks.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmptyState}
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
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
