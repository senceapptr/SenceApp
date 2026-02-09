// =====================================================
// NOTIFICATION CARD - Premium Dark Style (Ticket Style)
// =====================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NotificationCardProps } from '../types';
import { getNotificationConfig } from '../utils';

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
  onDelete,
  onMarkAsRead,
}) => {
  const config = getNotificationConfig(notification.type);
  const isUnread = !notification.read;

  // Renk ve tema ayarları (TicketListItem'dan esinlenildi)
  // config.colors[0] = ana renk (glow, border için)
  const primaryColor = config.colors[0];

  const handlePress = () => {
    if (isUnread) {
      onMarkAsRead(notification.id);
    }
    onPress(notification.id);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={[
        styles.container,
        {
          borderColor: isUnread ? primaryColor : 'rgba(255,255,255,0.05)',
          borderWidth: isUnread ? 1 : 1,
          shadowColor: isUnread ? primaryColor : 'transparent',
          shadowOpacity: isUnread ? 0.25 : 0,
        }
      ]}
    >
      <LinearGradient
        colors={['#161B22', '#0D1117']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {/* Icon Box */}
              <View style={[styles.iconBox, { backgroundColor: primaryColor + '20' }]}>
                <Text style={{ fontSize: 16 }}>{config.icon}</Text>
              </View>

              <View>
                <View style={styles.titleRow}>
                  <Text style={[styles.title, !isUnread && styles.titleRead]} numberOfLines={1}>
                    {notification.title}
                  </Text>
                  {isUnread && (
                    <View style={[styles.unreadDot, { backgroundColor: primaryColor }]} />
                  )}
                </View>
                <Text style={styles.timeText}>{notification.time}</Text>
              </View>
            </View>

            {/* Delete Button */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(notification.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Message Content */}
          <Text style={[styles.message, !isUnread && styles.messageRead]}>
            {notification.message}
          </Text>

          {/* Reward Badge if exists */}
          {notification.data?.reward && (
            <View style={styles.rewardContainer}>
              <View style={[styles.rewardBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B981' }]}>
                <Ionicons name="gift-outline" size={12} color="#10B981" style={{ marginRight: 4 }} />
                <Text style={styles.rewardText}>+{notification.data.reward} Kredi</Text>
              </View>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
    backgroundColor: '#0D1117', // Fallback color
  },
  cardGradient: {
    padding: 0,
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  title: {
    color: '#F0F6FC',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  titleRead: {
    color: '#8B949E',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  timeText: {
    color: '#8B949E',
    fontSize: 11,
    fontWeight: '500',
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: '#C9D1D9', // GitHub dark text color style
    lineHeight: 20,
    fontWeight: '400',
  },
  messageRead: {
    color: '#6E7681',
  },
  rewardContainer: {
    marginTop: 12,
    flexDirection: 'row',
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
    letterSpacing: 0.5,
  },
});
