import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { CitySelector } from '../screens/CitySelector';
import { NewsFeed } from '../screens/NewsFeed';
import { NewsWebView } from '../screens/NewsWebView';
import { Bookmarks } from '../screens/Bookmarks';
import { EmergencyAlerts } from '../screens/EmergencyAlerts';
import { Settings } from '../screens/Settings';
import { useCityContext } from '../context/CityContext';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { theme } from '../constants/theme';



export type RootStackParamList = {
  CitySelector: undefined;
  MainTabs: undefined;
  NewsWebView: { url: string; title?: string };
  Settings: undefined;
};

export type MainTabParamList = {
  NewsFeed: undefined;
  Bookmarks: undefined;
  EmergencyAlerts: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom dark theme for navigation
const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.textPrimary,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.textPrimary,
    border: theme.colors.border,
    notification: theme.colors.error,
  },
};

/**
 * Tab bar icon component with label
 */
function TabBarIcon({
  name,
  label,
  focused,
}: {
  name: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
}) {
  return (
    <View style={styles.tabBarIconContainer}>
      <View style={[styles.tabIconCircle, focused && styles.tabIconCircleFocused]}>
        <Ionicons
          name={name}
          size={20}
          color={focused ? theme.colors.textPrimary : theme.colors.textMuted}
        />
      </View>
      <Text
        style={[
          styles.tabBarIconLabel,
          focused && styles.tabBarIconLabelFocused,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

/**
 * Main Tab Navigator
 * Requirements: 8.1, 8.2
 */
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerStyle: styles.header,
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
      }}
    >
      <Tab.Screen
        name="NewsFeed"
        component={NewsFeed}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'newspaper' : 'newspaper-outline'}
              label="News"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={Bookmarks}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'bookmark' : 'bookmark-outline'}
              label="Saved"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="EmergencyAlerts"
        component={EmergencyAlerts}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'warning' : 'warning-outline'}
              label="Alerts"
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * App Navigator component
 * Requirements: 8.1, 8.2, 8.3
 */
export function AppNavigator() {
  const { selectedCity, isLoading } = useCityContext();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  const initialRouteName = selectedCity ? 'MainTabs' : 'CitySelector';

  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerStyle: styles.header,
          headerTintColor: theme.colors.textPrimary,
          headerTitleStyle: styles.headerTitle,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="CitySelector"
          component={CitySelector}
          options={{
            title: '',
            headerShown: false,
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
            headerBackTitle: '',
          }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            title: '',
            headerBackTitle: '',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  tabBar: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    height: 80,
    paddingTop: 8,
    paddingBottom: 16,
  },
  tabBarIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  tabIconCircle: {
    width: 44,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 4,
  },
  tabIconCircleFocused: {
    backgroundColor: theme.colors.surfaceHighlight,
  },
  tabBarIconLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.textMuted,
    letterSpacing: 0.3,
  },
  tabBarIconLabelFocused: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
});

export default AppNavigator;
