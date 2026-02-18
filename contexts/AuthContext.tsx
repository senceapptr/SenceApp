import { Session, User, AuthError } from '@supabase/supabase-js';
import * as AppleAuthentication from 'expo-apple-authentication';
import Constants from 'expo-constants';
import React, { createContext, useContext, useLayoutEffect, useState } from 'react';
import { Platform } from 'react-native';

import { supabase } from '@/lib/supabase';
import { verificationService } from '@/services/verification.service';

// Profil tipi
export interface Profile {
  id: string;
  email: string;
  username: string;
  bio: string | null;
  level: number | null;
  credits: number | null;
  tickets?: number | null;
  full_name: string | null;
  experience: number | null;
  created_at: string | null;
  updated_at: string | null;
  cover_image: string | null;
  profile_image: string | null;
  league_quota?: number | null;
  is_verified?: boolean | null; // Email verification durumu
}

interface AuthContextType {
  loading: boolean;
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isEmailVerified: boolean; // Email verification durumu
  pendingVerification: boolean; // SignUp sonrası verification bekleniyor mu
  signOut: () => Promise<void>;
  unreadNotificationsCount: number;
  forceLogout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  markEmailAsVerified: () => Promise<void>; // Verification başarılı olduğunda state'i güncelle
  checkEmailVerification: () => Promise<void>; // Email verification durumunu kontrol et
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  pendingVerificationUser: { id: string; email: string; password?: string } | null; // SignUp sonrası user bilgileri (user null olsa bile)
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithApple: () => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type GoogleSigninAdapter = {
  configure: (options: {
    forceCodeForRefreshToken?: boolean;
    iosClientId?: string;
    webClientId?: string;
  }) => void;
  getTokens: () => Promise<{ idToken?: string }>;
  hasPlayServices: (options?: { showPlayServicesUpdateDialog?: boolean }) => Promise<boolean>;
  signIn: () => Promise<{ idToken?: string; data?: { idToken?: string } }>;
  signOut: () => Promise<void>;
};

function getGoogleSigninModule(): GoogleSigninAdapter | null {
  const isExpoGo =
    (Constants as any)?.appOwnership === 'expo' ||
    (Constants as any)?.executionEnvironment === 'storeClient';

  // Expo Go binary does not include RNGoogleSignin native module.
  if (isExpoGo) {
    return null;
  }

  try {
    const mod = require('@react-native-google-signin/google-signin') as {
      GoogleSignin?: GoogleSigninAdapter;
    };
    return mod.GoogleSignin || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [pendingVerificationUser, setPendingVerificationUser] = useState<{
    id: string;
    email: string;
    password?: string;
  } | null>(null);
  const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

  const createAuthError = (message: string) => ({ message } as AuthError);

  // Profil bilgilerini yükle
  const loadProfile = async (userId: string, retries = 3) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

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
      // Email verification durumunu kontrol et
      const profileData = data as Profile | null;
      if (profileData?.is_verified !== undefined) {
        setIsEmailVerified(Boolean(profileData.is_verified));
      }
    } catch (error) {
      console.error('Error in loadProfile:', error);
    }
  };

