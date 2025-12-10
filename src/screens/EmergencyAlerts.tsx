import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { EmergencyAlert } from '../types';
import { AlertCard } from '../components/AlertCard';
import { getAlerts } from '../services/alertService';
import { theme } from '../constants/theme';

/**
 * EmergencyAlerts screen - Modern design
 * Requirements: 7.1, 7.3, 7.4
 */

export function EmergencyAlerts() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadedAlerts = getAlerts();
    setAlerts(loadedAlerts);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Alerts</Text>
      <Text style={styles.subtitle}>
        {alerts.length > 0
          ? `${alerts.length} active alert${alerts.length !== 1 ? 's' : ''}`
          : 'No active alerts'}
      </Text>
    </View>
  );

  const renderAlert = ({
    item,
    index,
  }: {
    item: EmergencyAlert;
    index: number;
  }) => <AlertCard alert={item} index={index} />;

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons
          name="checkmark-circle-outline"
          size={64}
          color={theme.colors.success}
        />
      </View>
      <Text style={styles.emptyTitle}>All Clear</Text>
      <Text style={styles.emptyText}>
        There are no emergency alerts for your area at this time.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          renderItem={renderAlert}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={[
            styles.listContent,
            alerts.length === 0 && styles.emptyListContent,
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
