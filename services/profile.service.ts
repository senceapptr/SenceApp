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

export interface AccountDeletionResult {
  success: boolean;
  code:
    | 'OK'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'FUNCTION_ERROR'
    | 'NETWORK_ERROR'
    | 'UNKNOWN_ERROR';
  message: string;
  error: Error | null;
}

export const profileService = {
  mapProfileRow(profileRow: any): UserProfile {
    const nowIso = new Date().toISOString();
    return {
      bio: profileRow?.bio ?? '',
      cover_image: profileRow?.cover_image ?? '',
      created_at: profileRow?.created_at ?? nowIso,
      credits: profileRow?.credits ?? 0,
      email: profileRow?.email ?? '',
      experience: profileRow?.experience ?? 0,
      full_name: profileRow?.full_name ?? '',
      id: profileRow?.id ?? '',
      level: profileRow?.level ?? 1,
      profile_image: profileRow?.profile_image ?? '',
      updated_at: profileRow?.updated_at ?? nowIso,
      username: profileRow?.username ?? '',
    };
  },

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

      return { data: this.mapProfileRow(data), error: null };
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

      return { data: this.mapProfileRow(data), error: null };
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

  async checkUsernameAvailable(username: string, currentUserId: string): Promise<{ available: boolean; error: Error | null }> {
    return this.checkUsernameAvailability(username, currentUserId);
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
        longestStreak: 0, // Streak hesaplama sonraki iterasyonda eklenecek.
        currentStreak: 0, // Streak hesaplama sonraki iterasyonda eklenecek.
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
  async deleteAccount(userId: string): Promise<AccountDeletionResult> {
    try {
      const { data, error } = await supabase.functions.invoke<{
        code?: string;
        message?: string;
        success?: boolean;
      }>('delete-account', {
        body: { userId },
      });

      if (error) {
        console.error('Delete account function error:', error);
        return {
          code: 'FUNCTION_ERROR',
          error,
          message: 'Hesap silme işlemi başlatılamadı. Lütfen tekrar deneyin.',
          success: false,
        };
      }

      const success = Boolean(data?.success ?? true);
      return {
        code: success ? 'OK' : ((data?.code as AccountDeletionResult['code']) ?? 'UNKNOWN_ERROR'),
        error: null,
        message: data?.message || (success ? 'Hesabınız başarıyla silindi.' : 'Hesap silme işlemi tamamlanamadı.'),
        success,
      };
    } catch (error) {
      console.error('Delete account error:', error);
      return {
        code: 'NETWORK_ERROR',
        error: error as Error,
        message: 'Ağ hatası nedeniyle hesap silme işlemi tamamlanamadı.',
        success: false,
      };
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

  // ===== FOLLOW SYSTEM =====

  /**
   * Kullanıcıyı takip et
   */
  async followUser(followingId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: new Error('User not authenticated') };
      }

      if (user.id === followingId) {
        return { success: false, error: new Error('Cannot follow yourself') };
      }

      const { error } = await supabase
        .from('followers')
        .insert({
          follower_id: user.id,
          following_id: followingId,
        });

      if (error) {
        // Duplicate follow error is acceptable
        if (error.code === '23505') {
          return { success: true, error: null };
        }
        console.error('Follow user error:', error);
        return { success: false, error };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Follow user error:', error);
      return { success: false, error: error as Error };
    }
  },

  /**
   * Kullanıcıyı takipten çık
   */
  async unfollowUser(followingId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: new Error('User not authenticated') };
      }

      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', followingId);

      if (error) {
        console.error('Unfollow user error:', error);
        return { success: false, error };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Unfollow user error:', error);
      return { success: false, error: error as Error };
    }
  },

  /**
   * Takip durumunu kontrol et
   */
  async isFollowing(followingId: string): Promise<{ isFollowing: boolean; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { isFollowing: false, error: null };
      }

      const { data, error } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', followingId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Not found - not following
        return { isFollowing: false, error: null };
      }

      if (error) {
        console.error('Check following error:', error);
        return { isFollowing: false, error };
      }

      return { isFollowing: !!data, error: null };
    } catch (error) {
      console.error('Check following error:', error);
      return { isFollowing: false, error: error as Error };
    }
  },

  /**
   * Takipçi sayısını getir
   */
  async getFollowerCount(userId: string): Promise<{ count: number; error: Error | null }> {
    try {
      const { count, error } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);

      if (error) {
        console.error('Get follower count error:', error);
        return { count: 0, error };
      }

      return { count: count || 0, error: null };
    } catch (error) {
      console.error('Get follower count error:', error);
      return { count: 0, error: error as Error };
    }
  },

  /**
   * Takip edilen sayısını getir
   */
  async getFollowingCount(userId: string): Promise<{ count: number; error: Error | null }> {
    try {
      const { count, error } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);

      if (error) {
        console.error('Get following count error:', error);
        return { count: 0, error };
      }

      return { count: count || 0, error: null };
    } catch (error) {
      console.error('Get following count error:', error);
      return { count: 0, error: error as Error };
    }
  },

  /**
   * Takipçi listesi (beni takip edenler)
   */
  async getFollowersList(userId: string): Promise<{ data: { id: string; username: string; profile_image: string | null; full_name: string | null }[]; error: Error | null }> {
    try {
      const { data: rows, error: followError } = await supabase
        .from('followers')
        .select('follower_id')
        .eq('following_id', userId);

      if (followError || !rows?.length) {
        return { data: [], error: followError || null };
      }

      const ids = rows.map((r: { follower_id: string }) => r.follower_id);
      const { data: profiles, error: profError } = await supabase
        .from('profiles')
        .select('id, username, profile_image, full_name')
        .in('id', ids);

      if (profError) {
        console.error('Get followers profiles error:', profError);
        return { data: [], error: profError };
      }

      return { data: profiles || [], error: null };
    } catch (error) {
      console.error('Get followers list error:', error);
      return { data: [], error: error as Error };
    }
  },

  /**
   * Takip listesi (benim takip ettiklerim)
   */
  async getFollowingList(userId: string): Promise<{ data: { id: string; username: string; profile_image: string | null; full_name: string | null }[]; error: Error | null }> {
    try {
      const { data: rows, error: followError } = await supabase
        .from('followers')
        .select('following_id')
        .eq('follower_id', userId);

      if (followError || !rows?.length) {
        return { data: [], error: followError || null };
      }

      const ids = rows.map((r: { following_id: string }) => r.following_id);
      const { data: profiles, error: profError } = await supabase
        .from('profiles')
        .select('id, username, profile_image, full_name')
        .in('id', ids);

      if (profError) {
        console.error('Get following profiles error:', profError);
        return { data: [], error: profError };
      }

      return { data: profiles || [], error: null };
    } catch (error) {
      console.error('Get following list error:', error);
      return { data: [], error: error as Error };
    }
  },

  /**
   * Takip et/çık toggle
   */
  async toggleFollow(userId: string): Promise<{ isFollowing: boolean; error: Error | null }> {
    try {
      const { isFollowing: currentlyFollowing } = await this.isFollowing(userId);
      
      if (currentlyFollowing) {
        const { error } = await this.unfollowUser(userId);
        if (error) return { isFollowing: true, error };
        return { isFollowing: false, error: null };
      } else {
        const { error } = await this.followUser(userId);
        if (error) return { isFollowing: false, error };
        return { isFollowing: true, error: null };
      }
    } catch (error) {
      console.error('Toggle follow error:', error);
      return { isFollowing: false, error: error as Error };
    }
  },
};
