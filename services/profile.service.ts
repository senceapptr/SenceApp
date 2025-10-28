import { supabase } from '@/lib/supabase';
import { storageService } from './storage.service';

export interface ProfileUpdateData {
  username?: string;
  full_name?: string;
  bio?: string;
  profile_image?: string;
  cover_image?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  email: string;
  profile_image: string;
  cover_image: string;
  credits: number;
  level: number;
  experience: number;
  created_at: string;
  updated_at: string;
}

export const profileService = {
  /**
   * Kullanıcı profilini getir
   */
  async getProfile(userId: string): Promise<{ data: UserProfile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Get profile error:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get profile error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kullanıcı profilini güncelle
   */
  async updateProfile(userId: string, updates: ProfileUpdateData): Promise<{ data: UserProfile | null; error: Error | null }> {
    try {
      const { data, error } = await (supabase
        .from('profiles') as any)
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Update profile error:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kullanıcı adının benzersizliğini kontrol et
   */
  async checkUsernameAvailability(username: string, currentUserId: string): Promise<{ available: boolean; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', currentUserId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Kullanıcı adı bulunamadı, yani mevcut
        return { available: true, error: null };
      }

      if (error) {
        console.error('Check username error:', error);
        return { available: false, error };
      }

      // Kullanıcı adı bulundu, yani mevcut değil
      return { available: false, error: null };
    } catch (error) {
      console.error('Check username error:', error);
      return { available: false, error: error as Error };
    }
  },

  /**
   * Profil istatistiklerini getir
   */
  async getProfileStats(userId: string): Promise<{ data: any; error: Error | null }> {
    try {
      // Tahmin sayısı
      const { data: predictions, error: predictionsError } = await supabase
        .from('predictions')
        .select('id')
        .eq('user_id', userId);

      if (predictionsError) {
        console.error('Get predictions error:', predictionsError);
        return { data: null, error: predictionsError };
      }

      // Doğru tahmin sayısı
      const { data: correctPredictions, error: correctError } = await supabase
        .from('predictions')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'won');

      if (correctError) {
        console.error('Get correct predictions error:', correctError);
        return { data: null, error: correctError };
      }

      // Toplam kazanç
      const { data: earnings, error: earningsError } = await supabase
        .from('predictions')
        .select('potential_win')
        .eq('user_id', userId)
        .eq('status', 'won')
        .not('potential_win', 'is', null);

      if (earningsError) {
        console.error('Get earnings error:', earningsError);
        return { data: null, error: earningsError };
      }

      const totalEarnings = earnings?.reduce((sum, pred: any) => sum + (pred.potential_win || 0), 0) || 0;

      const stats = {
        totalPredictions: predictions?.length || 0,
        correctPredictions: correctPredictions?.length || 0,
        accuracyRate: predictions?.length > 0 ? (correctPredictions?.length || 0) / predictions.length : 0,
        totalEarnings,
        longestStreak: 0, // TODO: Implement streak calculation
        currentStreak: 0, // TODO: Implement streak calculation
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Get profile stats error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kullanıcı hesabını sil
   */
  async deleteAccount(userId: string): Promise<{ error: Error | null }> {
    try {
      // Önce auth'dan sil
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) {
        console.error('Delete auth user error:', authError);
        return { error: authError };
      }

      return { error: null };
    } catch (error) {
      console.error('Delete account error:', error);
      return { error: error as Error };
    }
  },

  /**
   * Profil fotoğrafını yükle
   */
  async uploadProfileImage(userId: string, imageUri: string): Promise<{ data: string | null; error: Error | null }> {
    try {
      return await storageService.uploadProfileImage(userId, imageUri);
    } catch (error) {
      console.error('Upload profile image error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kapak fotoğrafını yükle
   */
  async uploadCoverImage(userId: string, imageUri: string): Promise<{ data: string | null; error: Error | null }> {
    try {
      return await storageService.uploadCoverImage(userId, imageUri);
    } catch (error) {
      console.error('Upload cover image error:', error);
      return { data: null, error: error as Error };
    }
  },
};