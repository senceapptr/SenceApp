import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Profil tipi
export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  bio: string | null;
  email: string;
  profile_image: string | null;
  cover_image: string | null;
  credits: number;
  level: number;
  experience: number;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Profil bilgilerini yükle
  const loadProfile = async (userId: string, retries = 3) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Profil bulunamadıysa ve deneme hakkı varsa tekrar dene
        if (error.code === 'PGRST116' && retries > 0) {
          console.log(`Profile not found, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return loadProfile(userId, retries - 1);
        }
        
        console.error('Error loading profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in loadProfile:', error);
    }
  };

  // Auth state değişikliklerini dinle
  useEffect(() => {
    // Mevcut session'ı kontrol et
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    // Auth state değişikliklerini dinle
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Kayıt ol
  const signUp = async (email: string, password: string, username: string) => {
    try {
      console.log('Starting signup process...');
      
      // 1. Kullanıcıyı oluştur (username'i metadata'da gönder)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (authError) {
        console.error('Auth error:', authError);
        return { error: authError };
      }

      if (!authData.user) {
        console.error('No user data returned');
        return { error: new Error('User creation failed') as AuthError };
      }

      console.log('User created:', authData.user.id);

      // 2. Auth transaction'ın commit olmasını bekle
      console.log('Waiting for auth transaction to commit...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Profili oluştur (retry mekanizması ile)
      console.log('Creating profile...');
      let profileCreated = false;
      let attempts = 0;
      const maxAttempts = 5;

      while (!profileCreated && attempts < maxAttempts) {
        attempts++;
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username,
            email,
            full_name: username,
            profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
            cover_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
            bio: 'Yeni Sence kullanıcısı 🎯',
            credits: 10000,
            level: 1,
            experience: 0,
          });

        if (!profileError) {
          console.log('Profile created successfully');
          profileCreated = true;
        } else if (profileError.code === '23503') {
          // Foreign key constraint - auth.users henüz hazır değil
          console.log(`Foreign key constraint, retrying... (${maxAttempts - attempts} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else if (profileError.code === '23505') {
          // Unique constraint - profil zaten var (trigger oluşturmuş olabilir)
          console.log('Profile already exists (created by trigger)');
          profileCreated = true;
        } else {
          console.error('Profile creation error:', profileError);
          // Diğer hatalar için devam et
          break;
        }
      }

      // 4. Profili yükle
      console.log('Loading profile...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      await loadProfile(authData.user.id, 5);

      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { error: error as AuthError };
    }
  };

  // Giriş yap
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as AuthError };
    }
  };

  // Çıkış yap
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Profili güncelle
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: new Error('No user logged in') };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        return { error };
      }

      // Local state'i güncelle
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));

      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: error as Error };
    }
  };

  // Profili yeniden yükle
  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

