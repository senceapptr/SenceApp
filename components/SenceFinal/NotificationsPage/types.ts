// =====================================================
// NOTIFICATIONS PAGE - TYPES
// =====================================================

export type NotificationType =
  | 'prediction_won'
  | 'coupon_won'
  | 'daily_bonus'
  | 'friend_follow'
  | 'league_invite'
  | 'coupon_status'
  | 'prediction_added';

export type NotificationFilter = 'all' | 'unread';

export type NotificationRoute = 'coupons' | 'leagues' | 'gameHub' | 'profile' | 'newDiscover';

export interface Notification {
  id: string;
  time: string;
  title: string;
  read: boolean;
  message: string;
  created_at: string;
  type: NotificationType;
  data?: {
    questionId?: string;
    couponId?: string;
    reward?: number;
    userId?: string;
    username?: string;
    userAvatar?: string;
    leagueId?: string;
    leagueName?: string;
    actionUrl?: string;
  };
}

export interface NotificationConfig {
  iconName: string;
  tintColor: string;
}

export interface NotificationsPageProps {
  isOpen?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  onMenuToggle?: () => void;
  onOpenQuestionDetail?: (questionId: string) => void;
  onNavigateToPage?: (page: NotificationRoute) => void;
}

export interface NotificationCardProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
}

export interface NotificationsListProps {
  refreshing?: boolean;
  onRefresh?: () => void;
  notifications: Notification[];
  onPress: (notification: Notification) => void;
  onDelete: (notification: Notification) => void;
}

export interface EmptyStateProps {
  title: string;
  message: string;
}

export interface FilterTab {
  label: string;
  key: NotificationFilter;
}
