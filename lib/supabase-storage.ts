import AsyncStorage from '@react-native-async-storage/async-storage';
import { SupportedStorage } from '@supabase/supabase-js';

/**
 * Custom Supabase storage adapter for React Native using AsyncStorage
 * Supabase session persistence için
 */
export const supabaseStorage: SupportedStorage = {
  getItem: async (key: string) => {
    try {
      const item = await AsyncStorage.getItem(key);
      return item;
    } catch (error) {
      console.error('Error getting item from AsyncStorage:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in AsyncStorage:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from AsyncStorage:', error);
    }
  },
};

