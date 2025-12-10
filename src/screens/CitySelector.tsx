import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { CityPicker } from '../components/CityPicker';
import { useCityContext } from '../context/CityContext';

/**
 * CitySelector screen
 * Displays CityPicker component and navigates to NewsFeed after city selection
 * Requirements: 1.1
 */

interface CitySelectorProps {
  navigation: {
    navigate: (screen: string) => void;
    replace: (screen: string) => void;
  };
}

export function CitySelector({ navigation }: CitySelectorProps) {
  const { selectedCity, setSelectedCity } = useCityContext();

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    // Navigate to NewsFeed after city selection
    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <CityPicker
          selectedCity={selectedCity}
          onCitySelect={handleCitySelect}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
});
