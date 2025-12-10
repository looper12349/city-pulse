import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CityPicker } from '../components/CityPicker';
import { useCityContext } from '../context/CityContext';
import { theme } from '../constants/theme';



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
    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <CityPicker selectedCity={selectedCity} onCitySelect={handleCitySelect} />
      </View>
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
});
