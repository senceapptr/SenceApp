import { supabase } from '@/lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  type: 'prediction_result' | 'coupon_result' | 'league_update' | 'task_complete' | 'system' | 'achievement' | 'social';
  title: string;
  message: string;
  data: any;
  is_read: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  action_url: string | null;
  created_at: string;
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
   * Okunmamış bildirim sayısı
   */
  async getUnreadCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return { count: count || 0, error: null };
    } catch (error) {
      console.error('Get unread count error:', error);
      return { count: 0, error: error as Error };
    }
  },

  /**
   * Bildirimi okundu olarak işaretle
   */
  async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Mark as read error:', error);
      return { error: error as Error };
    }
  },

  /**
   * Tüm bildirimleri okundu olarak işaretle
   */
  async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Mark all as read error:', error);
      return { error: error as Error };
    }
  },

  /**
   * Bildirimi sil
   */
  async deleteNotification(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Delete notification error:', error);
      return { error: error as Error };
    }
  },

  /**
   * Tüm bildirimleri sil
   */
  async deleteAllNotifications(userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Delete all notifications error:', error);
      return { error: error as Error };
    }
  },

  /**
   * Real-time bildirim güncellemelerini dinle
   */
  subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();

    return channel;
  },
};

