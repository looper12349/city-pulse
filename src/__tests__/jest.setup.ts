// Jest setup file for mocking React Native modules

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock expo-font
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

// Mock expo-asset
jest.mock('expo-asset', () => ({
  Asset: {
    loadAsync: jest.fn(),
    fromModule: jest.fn(() => ({ downloadAsync: jest.fn() })),
  },
}));

// Mock AsyncStorage
const mockStorage: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    setItem: jest.fn((key: string, value: string) => {
      mockStorage[key] = value;
      return Promise.resolve();
    }),
    getItem: jest.fn((key: string) => {
      return Promise.resolve(mockStorage[key] || null);
    }),
    removeItem: jest.fn((key: string) => {
      delete mockStorage[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
      return Promise.resolve();
    }),
    getAllKeys: jest.fn(() => {
      return Promise.resolve(Object.keys(mockStorage));
    }),
  },
  __esModule: true,
}));

// Export for use in tests that need to reset storage
export const resetMockStorage = () => {
  Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
};
