import React, { useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NewsArticle } from '../types';
import { theme } from '../constants/theme';
import { AnimatedPressable } from './AnimatedPressable';



interface NewsCardProps {
  article: NewsArticle;
  isBookmarked: boolean;
  onPress: () => void;
  onBookmarkPress: () => void;
  index?: number;
}

export function NewsCard({
  article,
  isBookmarked,
  onPress,
  onBookmarkPress,
  index = 0,
}: NewsCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <AnimatedPressable onPress={onPress} style={styles.card}>
        {/* Image */}
        {article.image ? (
          <Image
            source={{ uri: article.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons
              name="newspaper-outline"
              size={32}
              color={theme.colors.textMuted}
            />
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {article.title}
          </Text>

          {article.description && (
            <Text style={styles.description} numberOfLines={2}>
              {article.description}
            </Text>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.dateContainer}>
              <Ionicons
                name="time-outline"
                size={14}
                color={theme.colors.textMuted}
              />
              <Text style={styles.date}>{formatDate(article.date)}</Text>
            </View>

            <AnimatedPressable
              onPress={onBookmarkPress}
              style={styles.bookmarkButton}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={
                  isBookmarked
                    ? theme.colors.textPrimary
                    : theme.colors.textMuted
                }
              />
            </AnimatedPressable>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

/**
 * Extract content from NewsArticle for rendering
 * Used for property testing
 * Requirements: 2.3
 */
export function extractNewsCardContent(article: NewsArticle) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return {
    title: article.title,
    description: article.description,
    image: article.image,
    date: formatDate(article.date),
  };
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: theme.colors.surfaceElevated,
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: theme.colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    lineHeight: 24,
  },
  description: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  date: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textTransform: 'none',
    letterSpacing: 0,
  },
  bookmarkButton: {
    padding: theme.spacing.xs,
  },
});
