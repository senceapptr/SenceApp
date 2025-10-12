import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotificationsPageProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: number;
  type: 'prediction' | 'league' | 'follower' | 'reminder' | 'bonus';
  title: string;
  description: string;
  time: string;
  isUnread: boolean;
  icon: string;
  iconColor: string;
}

export function NotificationsPage({ isOpen, onClose }: NotificationsPageProps) {
  const notifications: Notification[] = [
    {
      id: 1,
      type: 'prediction',
      title: 'Tahmin Sonuçlandı',
      description: '"Galatasaray şampiyonluk yaşayacak mı?" tahminin doğru çıktı!',
      time: '2 dk önce',
      isUnread: true,
      icon: 'checkmark-circle',
      iconColor: '#10B981'
    },
    {
      id: 2,
      type: 'league',
      title: 'Liga Sıralaması',
      description: 'Spor liginde 3. sıraya yükseldin!',
      time: '15 dk önce',
      isUnread: true,
      icon: 'trophy',
      iconColor: '#8B5CF6'
    },
    {
      id: 3,
      type: 'follower',
      title: 'Yeni Takipçi',
      description: 'ahmet_bey seni takip etmeye başladı',
      time: '1 saat önce',
      isUnread: false,
      icon: 'people',
      iconColor: '#3B82F6'
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Tahmin Hatırlatması',
      description: '"Bitcoin 100K doları geçecek mi?" tahmin süresi bitiyor',
      time: '2 saat önce',
      isUnread: false,
      icon: 'time',
      iconColor: '#F59E0B'
    },
    {
      id: 5,
      type: 'bonus',
      title: 'Günlük Bonus',
      description: 'Günlük giriş bonusun hazır! 100 kredi kazandın',
      time: '1 gün önce',
      isUnread: false,
      icon: 'gift',
      iconColor: '#8B5CF6'
    }
  ];

  const unreadCount = notifications.filter(n => n.isUnread).length;

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}>
        <View style={{
          backgroundColor: 'white',
          borderRadius: 24,
          margin: 16,
          flex: 1,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#F2F3F5',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#8B5CF6',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}>
                <Ionicons name="notifications" size={18} color="white" />
              </View>
              <View>
                <Text style={{
                  fontSize: 20,
                  fontWeight: '900',
                  color: '#202020',
                }}>
                  Bildirimler
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#666',
                }}>
                  {unreadCount} okunmamış
                </Text>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity style={{
                backgroundColor: '#8B5CF6',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 'bold',
                }}>
                  Tümünü Oku
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#F2F3F5',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="close" size={20} color="#202020" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Notifications List */}
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#F2F3F5',
                  backgroundColor: notification.isUnread ? '#F8F9FF' : 'white',
                }}
              >
                {/* Icon */}
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: notification.iconColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}>
                  <Ionicons name={notification.icon as any} size={20} color="white" />
                </View>
                
                {/* Content */}
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#202020',
                    marginBottom: 4,
                  }}>
                    {notification.title}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#666',
                    lineHeight: 20,
                    marginBottom: 8,
                  }}>
                    {notification.description}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: '#999',
                  }}>
                    {notification.time}
                  </Text>
                </View>
                
                {/* Unread Indicator */}
                {notification.isUnread && (
                  <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#8B5CF6',
                    marginTop: 4,
                  }} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
} 