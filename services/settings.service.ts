import { supabase } from '@/lib/supabase';

export interface UserSettings {
  id: string;
  user_id: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  sound_enabled: boolean;
  vibration_enabled: boolean;
  language: string;
  theme: 'light' | 'dark' | 'system';
  privacy_level: 'public' | 'friends' | 'private';
  show_online_status: boolean;
  allow_friend_requests: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationSettings {
  id: string;
  user_id: string;
  prediction_results: boolean;
  coupon_results: boolean;
  league_updates: boolean;
  task_completions: boolean;
  friend_requests: boolean;
  system_announcements: boolean;
  marketing_emails: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Settings Service
 * Kullanıcı ayarları işlemleri
 */
export const settingsService = {
  /**
   * Kullanıcı ayarlarını getir
   */
  async getUserSettings(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get user settings error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kullanıcı ayarlarını güncelle
   */
  async updateUserSettings(userId: string, settings: Partial<UserSettings>) {
    try {
      // Önce mevcut ayarları kontrol et
      const { data: existingSettings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existingSettings) {
        // Mevcut ayarları güncelle
        const { data, error } = await supabase
          .from('user_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } else {
        // Yeni ayarlar oluştur
        const { data, error } = await supabase
          .from('user_settings')
          .insert({
            user_id: userId,
            ...settings
          })
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      }
    } catch (error) {
      console.error('Update user settings error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Bildirim ayarlarını getir
   */
  async getNotificationSettings(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get notification settings error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Bildirim ayarlarını güncelle
   */
  async updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>) {
    try {
      // Önce mevcut ayarları kontrol et
      const { data: existingSettings } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existingSettings) {
        // Mevcut ayarları güncelle
        const { data, error } = await supabase
          .from('notification_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } else {
        // Yeni ayarlar oluştur
        const { data, error } = await supabase
          .from('notification_settings')
          .insert({
            user_id: userId,
            ...settings
          })
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      }
    } catch (error) {
      console.error('Update notification settings error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Varsayılan ayarları oluştur
   */
  async createDefaultSettings(userId: string) {
    try {
      // Varsayılan kullanıcı ayarları
      const defaultUserSettings = {
        user_id: userId,
        notifications_enabled: true,
        email_notifications: true,
        push_notifications: true,
        sound_enabled: true,
        vibration_enabled: true,
        language: 'tr',
        theme: 'system' as const,
        privacy_level: 'public' as const,
        show_online_status: true,
        allow_friend_requests: true
      };

      // Varsayılan bildirim ayarları
      const defaultNotificationSettings = {
        user_id: userId,
        prediction_results: true,
        coupon_results: true,
        league_updates: true,
        task_completions: true,
        friend_requests: true,
        system_announcements: true,
        marketing_emails: false
      };

      const [userSettingsResult, notificationSettingsResult] = await Promise.all([
        supabase.from('user_settings').insert(defaultUserSettings),
        supabase.from('notification_settings').insert(defaultNotificationSettings)
      ]);

      if (userSettingsResult.error) throw userSettingsResult.error;
      if (notificationSettingsResult.error) throw notificationSettingsResult.error;

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Create default settings error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Tema ayarını güncelle
   */
  async updateTheme(userId: string, theme: 'light' | 'dark' | 'system') {
    try {
      const result = await this.updateUserSettings(userId, { theme });
      return result;
    } catch (error) {
      console.error('Update theme error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Bildirim ayarını güncelle
   */
  async updateNotificationSetting(userId: string, setting: keyof NotificationSettings, value: boolean) {
    try {
      const result = await this.updateNotificationSettings(userId, { [setting]: value });
      return result;
    } catch (error) {
      console.error('Update notification setting error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Dil ayarını güncelle
   */
  async updateLanguage(userId: string, language: string) {
    try {
      const result = await this.updateUserSettings(userId, { language });
      return result;
    } catch (error) {
      console.error('Update language error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Gizlilik ayarını güncelle
   */
  async updatePrivacyLevel(userId: string, privacyLevel: 'public' | 'friends' | 'private') {
    try {
      const result = await this.updateUserSettings(userId, { privacy_level: privacyLevel });
      return result;
    } catch (error) {
      console.error('Update privacy level error:', error);
      return { data: null, error: error as Error };
    }
  }
};

