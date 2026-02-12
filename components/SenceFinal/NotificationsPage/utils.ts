// =====================================================
// NOTIFICATIONS PAGE - UTILS
// =====================================================

import {
  FilterTab,
  Notification,
  NotificationConfig,
  NotificationFilter,
  NotificationRoute,
  NotificationType,
} from './types';

const FALLBACK_TYPE: NotificationType = 'prediction_added';

const NOTIFICATION_CONFIGS: Record<NotificationType, NotificationConfig> = {
  coupon_status: {
    iconName: 'time-outline',
    tintColor: '#FB923C',
  },
  coupon_won: {
    iconName: 'ticket-outline',
    tintColor: '#FBBF24',
  },
  daily_bonus: {
    iconName: 'gift-outline',
    tintColor: '#F59E0B',
  },
  friend_follow: {
    iconName: 'person-add-outline',
    tintColor: '#F472B6',
  },
  league_invite: {
    iconName: 'trophy-outline',
    tintColor: '#A78BFA',
  },
  prediction_added: {
    iconName: 'flash-outline',
    tintColor: '#2DD4BF',
  },
  prediction_won: {
    iconName: 'checkmark-circle-outline',
    tintColor: '#34D399',
  },
};

export const FILTER_TABS: FilterTab[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'unread', label: 'Okunmamış' },
];

const LEGACY_NOTIFICATION_TYPE_MAP: Record<string, NotificationType> = {
  achievement: 'daily_bonus',
  coupon: 'coupon_won',
  coupon_result: 'coupon_won',
  friend: 'friend_follow',
  league: 'league_invite',
  league_update: 'league_invite',
  prediction: 'prediction_won',
  prediction_result: 'prediction_won',
  social: 'friend_follow',
  system: 'daily_bonus',
  task_complete: 'daily_bonus',
};

export const normalizeNotificationType = (rawType?: string | null): NotificationType => {
  if (!rawType) return FALLBACK_TYPE;
  if (rawType in NOTIFICATION_CONFIGS) return rawType as NotificationType;
  return LEGACY_NOTIFICATION_TYPE_MAP[rawType] || FALLBACK_TYPE;
};

export const getNotificationConfig = (type: NotificationType): NotificationConfig => {
  return NOTIFICATION_CONFIGS[type] || NOTIFICATION_CONFIGS[FALLBACK_TYPE];
};

export const filterNotifications = (notifications: Notification[], filter: NotificationFilter): Notification[] => {
  if (filter === 'unread') {
    return notifications.filter(notification => !notification.read);
  }
  return notifications;
};

export const groupNotificationsByDateSection = (notifications: Notification[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const sections = {
    older: [] as Notification[],
    thisWeek: [] as Notification[],
    today: [] as Notification[],
    yesterday: [] as Notification[],
  };

  notifications.forEach(notification => {
    const date = new Date(notification.created_at);
    if (Number.isNaN(date.getTime())) {
      sections.older.push(notification);
      return;
    }

    const notifDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (notifDay.getTime() === today.getTime()) {
      sections.today.push(notification);
      return;
    }

    if (notifDay.getTime() === yesterday.getTime()) {
      sections.yesterday.push(notification);
      return;
    }

    if (notifDay >= weekAgo) {
      sections.thisWeek.push(notification);
      return;
    }

    sections.older.push(notification);
  });

  return sections;
};

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return 'Bilinmiyor';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Şimdi';
  if (diffMins < 60) return `${diffMins} dk önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays < 7) return `${diffDays} gün önce`;

  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
};

export const getUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter(notification => !notification.read).length;
};

export const sortNotificationsByDateDesc = (notifications: Notification[]): Notification[] => {
  return [...notifications].sort((a, b) => {
    const aTime = new Date(a.created_at).getTime();
    const bTime = new Date(b.created_at).getTime();
    if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
    if (Number.isNaN(aTime)) return 1;
    if (Number.isNaN(bTime)) return -1;
    return bTime - aTime;
  });
};

interface ResolveNotificationActionArgs {
  notification: Notification;
  onOpenQuestionDetail?: (questionId: string) => void;
  onNavigateToPage?: (page: NotificationRoute) => void;
}

export const resolveNotificationAction = ({
  notification,
  onNavigateToPage,
  onOpenQuestionDetail,
}: ResolveNotificationActionArgs): boolean => {
  const payload = notification.data;

  if (!payload) {
    return false;
  }

  switch (notification.type) {
    case 'prediction_won':
    case 'prediction_added':
      if (payload.questionId && onOpenQuestionDetail) {
        onOpenQuestionDetail(payload.questionId);
        return true;
      }
      return false;

    case 'coupon_won':
    case 'coupon_status':
      if (payload.couponId && onNavigateToPage) {
        onNavigateToPage('coupons');
        return true;
      }
      return false;

    case 'league_invite':
      if (payload.leagueId && onNavigateToPage) {
        onNavigateToPage('leagues');
        return true;
      }
      return false;

    case 'daily_bonus':
      if (onNavigateToPage) {
        onNavigateToPage('gameHub');
        return true;
      }
      return false;

    case 'friend_follow':
    default:
      return false;
  }
};
