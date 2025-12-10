import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';

import { CitySelector } from '../screens/CitySelector';
import { NewsFeed } from '../screens/NewsFeed';
import { NewsWebView } from '../screens/NewsWebView';
import { Bookmarks } from '../screens/Bookmarks';
import { EmergencyAlerts } from '../screens/EmergencyAlerts';
import { useCityContext } from '../context/CityContext';
import { LoadingIndicator } from '../components/LoadingIndicator';

/**
 * Navigation type definitions for TypeScript
 * Requirements: 8.1, 8.2
 */

// Root Stack Navigator param list
export type RootStackParamList = {
  CitySelector: undefined;
  MainTabs: undefined;
  NewsWebView: { url: string; title?: string };
};

// Tab Navigator param list
export type MainTabParamList = {
  NewsFeed: undefined;
  Bookmarks: undefined;
  EmergencyAlerts: undefined;
};

// Combined navigation types for screens
export type NavigationProps = {
  navigation: {
    navigate: <T extends keyof RootStackParamList>(
      screen: T,
      params?: RootStackParamList[T]
    ) => void;
    goBack: () => void;
    replace: <T extends keyof RootStackParamList>(
      screen: T,
      params?: RootStackParamList[T]
    ) => void;
    setOptions: (options: object) => void;
  };
  route: {
    params: RootStackParamList[keyof RootStackParamList];
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Tab icon component for bottom navigation
 */
function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    NewsFeed: '📰',
    Bookmarks: '🔖',
    EmergencyAlerts: '⚠️',
  };
  
  return (
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      {icons[name] || '•'}
    </Text>
  );
}

/**
 * Main Tab Navigator
 * Provides access to News Feed, Bookmarks, and Emergency Alerts screens
 * Requirements: 8.1, 8.2
 */
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="NewsFeed"
        component={NewsFeed}
        options={{
          title: 'News',
          tabBarLabel: 'News',
        }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={Bookmarks}
        options={{
          title: 'Bookmarks',
          tabBarLabel: 'Bookmarks',
        }}
      />
      <Tab.Screen
        name="EmergencyAlerts"
        component={EmergencyAlerts}
        options={{
          title: 'Alerts',
          tabBarLabel: 'Alerts',
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * App Navigator component
 * Configures Stack Navigator for main flow with Tab Navigator nested
 * Handles initial city check for first launch
 * Requirements: 8.1, 8.2, 8.3
 */
export function AppNavigator() {
  const { selectedCity, isLoading } = useCityContext();

  // Show loading indicator while checking for saved city
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // Determine initial route based on whether a city is already selected
  const initialRouteName = selectedCity ? 'MainTabs' : 'CitySelector';

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="CitySelector"
          component={CitySelector}
          options={{
            title: 'Select Your City',
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="NewsWebView"
          component={NewsWebView}
          options={{
            title: 'Article',
            headerBackTitle: 'Back',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
  },
  tabIconFocused: {
    transform: [{ scale: 1.1 }],
  },
});

export default AppNavigator;
