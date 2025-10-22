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

/**
 * Tüm Supabase auth verilerini temizle
 */
export const clearSupabaseAuth = async () => {
  try {
    // Tüm AsyncStorage anahtarlarını al
    const keys = await AsyncStorage.getAllKeys();
    
    // Supabase ile ilgili anahtarları filtrele
    const supabaseKeys = keys.filter(key => 
      key.includes('supabase') || 
      key.includes('sb-') || 
      key.includes('auth')
    );
    
    // Supabase anahtarlarını sil
    if (supabaseKeys.length > 0) {
      await AsyncStorage.multiRemove(supabaseKeys);
      console.log('Cleared Supabase auth keys:', supabaseKeys);
    }
    
    // Alternatif olarak tüm storage'ı temizle
    await AsyncStorage.clear();
    console.log('All AsyncStorage cleared');
    
  } catch (error) {
    console.error('Error clearing Supabase auth:', error);
  }
};

