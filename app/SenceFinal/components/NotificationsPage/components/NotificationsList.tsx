import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { NotificationsListProps } from '../types';
import { NotificationCard } from './NotificationCard';
import { EmptyState } from './EmptyState';
import { groupNotificationsByDate } from '../utils';

export const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onMarkAsRead,
  onDelete,
  variant = 'page',
}) => {
  if (notifications.length === 0) {
    return <EmptyState variant={variant} />;
  }

  const containerStyle = variant === 'modal' ? styles.modalContainer : styles.pageContainer;
  const { today, yesterday, older } = groupNotificationsByDate(notifications);

  return (
    <ScrollView 
      style={containerStyle}
      showsVerticalScrollIndicator={false}
    >
      {today.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bugün</Text>
          <View style={styles.notificationList}>
            {today.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onPress={onMarkAsRead}
                onDelete={onDelete}
              />
            ))}
          </View>
        </View>
      )}

      {yesterday.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dün</Text>
          <View style={styles.notificationList}>
            {yesterday.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onPress={onMarkAsRead}
                onDelete={onDelete}
              />
            ))}
          </View>
        </View>
      )}

      {older.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daha Eski</Text>
          <View style={styles.notificationList}>
            {older.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onPress={onMarkAsRead}
                onDelete={onDelete}
              />
            ))}
          </View>
        </View>
      )}
      
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  pageContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
    opacity: 0.6,
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notificationList: {
    gap: 12,
  },
  bottomPadding: {
    height: 24,
  },
});


