import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Animated,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { City } from '../types';
import { searchCities } from '../constants/cities';
import { theme } from '../constants/theme';
import { AnimatedPressable } from './AnimatedPressable';



interface CityPickerProps {
  selectedCity: string | null;
  onCitySelect: (cityName: string) => void;
}

interface CityItemProps {
  item: City;
  isSelected: boolean;
  onSelect: (cityName: string) => void;
}

// Separate component for city item to properly use hooks
function CityItem({ item, isSelected, onSelect }: CityItemProps) {
  return (
    <AnimatedPressable onPress={() => onSelect(item.name)}>
      <View style={[styles.cityItem, isSelected && styles.selectedCityItem]}>
        <View style={styles.cityInfo}>
          <Ionicons
            name="location-outline"
            size={20}
            color={
              isSelected ? theme.colors.textPrimary : theme.colors.textSecondary
            }
          />
          <Text style={[styles.cityText, isSelected && styles.selectedCityText]}>
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

export function CityPicker({ selectedCity, onCitySelect }: CityPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setCities(searchCities(''));
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCities(searchCities(query));
  }, []);

  const handleCitySelect = useCallback(
    (cityName: string) => {
      onCitySelect(cityName);
      Keyboard.dismiss();
    },
    [onCitySelect]
  );

  const renderCityItem = useCallback(
    ({ item }: { item: City }) => (
      <CityItem
        item={item}
        isSelected={selectedCity === item.name}
        onSelect={handleCitySelect}
      />
    ),
    [selectedCity, handleCitySelect]
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Select Your City</Text>
        <Text style={styles.subtitle}>
          Choose your location to get personalized news
        </Text>
      </View>

      {/* Search */}
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
              setCities(searchCities(''));
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

      {/* Cities List */}
      <FlatList
        data={cities}
        keyExtractor={(item) => item.name}
        renderItem={renderCityItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
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
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedCityItem: {
    borderColor: theme.colors.textPrimary,
    backgroundColor: theme.colors.surfaceElevated,
  },
  cityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  cityText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  selectedCityText: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
});
