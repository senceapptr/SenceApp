import { supabase } from '@/lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  type: 'prediction' | 'league' | 'friend' | 'system';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  data?: any; // Additional notification data
}

export interface CreateNotificationData {
  user_id: string;
  type: 'prediction' | 'league' | 'friend' | 'system';
  title: string;
  message: string;
  data?: any;
}

export interface MarkAsReadData {
  notification_id: string;
  user_id: string;
}

/**
 * Notifications Service
 * Bildirim işlemleri
 */
export const notificationsService = {
  /**
   * Kullanıcının bildirimlerini getir
   */
  async getUserNotifications(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get user notifications error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Okunmamış bildirimleri getir
   */
  async getUnreadNotifications(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get unread notifications error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Bildirim oluştur
   */
  async createNotification(notificationData: CreateNotificationData) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notificationData)
        .select()
        .single();

      if (error) {
        console.error('Create notification error:', error);
        // RLS hatası için özel mesaj
        if (error.code === '42501') {
          throw new Error('RLS policy hatası: Kullanıcı bildirim oluşturamıyor. Lütfen RLS policy\'lerini kontrol edin.');
        }
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Create notification error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Bildirimi okundu olarak işaretle
   */
  async markAsRead(notificationId: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Mark notification as read error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Tüm bildirimleri okundu olarak işaretle
   */
  async markAllAsRead(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Bildirimi sil
   */
  async deleteNotification(notificationId: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Delete notification error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Tüm bildirimleri sil
   */
  async deleteAllNotifications(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Delete all notifications error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Okunmamış bildirim sayısını getir
   */
  async getUnreadCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return { data: count || 0, error: null };
    } catch (error) {
      console.error('Get unread count error:', error);
      return { data: 0, error: error as Error };
    }
  },

  /**
   * Tahmin sonucu bildirimi oluştur
   */
  async createPredictionNotification(userId: string, predictionResult: {
    questionTitle: string;
    isCorrect: boolean;
    reward?: number;
  }) {
    const type = 'prediction';
    const title = predictionResult.isCorrect ? 'Tahmin Sonuçlandı' : 'Tahmin Kaybı';
    const message = predictionResult.isCorrect 
      ? `"${predictionResult.questionTitle}" tahminin doğru çıktı!`
      : `"${predictionResult.questionTitle}" tahminin yanlış çıktı`;
    
    const rewardText = predictionResult.reward ? ` +${predictionResult.reward} kredi` : '';

    return this.createNotification({
      user_id: userId,
      type,
      title,
      message: message + rewardText,
      data: {
        questionTitle: predictionResult.questionTitle,
        isCorrect: predictionResult.isCorrect,
        reward: predictionResult.reward,
      },
    });
  },

  /**
   * Lig bildirimi oluştur
   */
  async createLeagueNotification(userId: string, leagueData: {
    leagueName: string;
    action: 'rank_up' | 'rank_down' | 'league_completed' | 'new_member';
    rank?: number;
    reward?: number;
  }) {
    const type = 'league';
    let title = 'Lig Güncellemesi';
    let message = '';

    switch (leagueData.action) {
      case 'rank_up':
        title = 'Liga Sıralaması';
        message = `${leagueData.leagueName} liginde ${leagueData.rank}. sıraya yükseldin!`;
        break;
      case 'rank_down':
        title = 'Liga Sıralaması';
        message = `${leagueData.leagueName} liginde ${leagueData.rank}. sıraya düştün`;
        break;
      case 'league_completed':
        title = 'Lig Tamamlandı';
        message = `${leagueData.leagueName} liginde 1. oldun! Ödülün hazır`;
        if (leagueData.reward) {
          message += ` +${leagueData.reward} kredi`;
        }
        break;
      case 'new_member':
        title = 'Yeni Lig Üyesi';
        message = `${leagueData.leagueName} ligine yeni bir üye katıldı`;
        break;
    }

    return this.createNotification({
      user_id: userId,
      type,
      title,
      message,
      data: leagueData,
    });
  },

  /**
   * Sistem bildirimi oluştur
   */
  async createSystemNotification(userId: string, systemData: {
    type: 'daily_bonus' | 'security_warning' | 'maintenance' | 'update';
    title: string;
    message: string;
    reward?: number;
  }) {
    const type = 'system';
    let message = systemData.message;
    
    if (systemData.reward) {
      message += ` +${systemData.reward} kredi`;
    }

    return this.createNotification({
      user_id: userId,
      type,
      title: systemData.title,
      message,
      data: systemData,
    });
  },

  /**
   * Arkadaş bildirimi oluştur
   */
  async createFriendNotification(userId: string, friendData: {
    action: 'follow' | 'unfollow' | 'challenge';
    friendUsername: string;
    friendId: string;
  }) {
    const type = 'friend';
    let title = 'Arkadaş Aktivitesi';
    let message = '';

    switch (friendData.action) {
      case 'follow':
        title = 'Yeni Takipçi';
        message = `${friendData.friendUsername} seni takip etmeye başladı`;
        break;
      case 'unfollow':
        title = 'Takipçi Kaybı';
        message = `${friendData.friendUsername} seni takip etmeyi bıraktı`;
        break;
      case 'challenge':
        title = 'Yeni Meydan Okuma';
        message = `${friendData.friendUsername} sana meydan okudu`;
        break;
    }

    return this.createNotification({
      user_id: userId,
      type,
      title,
      message,
      data: friendData,
    });
  },

  /**
   * Test için örnek bildirimler oluştur
   */
  async createTestNotifications(userId: string) {
    try {
      // Önce mevcut bildirimleri kontrol et
      const { data: existingNotifications } = await this.getUserNotifications(userId);
      
      if (existingNotifications && existingNotifications.length > 0) {
        console.log('User already has notifications, not creating duplicates');
        return { data: existingNotifications, error: null };
      }

      const testNotifications = [
        {
          user_id: userId,
          type: 'prediction' as const,
          title: 'Tahmin Sonuçlandı',
          message: '"Galatasaray şampiyonluk yaşayacak mı?" tahminin doğru çıktı!',
          data: {
            questionTitle: 'Galatasaray şampiyonluk yaşayacak mı?',
            isCorrect: true,
            reward: 250,
          },
        },
        {
          user_id: userId,
          type: 'league' as const,
          title: 'Liga Sıralaması',
          message: 'Spor liginde 3. sıraya yükseldin!',
          data: {
            leagueName: 'Spor Ligi',
            action: 'rank_up',
            rank: 3,
          },
        },
        {
          user_id: userId,
          type: 'friend' as const,
          title: 'Yeni Takipçi',
          message: 'ahmet_bey seni takip etmeye başladı',
          data: {
            action: 'follow',
            friendUsername: 'ahmet_bey',
            friendId: 'friend-uuid-123',
          },
        },
        {
          user_id: userId,
          type: 'system' as const,
          title: 'Günlük Bonus',
          message: 'Günlük giriş bonusun hazır! 100 kredi kazandın',
          data: {
            type: 'daily_bonus',
            reward: 100,
          },
        },
      ];

      const results = [];
      for (const notification of testNotifications) {
        const result = await this.createNotification(notification);
        if (result.data) {
          results.push(result.data);
        }
      }

      return { data: results, error: null };
    } catch (error) {
      console.error('Create test notifications error:', error);
      return { data: null, error: error as Error };
    }
  },
};