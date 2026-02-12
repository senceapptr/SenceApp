// =====================================================
// NOTIFICATIONS PAGE - HOOKS
// =====================================================

import { Alert } from 'react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { notificationsService } from '@/services/notifications.service';

import { Notification, NotificationFilter, NotificationRoute } from './types';
import {
  filterNotifications,
  formatTimeAgo,
  getUnreadCount,
  normalizeNotificationType,
  resolveNotificationAction,
  sortNotificationsByDateDesc,
} from './utils';

const UNDO_TIMEOUT_MS = 4000;

interface PendingDeleteState {
  userId: string;
  notification: Notification;
  timeoutId: ReturnType<typeof setTimeout>;
}

interface UseNotificationsOptions {
  onOpenQuestionDetail?: (questionId: string) => void;
  onNavigateToPage?: (page: NotificationRoute) => void;
}

const mapBackendNotification = (notif: any): Notification => {
  const createdAt = typeof notif?.created_at === 'string' ? notif.created_at : new Date().toISOString();

  return {
    created_at: createdAt,
    data: notif?.data || {},
    id: notif?.id ? String(notif.id) : String(Date.now()),
    message: notif?.message || '',
    read: Boolean(notif?.is_read),
    time: formatTimeAgo(createdAt),
    title: notif?.title || 'Bildirim',
    type: normalizeNotificationType(notif?.type),
  };
};

export const useNotifications = ({ onNavigateToPage, onOpenQuestionDetail }: UseNotificationsOptions = {}) => {
  const { refreshUnreadCount, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [undoCandidate, setUndoCandidate] = useState<Notification | null>(null);
  const pendingDeleteRef = useRef<PendingDeleteState | null>(null);

  const commitDelete = useCallback(
    async (notification: Notification, userId: string) => {
      try {
        const { error } = await notificationsService.deleteNotification(notification.id, userId);
        if (error) {
          throw error;
        }
        await refreshUnreadCount();
      } catch (err) {
        console.error('Delete notification error:', err);
        setNotifications(prev => sortNotificationsByDateDesc([...prev, notification]));
        Alert.alert('Hata', 'Bildirim silinirken bir hata oluştu');
      }
    },
    [refreshUnreadCount],
  );

  const flushPendingDelete = useCallback(async () => {
    const pendingDelete = pendingDeleteRef.current;
    if (!pendingDelete) return;

    clearTimeout(pendingDelete.timeoutId);
    pendingDeleteRef.current = null;
    setUndoCandidate(current => (current?.id === pendingDelete.notification.id ? null : current));
    await commitDelete(pendingDelete.notification, pendingDelete.userId);
  }, [commitDelete]);

  const loadNotificationsData = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setErrorMessage('Bildirimleri görmek için hesabına giriş yapmalısın.');
      setLoading(false);
      return;
    }

    try {
      setErrorMessage(null);
      const { data, error } = await notificationsService.getUserNotifications(user.id);

      if (error) {
        throw error;
      }

      const mappedNotifications = sortNotificationsByDateDesc((data || []).map(mapBackendNotification));
      setNotifications(mappedNotifications);
    } catch (err) {
      console.error('Notifications data load error:', err);
      setNotifications([]);
      setErrorMessage('Bildirimler yüklenemedi. Lütfen tekrar dene.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    void loadNotificationsData();
  }, [loadNotificationsData]);

  useEffect(() => {
    return () => {
      const pendingDelete = pendingDeleteRef.current;
      if (!pendingDelete) return;

      clearTimeout(pendingDelete.timeoutId);
      pendingDeleteRef.current = null;
      void notificationsService.deleteNotification(pendingDelete.notification.id, pendingDelete.userId);
    };
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await flushPendingDelete();
      await loadNotificationsData();
    } finally {
      setRefreshing(false);
    }
  }, [flushPendingDelete, loadNotificationsData]);

  const markAsRead = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) return false;

      let wasUnread = false;
      setNotifications(prev =>
        prev.map(notification => {
          if (notification.id === id && !notification.read) {
            wasUnread = true;
            return { ...notification, read: true };
          }
          return notification;
        }),
      );

      if (!wasUnread) {
        return true;
      }

      const { error } = await notificationsService.markAsRead(id, user.id);
      if (error) {
        setNotifications(prev =>
          prev.map(notification => (notification.id === id ? { ...notification, read: false } : notification)),
        );
        Alert.alert('Hata', 'Bildirim güncellenemedi.');
        return false;
      }

      await refreshUnreadCount();
      return true;
    },
    [refreshUnreadCount, user],
  );

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    const previousNotifications = notifications;
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));

    const { error } = await notificationsService.markAllAsRead(user.id);
    if (error) {
      setNotifications(previousNotifications);
      Alert.alert('Hata', 'Bildirimler güncellenemedi.');
      return;
    }

    await refreshUnreadCount();
  }, [notifications, refreshUnreadCount, user]);

  const handleNotificationPress = useCallback(
    async (notification: Notification) => {
      if (!notification.read) {
        const marked = await markAsRead(notification.id);
        if (!marked) return;
      }

      resolveNotificationAction({
        notification,
        onNavigateToPage,
        onOpenQuestionDetail,
      });
    },
    [markAsRead, onNavigateToPage, onOpenQuestionDetail],
  );

  const deleteNotification = useCallback(
    async (notification: Notification) => {
      if (!user) return;

      await flushPendingDelete();
      setNotifications(prev => prev.filter(item => item.id !== notification.id));

      const timeoutId = setTimeout(() => {
        const pendingDelete = pendingDeleteRef.current;
        if (!pendingDelete || pendingDelete.notification.id !== notification.id) {
          return;
        }

        pendingDeleteRef.current = null;
        setUndoCandidate(null);
        void commitDelete(pendingDelete.notification, pendingDelete.userId);
      }, UNDO_TIMEOUT_MS);

      pendingDeleteRef.current = {
        notification,
        timeoutId,
        userId: user.id,
      };
      setUndoCandidate(notification);
    },
    [commitDelete, flushPendingDelete, user],
  );

  const undoDeleteNotification = useCallback(() => {
    const pendingDelete = pendingDeleteRef.current;
    if (!pendingDelete) return;

    clearTimeout(pendingDelete.timeoutId);
    pendingDeleteRef.current = null;
    setUndoCandidate(null);
    setNotifications(prev => sortNotificationsByDateDesc([...prev, pendingDelete.notification]));
  }, []);

  const filteredNotifications = useMemo(
    () => filterNotifications(notifications, activeFilter),
    [activeFilter, notifications],
  );

  const unreadCount = useMemo(() => getUnreadCount(notifications), [notifications]);

  return {
    activeFilter,
    deleteNotification,
    errorMessage,
    isAuthenticated: Boolean(user),
    loading,
    markAllAsRead,
    notifications: filteredNotifications,
    onPressNotification: handleNotificationPress,
    onRefresh,
    refreshing,
    setActiveFilter,
    undoCandidate,
    undoDeleteNotification,
    unreadCount,
  };
};
