import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { NewsArticle } from '../types';

/**
 * NewsCard component
 * Displays article title, description, image, and date
 * Includes bookmark button with toggle functionality
 * Shows visual indicator for bookmarked articles
 * Requirements: 2.3, 5.5
 */

interface NewsCardProps {
  article: NewsArticle;
  isBookmarked: boolean;
  onPress: () => void;
  onBookmarkPress: () => void;
}

/**
 * Formats a date string for display
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function NewsCard({
  article,
  isBookmarked,
  onPress,
  onBookmarkPress,
}: NewsCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {article.image ? (
        <Image
          source={{ uri: article.image }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {article.title}
          </Text>
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={onBookmarkPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.bookmarkIcon, isBookmarked && styles.bookmarked]}>
              {isBookmarked ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.description} numberOfLines={3}>
          {article.description}
        </Text>
        
        <Text style={styles.date}>{formatDate(article.date)}</Text>
      </View>
    </TouchableOpacity>
  );
}

/**
 * Extracts renderable content from a NewsCard for testing purposes
 * Returns an object with all displayed fields
 */
export function extractNewsCardContent(article: NewsArticle): {
  title: string;
  description: string;
  image: string;
  date: string;
} {
  return {
    title: article.title,
    description: article.description,
    image: article.image,
    date: formatDate(article.date),
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  placeholderImage: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 14,
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginRight: 8,
  },
  bookmarkButton: {
    padding: 4,
  },
  bookmarkIcon: {
    fontSize: 24,
    color: '#ccc',
  },
  bookmarked: {
    color: '#FFD700',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
});
