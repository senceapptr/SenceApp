import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { notificationsService } from '@/services/notifications.service';
import { Notification } from './types';
import { mockNotifications, getUnreadCount, formatTimeAgo, getNotificationIcon, getNotificationColors } from './utils';

export const useNotifications = () => {
  const { user, refreshUnreadCount } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Backend'den bildirim verilerini yükle
  const loadNotificationsData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      console.log('Loading notifications for user:', user.id);
      const { data, error } = await notificationsService.getUserNotifications(user.id);
      
      console.log('Load notifications response:', { data: data?.length || 0, error });
      
      if (error) {
        console.warn('Backend error, using mock data:', error);
        // Fallback to mock data
        setNotifications(mockNotifications);
        return;
      }
      
      if (data && data.length > 0) {
        // Backend verilerini frontend formatına çevir
        const mappedNotifications: Notification[] = data.map((notif: any) => ({
          id: notif.id, // UUID'yi string olarak tut
          type: notif.type || 'system',
          title: notif.title || 'Bildirim',
          message: notif.message || '',
          time: formatTimeAgo(notif.created_at),
          read: notif.is_read || false,
          icon: getNotificationIcon(notif.type),
          color: getNotificationColors(notif.type),
          reward: notif.data?.reward ? `+${notif.data.reward} kredi` : undefined,
        }));
        console.log('Mapped notifications:', mappedNotifications.length);
        setNotifications(mappedNotifications);
      } else {
        console.log('No notifications found, using mock data');
        setNotifications(mockNotifications);
      }

    } catch (err) {
      console.error('Notifications data load error:', err);
      Alert.alert('Hata', 'Bildirimler yüklenirken bir hata oluştu');
      // Fallback to mock data
      setNotifications(mockNotifications);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde veriyi çek
  useEffect(() => {
    loadNotificationsData();
  }, [user]);

  const markAsRead = async (id: string) => {
    if (!user) return;

    // Add micro animation
    setAnimatingItems(prev => new Set([...prev, id]));
    
    try {
      // Backend'e gönder
      await notificationsService.markAsRead(id, user.id);
      
      // Local state'i güncelle
      setTimeout(() => {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === id ? { ...notif, read: true } : notif
          )
        );
        setAnimatingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        // Unread count'u güncelle
        refreshUnreadCount();
      }, 200);
    } catch (err) {
      console.error('Mark as read error:', err);
      // Animation'ı iptal et
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const clearAll = async () => {
    if (!user) return;

    try {
      // Backend'e gönder
      await notificationsService.markAllAsRead(user.id);
      
      // Local state'i güncelle
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      // Unread count'u güncelle
      refreshUnreadCount();
    } catch (err) {
      console.error('Clear all error:', err);
      Alert.alert('Hata', 'Bildirimler temizlenirken bir hata oluştu');
    }
  };

  const deleteNotification = async (id: string) => {
    if (!user) return;

    try {
      // Backend'e gönder
      await notificationsService.deleteNotification(id, user.id);
      
      // Local state'i güncelle
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      // Unread count'u güncelle
      refreshUnreadCount();
    } catch (err) {
      console.error('Delete notification error:', err);
      Alert.alert('Hata', 'Bildirim silinirken bir hata oluştu');
    }
  };

  const unreadCount = getUnreadCount(notifications);

  // Test bildirimleri oluştur
  const createTestNotifications = async () => {
    if (!user) return;

    try {
      console.log('Creating test notifications for user:', user.id);
      const result = await notificationsService.createTestNotifications(user.id);
      
      if (result.data) {
        console.log('Test notifications created:', result.data.length);
        Alert.alert('Başarılı!', `${result.data.length} test bildirimi oluşturuldu!`);
        // Verileri yenile
        loadNotificationsData();
        // Unread count'u güncelle
        refreshUnreadCount();
      } else if (result.error) {
        console.error('Create test notifications error:', result.error);
        Alert.alert('Hata', result.error.message || 'Test bildirimleri oluşturulurken bir hata oluştu');
      }
    } catch (err) {
      console.error('Create test notifications error:', err);
      Alert.alert('Hata', 'Test bildirimleri oluşturulurken bir hata oluştu');
    }
  };

  // Mock test bildirimleri oluştur (RLS hatası için fallback)
  const createMockTestNotifications = () => {
    const mockTestNotifications: Notification[] = [
      {
        id: `mock-${Date.now()}-1`,
        type: 'prediction',
        title: 'Tahmin Sonuçlandı',
        message: '"Galatasaray şampiyonluk yaşayacak mı?" tahminin doğru çıktı!',
        time: 'Şimdi',
        read: false,
        icon: '🎯',
        color: ['#10B981', '#059669'],
        reward: '+250 kredi'
      },
      {
        id: `mock-${Date.now()}-2`,
        type: 'league',
        title: 'Liga Sıralaması',
        message: 'Spor liginde 3. sıraya yükseldin!',
        time: 'Şimdi',
        read: false,
        icon: '🏆',
        color: ['#432870', '#B29EFD']
      },
      {
        id: `mock-${Date.now()}-3`,
        type: 'friend',
        title: 'Yeni Takipçi',
        message: 'ahmet_bey seni takip etmeye başladı',
        time: 'Şimdi',
        read: false,
        icon: '👥',
        color: ['#3B82F6', '#06B6D4']
      },
      {
        id: `mock-${Date.now()}-4`,
        type: 'system',
        title: 'Günlük Bonus',
        message: 'Günlük giriş bonusun hazır! 100 kredi kazandın',
        time: 'Şimdi',
        read: false,
        icon: '🔔',
        color: ['#C9F158', '#84CC16'],
        reward: '+100 kredi'
      }
    ];

    setNotifications(prev => [...mockTestNotifications, ...prev]);
    Alert.alert('Başarılı!', 'Mock test bildirimleri eklendi!');
  };

  return {
    notifications,
    animatingItems,
    loading,
    markAsRead,
    clearAll,
    deleteNotification,
    unreadCount,
    loadNotificationsData,
    createTestNotifications,
    createMockTestNotifications,
  };
};


