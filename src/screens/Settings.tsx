import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Animated,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { City } from '../types';
import { useCityContext } from '../context/CityContext';
import { searchCitiesAPI, getPopularCities } from '../services/cityService';
import { AnimatedPressable } from '../components/AnimatedPressable';

/**
 * Settings screen
 * Allows users to update their city with search functionality
 */

interface SettingsCityItemProps {
  item: City;
  isSelected: boolean;
  onSelect: (city: City) => void;
}

// Separate component for city item to properly use hooks
function SettingsCityItem({ item, isSelected, onSelect }: SettingsCityItemProps) {
  return (
    <AnimatedPressable onPress={() => onSelect(item)}>
      <View style={[styles.cityItem, isSelected && styles.cityItemSelected]}>
        <View style={styles.cityInfo}>
          <Ionicons
            name="location-outline"
            size={20}
            color={
              isSelected ? theme.colors.textPrimary : theme.colors.textSecondary
            }
          />
          <Text style={[styles.cityName, isSelected && styles.cityNameSelected]}>
            {item.displayName}
          </Text>
        </View>
        {isSelected && (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={theme.colors.textPrimary}
          />
        )}
      </View>
    </AnimatedPressable>
  );
}

export function Settings() {
  const { selectedCity, setSelectedCity } = useCityContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial load with popular cities
    setCities(getPopularCities());
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    try {
      const results = await searchCitiesAPI(query);
      setCities(results.slice(0, 20));
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleCitySelect = useCallback(
    (city: City) => {
      setSelectedCity(city.name);
      Keyboard.dismiss();
    },
    [setSelectedCity]
  );

  const renderCityItem = useCallback(
    ({ item }: { item: City }) => (
      <SettingsCityItem
        item={item}
        isSelected={selectedCity === item.name}
        onSelect={handleCitySelect}
      />
    ),
    [selectedCity, handleCitySelect]
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your experience</Text>
        </View>

        {/* Current City Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CURRENT CITY</Text>
          <View style={styles.currentCityCard}>
            <Ionicons
              name="location"
              size={24}
              color={theme.colors.textPrimary}
            />
            <Text style={styles.currentCityText}>
              {selectedCity
                ? cities.find((c) => c.name === selectedCity)?.displayName ||
                  selectedCity
                : 'No city selected'}
            </Text>
          </View>
        </View>

        {/* Search Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CHANGE CITY</Text>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={theme.colors.textMuted}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search cities..."
              placeholderTextColor={theme.colors.textMuted}
              value={searchQuery}
              onChangeText={handleSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <AnimatedPressable
                onPress={() => {
                  setSearchQuery('');
                  setCities(getPopularCities());
                }}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={theme.colors.textMuted}
                />
              </AnimatedPressable>
            )}
          </View>
        </View>

        {/* Cities List */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? 'SEARCH RESULTS' : 'POPULAR CITIES'}
          </Text>
          <FlatList
            data={cities}
            keyExtractor={(item) => item.name}
            renderItem={renderCityItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          />
        </View>
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
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  currentCityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  currentCityText: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    paddingVertical: theme.spacing.md,
  },
  listSection: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cityItemSelected: {
    borderColor: theme.colors.textPrimary,
    backgroundColor: theme.colors.surfaceElevated,
  },
  cityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  cityName: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  cityNameSelected: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
});
