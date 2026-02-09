// =====================================================
// NOTIFICATIONS PAGE - UTILS
// =====================================================

import { Notification, NotificationType, NotificationConfig, NotificationCategory } from './types';

// Notification type configurations
export const NOTIFICATION_CONFIGS: Record<NotificationType, NotificationConfig> = {
  prediction_won: {
    icon: '🎯',
    colors: ['#10B981', '#059669'] as const,
    category: 'rewards',
  },
  coupon_won: {
    icon: '🎫',
    colors: ['#F59E0B', '#D97706'] as const,
    category: 'rewards',
  },
  daily_bonus: {
    icon: '🎰',
    colors: ['#8B5CF6', '#7C3AED'] as const,
    category: 'rewards',
  },
  friend_follow: {
    icon: '👤',
    colors: ['#3B82F6', '#2563EB'] as const,
    category: 'social',
  },
  league_invite: {
    icon: '🏆',
    colors: ['#432870', '#6B21A8'] as const,
    category: 'social',
  },
  coupon_status: {
    icon: '⏰',
    colors: ['#F97316', '#EA580C'] as const,
    category: 'system',
  },
  prediction_added: {
    icon: '✨',
    colors: ['#432870', '#7C3AED'] as const,
    category: 'system',
  },
};

export const FILTER_TABS = [
  { key: 'all' as NotificationCategory, label: 'Tümü' },
  { key: 'rewards' as NotificationCategory, label: 'Kazançlar' },
  { key: 'social' as NotificationCategory, label: 'Sosyal' },
  { key: 'system' as NotificationCategory, label: 'Sistem' },
];

/**
 * Get notification config by type
 */
export const getNotificationConfig = (type: NotificationType): NotificationConfig => {
  return NOTIFICATION_CONFIGS[type] || NOTIFICATION_CONFIGS.prediction_added;
};

/**
 * Filter notifications by category
 */
export const filterNotificationsByCategory = (
  notifications: Notification[],
  category: NotificationCategory
): Notification[] => {
  if (category === 'all') return notifications;
  return notifications.filter(n => getNotificationConfig(n.type).category === category);
};

/**
 * Group notifications by date sections
 */
export const groupNotificationsByDateSection = (notifications: Notification[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const sections = {
    today: [] as Notification[],
    yesterday: [] as Notification[],
    thisWeek: [] as Notification[],
    older: [] as Notification[],
  };

  notifications.forEach(notification => {
    const notifDate = new Date(notification.created_at);
    const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

    if (notifDay.getTime() === today.getTime()) {
      sections.today.push(notification);
    } else if (notifDay.getTime() === yesterday.getTime()) {
      sections.yesterday.push(notification);
    } else if (notifDay >= weekAgo) {
      sections.thisWeek.push(notification);
    } else {
      sections.older.push(notification);
    }
  });

  return sections;
};

/**
 * Format time ago string
 */
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
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

/**
 * Get unread count
 */
export const getUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter(n => !n.read).length;
};

/**
 * Mock notifications for development
 */
export const mockNotifications: Notification[] = [
  {
    id: 'mock-1',
    type: 'prediction_won',
    title: 'Tahmin Kazandın!',
    message: '"Galatasaray maçı kazanacak mı?" tahmininden 250 kredi kazandın!',
    time: '5 dk önce',
    read: false,
    data: { reward: 250, questionId: 'q1' },
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'mock-2',
    type: 'coupon_won',
    title: 'Kuponun Tuttu! 🎉',
    message: '5 maçlık kuponun tuttu! 1,250 kredi kazandın!',
    time: '1 saat önce',
    read: false,
    data: { reward: 1250, couponId: 'c1' },
    created_at: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: 'mock-3',
    type: 'daily_bonus',
    title: 'Günlük Ödüller Yenilendi',
    message: 'Çark çevir ve günlük oyunlar seni bekliyor! Hemen gir, bonusunu kap.',
    time: '2 saat önce',
    read: false,
    data: {},
    created_at: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
  },
  {
    id: 'mock-4',
    type: 'friend_follow',
    title: 'Yeni Takipçi',
    message: '@ahmet_yilmaz seni takip etmeye başladı',
    time: '3 saat önce',
    read: true,
    data: { userId: 'u1', username: 'ahmet_yilmaz' },
    created_at: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
  },
  {
    id: 'mock-5',
    type: 'league_invite',
    title: 'Lige Davet Edildin',
    message: '"Spor Severler Ligi" ligine davet edildin. Katılmak ister misin?',
    time: 'Dün',
    read: true,
    data: { leagueId: 'l1', leagueName: 'Spor Severler Ligi' },
    created_at: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
  },
  {
    id: 'mock-6',
    type: 'coupon_status',
    title: 'Kuponunda 1 Maç Kaldı!',
    message: 'Son maç sonuçlanmak üzere. Kuponunu takip et!',
    time: 'Dün',
    read: true,
    data: { couponId: 'c2' },
    created_at: new Date(Date.now() - 26 * 60 * 60000).toISOString(),
  },
  {
    id: 'mock-7',
    type: 'prediction_added',
    title: 'Yeni Sorular Eklendi',
    message: 'İlgilenebileceğin 5 yeni soru eklendi. Hemen tahmin yap!',
    time: '2 gün önce',
    read: true,
    data: {},
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
  },
];
