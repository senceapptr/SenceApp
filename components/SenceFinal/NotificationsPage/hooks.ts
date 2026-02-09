// =====================================================
// NOTIFICATIONS PAGE - HOOKS
// =====================================================

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { notificationsService } from '@/services/notifications.service';
import { Notification, NotificationCategory } from './types';
import {
  mockNotifications,
  getUnreadCount,
  formatTimeAgo,
  getNotificationConfig,
  filterNotificationsByCategory,
  groupNotificationsByDateSection,
} from './utils';

export const useNotifications = () => {
  const { user, refreshUnreadCount } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<NotificationCategory>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Backend'den bildirim verilerini yükle
  const loadNotificationsData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await notificationsService.getUserNotifications(user.id);

      if (error) {
        console.warn('Backend error, using mock data:', error);
        setNotifications(mockNotifications);
        return;
      }

      if (data && data.length > 0) {
        // Backend verilerini frontend formatına çevir
        const mappedNotifications: Notification[] = data.map((notif: any) => ({
          id: notif.id,
          type: notif.type || 'prediction_added',
          title: notif.title || 'Bildirim',
          message: notif.message || '',
          time: formatTimeAgo(notif.created_at),
          read: notif.is_read || false,
          data: notif.data || {},
          created_at: notif.created_at,
        }));
        setNotifications(mappedNotifications);
      } else {
        // No notifications from backend, use mock for demo
        setNotifications(mockNotifications);
      }
    } catch (err) {
      console.error('Notifications data load error:', err);
      setNotifications(mockNotifications);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  // Sayfa yüklendiğinde veriyi çek
  useEffect(() => {
    loadNotificationsData();
  }, [loadNotificationsData]);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNotificationsData();
  }, [loadNotificationsData]);

  // Mark as read
  const markAsRead = useCallback(async (id: string) => {
    if (!user) return;

    try {
      await notificationsService.markAsRead(id, user.id);

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      refreshUnreadCount();
    } catch (err) {
      console.error('Mark as read error:', err);
    }
  }, [user, refreshUnreadCount]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      await notificationsService.markAllAsRead(user.id);
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      refreshUnreadCount();
    } catch (err) {
      console.error('Mark all as read error:', err);
      Alert.alert('Hata', 'Bildirimler temizlenirken bir hata oluştu');
    }
  }, [user, refreshUnreadCount]);

  // Delete notification
  const deleteNotification = useCallback(async (id: string) => {
    if (!user) return;

    try {
      await notificationsService.deleteNotification(id, user.id);
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      refreshUnreadCount();
    } catch (err) {
      console.error('Delete notification error:', err);
      Alert.alert('Hata', 'Bildirim silinirken bir hata oluştu');
    }
  }, [user, refreshUnreadCount]);

  // Filtered notifications
  const filteredNotifications = filterNotificationsByCategory(notifications, activeFilter);

  // Grouped by date
  const groupedNotifications = groupNotificationsByDateSection(filteredNotifications);

  // Unread count
  const unreadCount = getUnreadCount(notifications);

  // Create test notifications
  const createTestNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const result = await notificationsService.createTestNotifications(user.id);

      if (result.data) {
        Alert.alert('Başarılı!', `${result.data.length} test bildirimi oluşturuldu!`);
        loadNotificationsData();
        refreshUnreadCount();
      } else if (result.error) {
        Alert.alert('Hata', result.error.message || 'Test bildirimleri oluşturulurken bir hata oluştu');
      }
    } catch (err) {
      console.error('Create test notifications error:', err);
      Alert.alert('Hata', 'Test bildirimleri oluşturulurken bir hata oluştu');
    }
  }, [user, loadNotificationsData, refreshUnreadCount]);

  return {
    notifications: filteredNotifications,
    groupedNotifications,
    activeFilter,
    setActiveFilter,
    loading,
    refreshing,
    onRefresh,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    unreadCount,
    createTestNotifications,
  };
};
