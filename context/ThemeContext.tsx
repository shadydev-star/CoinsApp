import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const LightColors = {
  // Backgrounds - Vibrant tropical blue
  background: '#E3F2FD',        // Bright sky blue background
  surface: '#FFFFFF',           // Clean white cards
  surfaceLight: '#F7FBFF',      // Slightly blue-tinted white
  
  // Primary colors - Sunset gold (beautiful contrast with blue)
  gold: '#FFB800',              // Bright, warm gold
  goldLight: '#FFF3DF',         // Warm gold tint
  
  // Status colors
  success: '#2EBD6E',           // Fresh mint green
  successLight: '#EAF9F0',      // Soft mint tint
  error: '#FF5E5E',             // Coral red
  errorLight: '#FFEEEE',        // Soft coral tint
  
  // Text colors - Readable contrast
  textPrimary: '#1E3A5F',       // Deep royal blue
  textSecondary: '#5A7B9F',     // Medium blue-gray
  textTertiary: '#8BA3BC',      // Light blue-gray
  textGold: '#E6A800',          // Rich gold for text
  
  // Border colors
  border: '#C5D9EE',            // Soft blue border
  borderGold: '#FFB800',        // Gold border
  
  // Tab bar
  tabBar: '#FFFFFF',
  
  // Additional accents
  accentBlue: '#2196F3',        // Material blue
  accentBlueLight: '#E3F2FD',   // Light blue
  shadow: '#1E3A5F',
} as const;

// Dark theme colors (your current colors)
export const DarkColors = {
  background: '#000000',
  surface: '#1a1a1a',
  surfaceLight: '#2a2a2a',
  gold: '#FFD700',
  goldLight: '#FFD70033',
  success: '#00C853',
  successLight: '#00C85320',
  error: '#FF3B30',
  errorLight: '#FF3B3020',
  textPrimary: '#FFFFFF',
  textSecondary: '#888888',
  textTertiary: '#666666',
  textGold: '#FFD700',
  border: '#333333',
  borderGold: '#FFD700',
  tabBar: '#0a0a0a',
};

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  colors: typeof LightColors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('dark');

  useEffect(() => {
    // Load saved theme from storage
    loadTheme();
  }, []);

  const loadTheme = async () => {
  try {
    const savedTheme = await SecureStore.getItemAsync('app_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setThemeState(savedTheme);
    }
  } catch (error) {
    // Expo SecureStore works in Expo Go
    console.log('Error loading theme:', error);
  }
};

const setTheme = async (newTheme: ThemeType) => {
  setThemeState(newTheme);
  await SecureStore.setItemAsync('app_theme', newTheme);
};

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const colors = theme === 'dark' ? DarkColors : LightColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};