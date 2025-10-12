import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
} from 'react-native';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface NotificationsPageProps {
  isOpen?: boolean;
  onClose?: () => void;
  onBack?: () => void;
  onMenuToggle?: () => void;
}

interface Notification {
  id: number;
  type: 'prediction' | 'league' | 'friend' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
  color: readonly [string, string];
  reward?: string;
}

export function NotificationsPage({ isOpen = true, onClose, onBack, onMenuToggle }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
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
      id: 2,
      type: 'league',
      title: 'Liga Sıralaması',
      message: 'Spor liginde 3. sıraya yükseldin!',
      time: '15 dk önce',
      read: false,
      icon: '🏆',
      color: ['#432870', '#B29EFD']
    },
    {
      id: 3,
      type: 'friend',
      title: 'Yeni Takipçi',
      message: 'ahmet_bey seni takip etmeye başladı',
      time: '1 saat önce',
      read: false,
      icon: '👥',
      color: ['#3B82F6', '#06B6D4']
    },
    {
      id: 4,
      type: 'prediction',
      title: 'Tahmin Hatırlatması',
      message: '"Bitcoin 100K doları geçecek mi?" tahmin süresi bitiyor',
      time: '2 saat önce',
      read: true,
      icon: '⏰',
      color: ['#F59E0B', '#F97316']
    },
    {
      id: 5,
      type: 'system',
      title: 'Günlük Bonus',
      message: 'Günlük giriş bonusun hazır! 100 kredi kazandın',
      time: '1 gün önce',
      read: true,
      icon: '🎁',
      color: ['#C9F158', '#84CC16'],
      reward: '+100 kredi'
    }
  ]);

  const [animatingItems, setAnimatingItems] = useState<Set<number>>(new Set());

  const markAsRead = (id: number) => {
    // Add micro animation
    setAnimatingItems(prev => new Set([...prev, id]));
    
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
    }, 200);
  };

  const clearAll = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderNotificationItem = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationCard,
        notification.read ? styles.readCard : styles.unreadCard
      ]}
      onPress={() => markAsRead(notification.id)}
      activeOpacity={0.8}
    >
      {/* Subtle gradient overlay for unread */}
      {!notification.read && (
        <View style={styles.unreadOverlay} />
      )}

      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          {/* Icon */}
          <LinearGradient
            colors={notification.color}
            style={styles.notificationIcon}
          >
            <Text style={styles.iconText}>{notification.icon}</Text>
          </LinearGradient>
          
          <View style={styles.notificationInfo}>
            <View style={styles.titleRow}>
              <Text style={[
                styles.notificationTitle,
                notification.read && styles.readTitle
              ]}>
                {notification.title}
              </Text>
              {!notification.read && (
                <View style={styles.unreadDot} />
              )}
            </View>
            
            <Text style={[
              styles.notificationMessage,
              notification.read && styles.readMessage
            ]}>
              {notification.message}
            </Text>

            <View style={styles.notificationFooter}>
              <Text style={[
                styles.notificationTime,
                notification.read ? styles.readTime : styles.unreadTime
              ]}>
                {notification.time}
              </Text>
              
              {notification.reward && (
                <View style={styles.rewardBadge}>
                  <Text style={styles.rewardText}>{notification.reward}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Delete button */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteNotification(notification.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Modal version (when isOpen prop is used)
  if (onClose) {
    return (
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Handle */}
            <View style={styles.modalHandle}>
              <View style={styles.handle} />
            </View>

            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <LinearGradient
                  colors={['#432870', '#B29EFD']}
                  style={styles.modalIcon}
                >
                  <Ionicons name="notifications" size={24} color="white" />
                </LinearGradient>
                <View style={styles.modalHeaderInfo}>
                  <Text style={styles.modalTitle}>Bildirimler</Text>
                  {unreadCount > 0 && (
                    <Text style={styles.modalUnreadCount}>{unreadCount} okunmamış</Text>
                  )}
                </View>
              </View>

              <View style={styles.modalHeaderActions}>
                {unreadCount > 0 && (
                  <TouchableOpacity
                    onPress={clearAll}
                    style={styles.clearAllButton}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#432870', '#B29EFD']}
                      style={styles.clearAllGradient}
                    >
                      <Text style={styles.clearAllText}>Tümünü Oku</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={20} color="#202020" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Notifications List */}
            <ScrollView 
              style={styles.modalNotificationsList} 
              showsVerticalScrollIndicator={false}
            >
              {notifications.length === 0 ? (
                <View style={styles.emptyState}>
                  <View style={styles.emptyIcon}>
                    <Text style={styles.emptyEmoji}>🔔</Text>
                  </View>
                  <Text style={styles.emptyTitle}>Henüz Bildirim Yok</Text>
                  <Text style={styles.emptyMessage}>
                    Tahmin yaptıkça buraya bildirimler gelecek.
                  </Text>
                </View>
              ) : (
                <View style={styles.notificationsList}>
                  {notifications.map(renderNotificationItem)}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }

  // Full page version
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color="#202020" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Bildirimler</Text>
          {unreadCount > 0 && (
            <Text style={styles.headerUnreadCount}>{unreadCount} okunmamış</Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={onMenuToggle}
          activeOpacity={0.8}
        >
          <View style={styles.hamburgerIcon}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.fullEmptyState}>
            <View style={styles.fullEmptyIcon}>
              <Text style={styles.fullEmptyEmoji}>🔔</Text>
            </View>
            <Text style={styles.fullEmptyTitle}>Henüz Bildirim Yok</Text>
            <Text style={styles.fullEmptyMessage}>
              Tahmin yaptıkça, liga katıldıkça ve sosyal etkileşimlerde bulundukça buraya bildirimler gelecek.
            </Text>
          </View>
        ) : (
          <View style={styles.fullNotificationsList}>
            {notifications.map(renderNotificationItem)}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202020',
  },
  headerUnreadCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#432870',
    marginTop: 2,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hamburgerIcon: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 20,
    height: 2.5,
    backgroundColor: '#432870',
    borderRadius: 1.25,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  fullNotificationsList: {
    gap: 16,
    paddingBottom: 24,
  },
  fullEmptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  fullEmptyIcon: {
    width: 96,
    height: 96,
    backgroundColor: 'white',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  fullEmptyEmoji: {
    fontSize: 32,
  },
  fullEmptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 16,
  },
  fullEmptyMessage: {
    fontSize: 16,
    color: '#202020',
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  notificationCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  readCard: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderColor: '#E5E7EB',
  },
  unreadCard: {
    backgroundColor: 'white',
    borderColor: 'rgba(67,40,112,0.1)',
  },
  unreadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(67,40,112,0.05)',
  },
  notificationContent: {
    padding: 20,
    position: 'relative',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 20,
    color: 'white',
  },
  notificationInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
    flex: 1,
  },
  readTitle: {
    color: '#202020',
    opacity: 0.7,
  },
  unreadDot: {
    width: 10,
    height: 10,
    backgroundColor: '#432870',
    borderRadius: 5,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#202020',
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 12,
  },
  readMessage: {
    opacity: 0.6,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTime: {
    fontSize: 12,
  },
  readTime: {
    color: '#202020',
    opacity: 0.5,
  },
  unreadTime: {
    color: '#432870',
    fontWeight: '600',
  },
  rewardBadge: {
    backgroundColor: 'rgba(201,241,88,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#84CC16',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(239,68,68,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHandle: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  handle: {
    width: 48,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalHeaderInfo: {},
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202020',
  },
  modalUnreadCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#432870',
    marginTop: 2,
  },
  modalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearAllButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  clearAllGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalNotificationsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  notificationsList: {
    gap: 16,
    paddingVertical: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyEmoji: {
    fontSize: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#202020',
    opacity: 0.7,
    textAlign: 'center',
  },
});
