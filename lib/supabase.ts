import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { supabaseStorage } from './supabase-storage';

// Environment variables - Expo public prefix kullanarak
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL ve Anon Key gerekli! .env dosyasında EXPO_PUBLIC_SUPABASE_URL ve EXPO_PUBLIC_SUPABASE_ANON_KEY değerlerini ayarlayın.'
  );
}

// Supabase client oluştur
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: supabaseStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

