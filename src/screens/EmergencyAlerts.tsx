import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { EmergencyAlert } from '../types';
import { AlertCard } from '../components/AlertCard';
import { getAlerts } from '../services/alertService';

/**
 * EmergencyAlerts screen
 * Displays alerts using AlertCard components
 * Shows empty state when no alerts exist
 * Requirements: 7.1, 7.3, 7.4
 */

export function EmergencyAlerts() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);

  useEffect(() => {
    // Load alerts on mount
    const loadedAlerts = getAlerts();
    setAlerts(loadedAlerts);
  }, []);

  const renderAlert = ({ item }: { item: EmergencyAlert }) => (
    <AlertCard alert={item} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>✓</Text>
      <Text style={styles.emptyTitle}>No Active Alerts</Text>
      <Text style={styles.emptyText}>
        There are no emergency alerts for your area at this time.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={renderAlert}
        contentContainerStyle={[
          styles.listContent,
          alerts.length === 0 && styles.emptyListContent,
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
    color: '#4CAF50',
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