  // Okunmamış bildirim sayısını yükle
  const loadUnreadCount = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error loading unread count:', error);
        return;
      }

      setUnreadNotificationsCount(data?.length || 0);
    } catch (error) {
      console.error('Error in loadUnreadCount:', error);
    }
  };

  // Auth state değişikliklerini dinle
  useLayoutEffect(() => {
    const googleSignin = getGoogleSigninModule();
    if (googleSignin) {
      googleSignin.configure({
        forceCodeForRefreshToken: false,
        iosClientId: googleIosClientId,
        webClientId: googleWebClientId,
      });
    }

    // Mevcut session'ı kontrol et
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          loadProfile(session.user.id);
          loadUnreadCount(session.user.id);
        }
        setLoading(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Auth state değişikliklerini dinle
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        loadProfile(session.user.id);
        loadUnreadCount(session.user.id);
      } else {
        setProfile(null);
        setUnreadNotificationsCount(0);
        setIsEmailVerified(false);
        setPendingVerification(false);
        setPendingVerificationUser(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Kayıt ol
  const signUp = async (email: string, password: string, username: string) => {
    // Şifreyi geçici olarak sakla (verification sonrası otomatik login için)
    try {
      console.log('Starting signup process...');

      // 1. Kullanıcıyı oluştur (username'i metadata'da gönder)
      // NOT: emailRedirectTo eklemiyoruz - kendi OTP sistemimiz var
      // Email confirmation'ı Supabase Dashboard'da kapatmak gerekiyor
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        options: {
          data: {
            username: username,
          },
          // Email confirmation bypass etmek için (kendi OTP sistemimiz var)
          // Ama Supabase Dashboard'da "Enable email confirmations" kapatılmalı
        },
        password,
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

        const { error: profileError } = await supabase.from('profiles').insert({
          bio: 'Yeni Sence kullanıcısı 🎯',
          cover_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          credits: 10000,
          email,
          experience: 0,
          full_name: username,
          id: authData.user.id,
          level: 1,
          profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
          username,
        } as any);

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

      // 5. SignUp başarılı - email verification sayfasına yönlendir
      // User bilgilerini geçici olarak sakla (user null olsa bile)
      // Şifreyi de sakla - verification sonrası otomatik login için
      setPendingVerificationUser({
        email: authData.user.email || email,
        id: authData.user.id,
        password: password, // Geçici olarak sakla - verification sonrası otomatik login için
      });
      setPendingVerification(true);

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

      if (error) {
        if (
          error.message?.toLowerCase().includes('email') &&
          (error.message?.toLowerCase().includes('confirm') ||
            error.message?.toLowerCase().includes('verified') ||
            error.message?.toLowerCase().includes('not confirmed'))
        ) {
          return { error: createAuthError('Email adresinizi doğrulayıp tekrar deneyin.') };
        }
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as AuthError };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const googleSignin = getGoogleSigninModule();
      if (!googleSignin) {
        return {
          error: createAuthError('Google girisi Expo Go icinde desteklenmez. Development build kullanin.'),
        };
      }

      if (!googleWebClientId && !googleIosClientId) {
        return { error: createAuthError('Google giriş yapılandırması eksik.') };
      }

      if (Platform.OS === 'android') {
        await googleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }

      const signInResult = (await googleSignin.signIn()) as any;
      let idToken: string | undefined = signInResult?.idToken ?? signInResult?.data?.idToken;

      if (!idToken) {
        const tokens = await googleSignin.getTokens();
        idToken = tokens?.idToken;
      }

      if (!idToken) {
        return { error: createAuthError('Google kimlik doğrulama tokenı alınamadı.') };
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { error: createAuthError('Google ile giriş tamamlanamadı.') };
    }
  };

  const signInWithApple = async () => {
    try {
      if (Platform.OS !== 'ios') {
        return { error: createAuthError('Apple ile giriş sadece iOS cihazlarda kullanılabilir.') };
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });

      if (!credential.identityToken) {
        return { error: createAuthError('Apple kimlik tokenı alınamadı.') };
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      if ((error as { code?: string })?.code === 'ERR_REQUEST_CANCELED') {
        return { error: createAuthError('Apple ile giriş iptal edildi.') };
      }

      console.error('Apple sign in error:', error);
      return { error: createAuthError('Apple ile giriş tamamlanamadı.') };
    }
  };

  // Çıkış yap
  const signOut = async () => {
    try {
      try {
        const googleSignin = getGoogleSigninModule();
        if (googleSignin) {
          await googleSignin.signOut();
        }
      } catch {
        // Ignore Google sign out errors for non-Google sessions
      }

      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Zorla çıkış yap - tüm session verilerini temizle
  const forceLogout = async () => {
    try {
      // Supabase auth'dan çıkış yap
      await supabase.auth.signOut();

      // Local state'i temizle
      setUser(null);
      setProfile(null);
      setSession(null);

      // AsyncStorage'dan tüm Supabase verilerini temizle
      const { clearSupabaseAuth } = await import('@/lib/supabase-storage');
      await clearSupabaseAuth();

      console.log('Force logout completed - all auth data cleared');
    } catch (error) {
      console.error('Force logout error:', error);
    }
  };

  // Profili güncelle
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: new Error('No user logged in') };
    }

    try {
      const { error } = await (supabase.from('profiles') as any).update(updates).eq('id', user.id);

      if (error) {
        return { error };
      }

      // Local state'i güncelle
      setProfile(prev => (prev ? { ...prev, ...updates } : null));

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

  // Okunmamış bildirim sayısını yenile
  const refreshUnreadCount = async () => {
    if (user) {
      await loadUnreadCount(user.id);
    }
  };

  // Email verification durumunu kontrol et
  const checkEmailVerification = async () => {
    if (!user) return;

    try {
      const result = await verificationService.checkVerificationStatus(user.id);
      setIsEmailVerified(result.isVerified);

      // Profil state'ini de güncelle
      if (profile) {
        setProfile({ ...profile, is_verified: result.isVerified });
      }
    } catch (error) {
      console.error('Error checking email verification:', error);
    }
  };

  // Email verification başarılı olduğunda state'i güncelle ve otomatik login yap
  const markEmailAsVerified = async () => {
    setIsEmailVerified(true);

    // Verification sonrası otomatik login yap (eğer şifre varsa)
    const verificationUser = pendingVerificationUser;
    if (verificationUser?.password && verificationUser.email) {
      try {
        console.log('Auto-login after verification...');
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: verificationUser.email,
          password: verificationUser.password,
        });

        if (signInError) {
          console.error('Auto-login error:', signInError);
          // Hata olsa bile devam et - kullanıcı manuel login yapabilir
        } else {
          console.log('Auto-login successful');
        }
      } catch (error) {
        console.error('Auto-login exception:', error);
      }
    }

    setPendingVerification(false);
    setPendingVerificationUser(null); // Artık gerek yok - güvenlik için temizle

    // Profil state'ini de güncelle
    if (profile) {
      setProfile({ ...profile, is_verified: true });
    }
  };

  const value = {
    checkEmailVerification,
    forceLogout,
    isEmailVerified,
    loading,
    markEmailAsVerified,
    pendingVerification,
    pendingVerificationUser,
    profile,
    refreshProfile,
    refreshUnreadCount,
    session,
    signIn,
    signInWithApple,
    signInWithGoogle,
    signOut,
    signUp,
    unreadNotificationsCount,
    updateProfile,
    user,
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
