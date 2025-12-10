import { StatusBar } from 'expo-status-bar';
import { CityProvider } from './src/context/CityContext';
import { BookmarkProvider } from './src/context/BookmarkContext';
import { AppNavigator } from './src/navigation/AppNavigator';

/**
 * Root App component
 * - Wraps app with CityContext and BookmarkContext providers
 * - Renders AppNavigator as root component
 * - Initial city check for first launch is handled by AppNavigator
 * Requirements: 1.1, 8.1
 */
export default function App() {
  return (
    <CityProvider>
      <BookmarkProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </BookmarkProvider>
    </CityProvider>
  );
}
