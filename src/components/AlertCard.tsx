import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EmergencyAlert } from '../types';

/**
 * AlertCard component
 * Displays alert title, description, and timestamp
 * Applies color-coded styling based on severity level
 * Requirements: 7.2, 7.3
 */

interface AlertCardProps {
  alert: EmergencyAlert;
}

/**
 * Severity color mapping
 * Maps severity levels to their corresponding colors
 */
export const SEVERITY_COLORS: Record<EmergencyAlert['severity'], string> = {
  low: '#4CAF50',      // Green
  medium: '#FF9800',   // Orange
  high: '#F44336',     // Red
  critical: '#9C27B0', // Purple
};

/**
 * Gets the color for a given severity level
 */
export function getSeverityColor(severity: EmergencyAlert['severity']): string {
  return SEVERITY_COLORS[severity];
}

/**
 * Formats a timestamp for display
 */
function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return timestamp;
  }
}

export function AlertCard({ alert }: AlertCardProps) {
  const severityColor = getSeverityColor(alert.severity);

  return (
    <View style={[styles.container, { borderLeftColor: severityColor }]}>
      <View style={styles.header}>
        <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
          <Text style={styles.severityText}>{alert.severity.toUpperCase()}</Text>
        </View>
        <Text style={styles.timestamp}>{formatTimestamp(alert.timestamp)}</Text>
      </View>
      
      <Text style={styles.title}>{alert.title}</Text>
      <Text style={styles.description}>{alert.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  severityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
