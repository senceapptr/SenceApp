import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { supabaseStorage } from './supabase-storage';

// Environment variables - Expo public prefix kullanarak
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
const hasPlaceholderConfig =
  supabaseUrl.includes('your-project-ref.supabase.co') ||
  supabaseAnonKey.includes('your-anon-key');

if (!supabaseUrl || !supabaseAnonKey || hasPlaceholderConfig) {
  throw new Error(
    'Supabase konfigürasyonu eksik veya placeholder. .env.local dosyasına gerçek EXPO_PUBLIC_SUPABASE_URL ve EXPO_PUBLIC_SUPABASE_ANON_KEY değerlerini girin.'
  );
}

// Supabase client oluştur (normal kullanıcı için)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: supabaseStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
