// =====================================================
// NOTIFICATIONS PAGE - TYPES
// =====================================================

/**
 * 7 Bildirim Türü:
 * - prediction_won: Tahmin kazandı
 * - coupon_won: Kupon kazandı  
 * - daily_bonus: Çark ve günlük oyunlar yenilendi
 * - friend_follow: Yeni takipçi
 * - league_invite: Lige davet
 * - coupon_status: Kuponda 1 soru kaldı
 * - prediction_added: Yeni sorular eklendi
 */
export type NotificationType =
  | 'prediction_won'
  | 'coupon_won'
  | 'daily_bonus'
  | 'friend_follow'
  | 'league_invite'
  | 'coupon_status'
  | 'prediction_added';

export type NotificationCategory = 'all' | 'rewards' | 'social' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  data?: {
    // Prediction/Coupon related
    questionId?: string;
    couponId?: string;
    reward?: number;
    // Social related
    userId?: string;
    username?: string;
    userAvatar?: string;
    // League related
    leagueId?: string;
    leagueName?: string;
    // General
    actionUrl?: string;
  };
  created_at: string;
}

// UI Configuration for each notification type
export interface NotificationConfig {
  icon: string;
  colors: readonly [string, string];
  category: NotificationCategory;
}

export interface NotificationsPageProps {
  isOpen?: boolean;
  onClose?: () => void;
  onBack?: () => void;
  onMenuToggle?: () => void;
}

export interface NotificationCardProps {
  notification: Notification;
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}

export interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  variant?: 'page' | 'modal';
}

export interface EmptyStateProps {
  variant?: 'page' | 'modal';
}

export interface FilterTab {
  key: NotificationCategory;
  label: string;
}
