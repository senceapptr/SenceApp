import { supabase } from '@/lib/supabase';

// =====================================================
// NOTIFICATIONS SERVICE
// =====================================================

export type NotificationType =
  | 'prediction_won'
  | 'coupon_won'
  | 'daily_bonus'
  | 'friend_follow'
  | 'league_invite'
  | 'coupon_status'
  | 'prediction_added';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  data?: Record<string, any>;
}

export interface CreateNotificationData {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

/**
 * Notifications Service
 * Bildirim işlemleri
 */
export const notificationsService = {
  // =====================================================
  // CRUD OPERATIONS
  // =====================================================

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
        if (error.code === '42501') {
          throw new Error('RLS policy hatası: Kullanıcı bildirim oluşturamıyor.');
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

  // =====================================================
  // NOTIFICATION TYPE HELPERS
  // =====================================================

  /**
   * Tahmin kazandı bildirimi
   */
  async createPredictionWonNotification(userId: string, data: {
    questionTitle: string;
    reward: number;
    questionId?: string;
  }) {
    return this.createNotification({
      user_id: userId,
      type: 'prediction_won',
      title: 'Tahmin Kazandın! 🎯',
      message: `"${data.questionTitle}" tahmininden ${data.reward} kredi kazandın!`,
      data: {
        reward: data.reward,
        questionId: data.questionId,
      },
    });
  },

  /**
   * Kupon kazandı bildirimi
   */
  async createCouponWonNotification(userId: string, data: {
    reward: number;
    matchCount: number;
    couponId?: string;
  }) {
    return this.createNotification({
      user_id: userId,
      type: 'coupon_won',
      title: 'Kuponun Tuttu! 🎉',
      message: `${data.matchCount} maçlık kuponun tuttu! ${data.reward} kredi kazandın!`,
      data: {
        reward: data.reward,
        matchCount: data.matchCount,
        couponId: data.couponId,
      },
    });
  },

  /**
   * Günlük bonus bildirimi
   */
  async createDailyBonusNotification(userId: string) {
    return this.createNotification({
      user_id: userId,
      type: 'daily_bonus',
      title: 'Günlük Ödüller Yenilendi',
      message: 'Çark çevir ve günlük oyunlar seni bekliyor! Hemen gir, bonusunu kap.',
      data: {},
    });
  },

  /**
   * Yeni takipçi bildirimi
   */
  async createFriendFollowNotification(userId: string, data: {
    followerUsername: string;
    followerId: string;
    followerAvatar?: string;
  }) {
    return this.createNotification({
      user_id: userId,
      type: 'friend_follow',
      title: 'Yeni Takipçi',
      message: `@${data.followerUsername} seni takip etmeye başladı`,
      data: {
        userId: data.followerId,
        username: data.followerUsername,
        userAvatar: data.followerAvatar,
      },
    });
  },

  /**
   * Lige davet bildirimi
   */
  async createLeagueInviteNotification(userId: string, data: {
    leagueName: string;
    leagueId: string;
    inviterUsername?: string;
  }) {
    const message = data.inviterUsername
      ? `@${data.inviterUsername} seni "${data.leagueName}" ligine davet etti.`
      : `"${data.leagueName}" ligine davet edildin. Katılmak ister misin?`;

    return this.createNotification({
      user_id: userId,
      type: 'league_invite',
      title: 'Lige Davet Edildin',
      message,
      data: {
        leagueId: data.leagueId,
        leagueName: data.leagueName,
      },
    });
  },

  /**
   * Kupon durumu bildirimi (1 soru kaldı)
   */
  async createCouponStatusNotification(userId: string, data: {
    couponId: string;
    remainingQuestions: number;
  }) {
    return this.createNotification({
      user_id: userId,
      type: 'coupon_status',
      title: `Kuponunda ${data.remainingQuestions} Maç Kaldı!`,
      message: 'Son maç sonuçlanmak üzere. Kuponunu takip et!',
      data: {
        couponId: data.couponId,
        remainingQuestions: data.remainingQuestions,
      },
    });
  },

  /**
   * Yeni sorular eklendi bildirimi
   */
  async createPredictionAddedNotification(userId: string, data: {
    questionCount: number;
    categoryName?: string;
  }) {
    const categoryText = data.categoryName ? ` (${data.categoryName})` : '';
    return this.createNotification({
      user_id: userId,
      type: 'prediction_added',
      title: 'Yeni Sorular Eklendi',
      message: `İlgilenebileceğin ${data.questionCount} yeni soru eklendi${categoryText}. Hemen tahmin yap!`,
      data: {
        questionCount: data.questionCount,
        categoryName: data.categoryName,
      },
    });
  },

  // =====================================================
  // TEST HELPERS
  // =====================================================

  /**
   * Test için örnek bildirimler oluştur
   */
  async createTestNotifications(userId: string) {
    try {
      const testNotifications = [
        {
          user_id: userId,
          type: 'prediction_won' as NotificationType,
          title: 'Tahmin Kazandın! 🎯',
          message: '"Galatasaray maçı kazanacak mı?" tahmininden 250 kredi kazandın!',
          data: { reward: 250 },
        },
        {
          user_id: userId,
          type: 'coupon_won' as NotificationType,
          title: 'Kuponun Tuttu! 🎉',
          message: '5 maçlık kuponun tuttu! 1,250 kredi kazandın!',
          data: { reward: 1250 },
        },
        {
          user_id: userId,
          type: 'daily_bonus' as NotificationType,
          title: 'Günlük Ödüller Yenilendi',
          message: 'Çark çevir ve günlük oyunlar seni bekliyor!',
          data: {},
        },
        {
          user_id: userId,
          type: 'friend_follow' as NotificationType,
          title: 'Yeni Takipçi',
          message: '@ahmet_yilmaz seni takip etmeye başladı',
          data: { username: 'ahmet_yilmaz' },
        },
        {
          user_id: userId,
          type: 'league_invite' as NotificationType,
          title: 'Lige Davet Edildin',
          message: '"Spor Severler Ligi" ligine davet edildin.',
          data: { leagueName: 'Spor Severler Ligi' },
        },
        {
          user_id: userId,
          type: 'coupon_status' as NotificationType,
          title: 'Kuponunda 1 Maç Kaldı!',
          message: 'Son maç sonuçlanmak üzere. Kuponunu takip et!',
          data: {},
        },
        {
          user_id: userId,
          type: 'prediction_added' as NotificationType,
          title: 'Yeni Sorular Eklendi',
          message: 'İlgilenebileceğin 5 yeni soru eklendi. Hemen tahmin yap!',
          data: { questionCount: 5 },
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