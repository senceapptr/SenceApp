import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Professional Dark Mode Design Tokens
export const lightTheme = {
  // Backgrounds
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceCard: '#FFFFFF',
  surfaceModal: '#FFFFFF',
  
  // Text Colors (WCAG AA Compliant)
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // Brand Colors
  primary: '#6B46F0',
  primaryLight: '#8B5CF6',
  primaryDark: '#5B21B6',
  secondary: '#3B82F6',
  accent: '#10B981',
  
  // System Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Borders & Dividers
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',
  divider: '#F3F4F6',
  
  // Shadows & Elevation
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.25)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Interactive States
  hover: '#F9FAFB',
  pressed: '#F3F4F6',
  disabled: '#F9FAFB',
  disabledText: '#D1D5DB',
};

export const darkTheme = {
  // Backgrounds (Deep Neutrals - Not Pure Black)
  background: '#0E0F12',
  surface: '#15171C',
  surfaceElevated: '#171922',
  surfaceCard: '#1B1D26',
  surfaceModal: '#1F212A',
  
  // Text Colors (WCAG AA Compliant)
  textPrimary: '#EDEDEF',
  textSecondary: '#BABCC2',
  textMuted: '#8B8E97',
  textInverse: '#111827',
  
  // Brand Colors (Slightly Reduced Brightness, Increased Saturation)
  primary: '#7C5EF4',
  primaryLight: '#9B7DF7',
  primaryDark: '#6D4CE8',
  secondary: '#4F93FF',
  accent: '#20D4A7',
  
  // System Colors
  success: '#20D4A7',
  warning: '#FFAD1F',
  error: '#FF5757',
  info: '#4F93FF',
  
  // Borders & Dividers (Subtle Strokes Replace Shadows)
  border: '#2A2D35',
  borderLight: '#242731',
  borderDark: '#363943',
  divider: '#242731',
  
  // Shadows & Elevation (Minimal in Dark Mode)
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowDark: 'rgba(0, 0, 0, 0.5)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Interactive States
  hover: '#1B1D26',
  pressed: '#242731',
  disabled: '#1B1D26',
  disabledText: '#4A4D56',
};

export type Theme = typeof lightTheme;
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// AsyncStorage for Theme Persistence (Expo Go compatible)
const THEME_KEY = 'app_theme_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [systemColorScheme, setSystemColorScheme] = useState(Appearance.getColorScheme() || 'light');

  // Initialize theme from storage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeMode(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.log('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme || 'light');
    });

    return () => subscription.remove();
  }, []);

  // Determine current theme
  const isDarkMode = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Update status bar style
  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
  }, [isDarkMode]);

  const toggleTheme = async () => {
    const newMode: ThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    try {
      await AsyncStorage.setItem(THEME_KEY, newMode);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const handleSetThemeMode = async (mode: ThemeMode) => {
    setThemeMode(mode);
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode,
        themeMode,
        toggleTheme,
        setThemeMode: handleSetThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
