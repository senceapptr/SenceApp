import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NotificationCardProps } from '../types';

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
  onDelete,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        notification.read ? styles.readCard : styles.unreadCard
      ]}
      onPress={() => onPress(notification.id)}
      activeOpacity={0.8}
    >

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
            onPress={() => onDelete(notification.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notificationCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  readCard: {
    backgroundColor: '#F2F3F5',
    borderColor: '#E5E7EB',
  },
  unreadCard: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(67,40,112,0.2)',
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
});


