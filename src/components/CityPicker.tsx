import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { City } from '../types';
import { CITIES } from '../constants/cities';

/**
 * CityPicker component
 * Displays cities in alphabetically sorted picker/modal
 * Handles city selection and update context
 * Requirements: 1.1, 1.4
 */

interface CityPickerProps {
  selectedCity: string | null;
  onCitySelect: (cityName: string) => void;
}

export function CityPicker({ selectedCity, onCitySelect }: CityPickerProps) {
  const renderCityItem = ({ item }: { item: City }) => {
    const isSelected = selectedCity === item.name;
    
    return (
      <TouchableOpacity
        style={[styles.cityItem, isSelected && styles.selectedCityItem]}
        onPress={() => onCitySelect(item.name)}
        activeOpacity={0.7}
      >
        <Text style={[styles.cityText, isSelected && styles.selectedCityText]}>
          {item.displayName}
        </Text>
        {isSelected && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your City</Text>
      <FlatList
        data={CITIES}
        keyExtractor={(item) => item.name}
        renderItem={renderCityItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  listContent: {
    paddingVertical: 8,
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedCityItem: {
    backgroundColor: '#007AFF',
  },
  cityText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  selectedCityText: {
    color: '#fff',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
});
