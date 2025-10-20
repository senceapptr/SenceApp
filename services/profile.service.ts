import { supabase } from '@/lib/supabase';

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

export interface UserStats {
  id: string;
  user_id: string;
  total_predictions: number;
  correct_predictions: number;
  total_coupons: number;
  won_coupons: number;
  total_earnings: number;
  accuracy_rate: number;
  longest_streak: number;
  current_streak: number;
  created_at: string;
  updated_at: string;
}

/**
 * Profile Service
 * Kullanıcı profil işlemleri
 */
export const profileService = {
  /**
   * Profil bilgilerini getir
   */
  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get profile error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Profili güncelle
   */
  async updateProfile(userId: string, updates: Partial<Profile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kullanıcı istatistiklerini getir
   */
  async getUserStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get user stats error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Profil fotoğrafı yükle
   */
  async uploadProfileImage(userId: string, file: File | Blob) {
    try {
      const fileExt = file.type.split('/')[1];
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Storage'a yükle
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Public URL al
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      // Profili güncelle
      const { data, error } = await supabase
        .from('profiles')
        .update({ profile_image: publicUrl })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Upload profile image error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kapak fotoğrafı yükle
   */
  async uploadCoverImage(userId: string, file: File | Blob) {
    try {
      const fileExt = file.type.split('/')[1];
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('covers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('covers').getPublicUrl(filePath);

      const { data, error } = await supabase
        .from('profiles')
        .update({ cover_image: publicUrl })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Upload cover image error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kullanıcı adını kontrol et (unique)
   */
  async checkUsernameAvailable(username: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (error) throw error;
      return { available: !data, error: null };
    } catch (error) {
      console.error('Check username error:', error);
      return { available: false, error: error as Error };
    }
  },

  /**
   * Kullanıcı ara
   */
  async searchUsers(searchTerm: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, profile_image, level')
        .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
        .limit(20);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Search users error:', error);
      return { data: null, error: error as Error };
    }
  },
};

