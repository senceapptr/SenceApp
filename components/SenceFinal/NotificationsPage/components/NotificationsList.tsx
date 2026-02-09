// =====================================================
// NOTIFICATIONS LIST - Grouped by Date
// =====================================================

import React from 'react';
import { View, Text, SectionList, StyleSheet, RefreshControl } from 'react-native';
import { NotificationsListProps, Notification } from '../types';
import { NotificationCard } from './NotificationCard';
import { EmptyState } from './EmptyState';
import { groupNotificationsByDateSection } from '../utils';

interface Section {
  title: string;
  data: Notification[];
}

interface ExtendedProps extends NotificationsListProps {
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const NotificationsList: React.FC<ExtendedProps> = ({
  notifications,
  onMarkAsRead,
  onDelete,
  variant = 'page',
  refreshing = false,
  onRefresh,
}) => {
  if (notifications.length === 0) {
    return <EmptyState variant={variant} />;
  }

  // Group notifications
  const grouped = groupNotificationsByDateSection(notifications);

  // Build sections
  const sections: Section[] = [];

  if (grouped.today.length > 0) {
    sections.push({ title: 'Bugün', data: grouped.today });
  }
  if (grouped.yesterday.length > 0) {
    sections.push({ title: 'Dün', data: grouped.yesterday });
  }
  if (grouped.thisWeek.length > 0) {
    sections.push({ title: 'Bu Hafta', data: grouped.thisWeek });
  }
  if (grouped.older.length > 0) {
    sections.push({ title: 'Daha Eski', data: grouped.older });
  }

  const renderSectionHeader = ({ section }: { section: Section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationCard
      notification={item}
      onPress={onMarkAsRead}
      onDelete={onDelete}
      onMarkAsRead={onMarkAsRead}
    />
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#432870"
            colors={['#432870']}
          />
        ) : undefined
      }
      ListFooterComponent={<View style={styles.footer} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 8,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footer: {
    height: 24,
  },
});
