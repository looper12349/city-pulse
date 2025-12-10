import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CityProvider } from './src/context/CityContext';
import { BookmarkProvider } from './src/context/BookmarkContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SplashScreen } from './src/screens/SplashScreen';

/**
 * Root App component
 * - Shows splash screen on initial load
 * - Wraps app with CityContext and BookmarkContext providers
 * - Renders AppNavigator as root component
 * Requirements: 1.1, 8.1
 */
export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (showSplash) {
    return (
      <>
        <StatusBar style="light" />
        <SplashScreen onFinish={handleSplashFinish} />
      </>
    );
  }

  return (
    <SafeAreaProvider>
      <CityProvider>
        <BookmarkProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </BookmarkProvider>
      </CityProvider>
    </SafeAreaProvider>
  );
}
