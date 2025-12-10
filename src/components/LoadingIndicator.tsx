import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';

/**
 * LoadingIndicator component
 * Displays an ActivityIndicator with consistent styling
 * Requirements: 2.5, 4.3
 */

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

export function LoadingIndicator({
  size = 'large',
  color = '#007AFF',
  style,
}: LoadingIndicatorProps) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
