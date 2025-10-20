export interface NotificationsPageProps {
  isOpen?: boolean;
  onClose?: () => void;
  onBack?: () => void;
  onMenuToggle?: () => void;
}

export type NotificationType = 'prediction' | 'league' | 'friend' | 'system';

export type NotificationColors = readonly [string, string];

export interface Notification {
  id: number;
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
  onPress: (id: number) => void;
  onDelete: (id: number) => void;
}

export interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  variant?: 'page' | 'modal';
}

export interface EmptyStateProps {
  variant?: 'page' | 'modal';
}


