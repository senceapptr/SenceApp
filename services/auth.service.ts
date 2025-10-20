import { supabase } from '@/lib/supabase';
import { AuthError } from '@supabase/supabase-js';

export interface SignUpData {
  email: string;
  password: string;
  username: string;
  fullName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Authentication Service
 * Supabase auth işlemlerini yönetir
 */
export const authService = {
  /**
   * Yeni kullanıcı kaydı
   */
  async signUp({ email, password, username, fullName }: SignUpData) {
    try {
      // 1. Auth kullanıcısı oluştur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // 2. Profil oluştur
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        username,
        email,
        full_name: fullName || username,
        credits: 10000, // Başlangıç kredisi
        level: 1,
        experience: 0,
      });

      if (profileError) throw profileError;

      return { user: authData.user, error: null };
    } catch (error) {
      console.error('SignUp error:', error);
      return { user: null, error: error as AuthError };
    }
  },

  /**
   * Kullanıcı girişi
   */
  async signIn({ email, password }: SignInData) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { session: data.session, user: data.user, error: null };
    } catch (error) {
      console.error('SignIn error:', error);
      return { session: null, user: null, error: error as AuthError };
    }
  },

  /**
   * Kullanıcı çıkışı
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('SignOut error:', error);
      return { error: error as AuthError };
    }
  },

  /**
   * Şifre sıfırlama email gönder
   */
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error as AuthError };
    }
  },

  /**
   * Şifreyi güncelle
   */
  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { error: error as AuthError };
    }
  },

  /**
   * Mevcut session'ı al
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { session: data.session, error: null };
    } catch (error) {
      console.error('Get session error:', error);
      return { session: null, error: error as AuthError };
    }
  },

  /**
   * Mevcut kullanıcıyı al
   */
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Get current user error:', error);
      return { user: null, error: error as AuthError };
    }
  },
};

