import { Notification, NotificationType, NotificationColors } from './types';

// Mock notifications data
export const mockNotifications: Notification[] = [
  {
    id: 'mock-1',
    type: 'prediction',
    title: 'Tahmin Sonuçlandı',
    message: '"Galatasaray şampiyonluk yaşayacak mı?" tahminin doğru çıktı!',
    time: '2 dk önce',
    read: false,
    icon: '🎯',
    color: ['#10B981', '#059669'],
    reward: '+250 kredi'
  },
  {
    id: 'mock-2',
    type: 'league',
    title: 'Liga Sıralaması',
    message: 'Spor liginde 3. sıraya yükseldin!',
    time: '15 dk önce',
    read: false,
    icon: '🏆',
    color: ['#432870', '#B29EFD']
  },
  {
    id: 'mock-3',
    type: 'friend',
    title: 'Yeni Takipçi',
    message: 'ahmet_bey seni takip etmeye başladı',
    time: '3 saat önce',
    read: false,
    icon: '👥',
    color: ['#3B82F6', '#06B6D4']
  },
  {
    id: 'mock-4',
    type: 'prediction',
    title: 'Tahmin Hatırlatması',
    message: '"Bitcoin 100K doları geçecek mi?" tahmin süresi bitiyor',
    time: '5 saat önce',
    read: true,
    icon: '⏰',
    color: ['#F59E0B', '#F97316']
  },
  {
    id: 'mock-5',
    type: 'system',
    title: 'Günlük Bonus',
    message: 'Günlük giriş bonusun hazır! 100 kredi kazandın',
    time: '1 gün önce',
    read: true,
    icon: '🎁',
    color: ['#C9F158', '#84CC16'],
    reward: '+100 kredi'
  },
  {
    id: 'mock-6',
    type: 'league',
    title: 'Lig Tamamlandı',
    message: 'Teknoloji liginde 1. oldun! Ödülün hazır',
    time: '1 gün önce',
    read: false,
    icon: '🏆',
    color: ['#432870', '#B29EFD'],
    reward: '+500 kredi'
  },
  {
    id: 'mock-7',
    type: 'prediction',
    title: 'Tahmin Kaybı',
    message: '"Tesla hisseleri yükselecek mi?" tahminin yanlış çıktı',
    time: '3 gün önce',
    read: true,
    icon: '❌',
    color: ['#EF4444', '#DC2626']
  },
  {
    id: 'mock-8',
    type: 'system',
    title: 'Hesap Güvenliği',
    message: 'Şifren 30 günden uzun süredir değiştirilmedi',
    time: '5 gün önce',
    read: true,
    icon: '🔒',
    color: ['#6B7280', '#4B5563']
  }
];

// Get notification colors by type
export const getNotificationColors = (type: NotificationType): NotificationColors => {
  const colorMap: Record<NotificationType, NotificationColors> = {
    prediction: ['#10B981', '#059669'],
    league: ['#432870', '#B29EFD'],
    friend: ['#3B82F6', '#06B6D4'],
    system: ['#C9F158', '#84CC16'],
  };

  return colorMap[type] || ['#6B7280', '#4B5563'];
};

// Get notification icon by type
export const getNotificationIcon = (type: NotificationType): string => {
  const iconMap: Record<NotificationType, string> = {
    prediction: '🎯',
    league: '🏆',
    friend: '👥',
    system: '🔔',
  };

  return iconMap[type] || '🔔';
};

// Format time ago
export const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} saniye önce`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} dk önce`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} saat önce`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} gün önce`;
  }
};

// Format notification time (can be expanded later)
export const formatNotificationTime = (time: string): string => {
  return time;
};

// Count unread notifications
export const getUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter(n => !n.read).length;
};

// Group notifications by date
export const groupNotificationsByDate = (notifications: Notification[]): {
  today: Notification[];
  yesterday: Notification[];
  older: Notification[];
} => {
  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const older: Notification[] = [];

  notifications.forEach(notification => {
    const time = notification.time.toLowerCase();
    
    if ((time.includes('dk') || time.includes('dakika') || 
        time.includes('saat')) && !time.includes('gün')) {
      today.push(notification);
    } else if (time.includes('1 gün')) {
      yesterday.push(notification);
    } else {
      older.push(notification);
    }
  });

  return { today, yesterday, older };
};


