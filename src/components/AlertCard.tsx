import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EmergencyAlert } from '../types';
import { theme } from '../constants/theme';

/**
 * AlertCard component - Modern design
 * Displays alert with color-coded styling based on severity
 * Requirements: 7.2, 7.3
 */

interface AlertCardProps {
  alert: EmergencyAlert;
  index?: number;
}

type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

const severityConfig: Record<
  SeverityLevel,
  { color: string; icon: keyof typeof Ionicons.glyphMap; label: string }
> = {
  low: {
    color: theme.colors.success,
    icon: 'information-circle',
    label: 'LOW',
  },
  medium: {
    color: theme.colors.warning,
    icon: 'alert-circle',
    label: 'MEDIUM',
  },
  high: {
    color: theme.colors.error,
    icon: 'warning',
    label: 'HIGH',
  },
  critical: {
    color: theme.colors.critical,
    icon: 'alert',
    label: 'CRITICAL',
  },
};

export function AlertCard({ alert, index = 0 }: AlertCardProps) {
  const config = severityConfig[alert.severity] || severityConfig.low;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

    // Pulse animation for critical alerts
    if (alert.severity === 'critical') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: pulseAnim }],
        },
      ]}
    >
      <View style={[styles.card, { borderLeftColor: config.color }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.severityBadge}>
            <Ionicons name={config.icon} size={16} color={config.color} />
            <Text style={[styles.severityText, { color: config.color }]}>
              {config.label}
            </Text>
          </View>
          <View style={styles.timestampContainer}>
            <Ionicons
              name="time-outline"
              size={12}
              color={theme.colors.textMuted}
            />
            <Text style={styles.timestamp}>
              {formatTimestamp(alert.timestamp)}
            </Text>
          </View>
        </View>

        {/* Content */}
        <Text style={styles.title}>{alert.title}</Text>
        <Text style={styles.description}>{alert.description}</Text>

        {/* Indicator bar */}
        <View style={[styles.indicatorBar, { backgroundColor: config.color }]} />
      </View>
    </Animated.View>
  );
}

/**
 * Get severity color for property testing
 * Requirements: 7.2
 */
export function getSeverityColor(severity: SeverityLevel): string {
  return severityConfig[severity]?.color || theme.colors.textMuted;
}

/**
 * Exported severity colors for testing
 */
export const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  low: theme.colors.success,
  medium: theme.colors.warning,
  high: theme.colors.error,
  critical: theme.colors.critical,
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderLeftWidth: 4,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  severityText: {
    ...theme.typography.caption,
    fontWeight: '700',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timestamp: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textTransform: 'none',
    letterSpacing: 0,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  description: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  indicatorBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.5,
  },
});
