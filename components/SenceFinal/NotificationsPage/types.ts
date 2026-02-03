export interface NotificationsPageProps {
  isOpen?: boolean;
  onClose?: () => void;
  onBack?: () => void;
  onMenuToggle?: () => void;
}

export type NotificationType = 'prediction' | 'league' | 'friend' | 'system';

export type NotificationColors = readonly [string, string];

export interface Notification {
  id: string; // UUID string olarak değiştirildi
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
  color: NotificationColors;
  reward?: string;
}

export interface NotificationCardProps {
  notification: Notification;
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
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


