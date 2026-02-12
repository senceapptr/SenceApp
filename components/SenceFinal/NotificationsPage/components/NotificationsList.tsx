// =====================================================
// NOTIFICATIONS LIST
// =====================================================

import React, { useMemo, useRef } from 'react';
import { Swipeable } from 'react-native-gesture-handler';
import { RefreshControl, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { NotificationCard } from './NotificationCard';
import { groupNotificationsByDateSection } from '../utils';
import { Notification, NotificationsListProps } from '../types';

interface Section {
  title: string;
  data: Notification[];
}

export const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onDelete,
  onPress,
  onRefresh,
  refreshing = false,
}) => {
  const swipeableRefs = useRef<Record<string, Swipeable | null>>({});

  const sections = useMemo<Section[]>(() => {
    const grouped = groupNotificationsByDateSection(notifications);
    const nextSections: Section[] = [];

    if (grouped.today.length > 0) {
      nextSections.push({ data: grouped.today, title: 'Bugün' });
    }
    if (grouped.yesterday.length > 0) {
      nextSections.push({ data: grouped.yesterday, title: 'Dün' });
    }
    if (grouped.thisWeek.length > 0) {
      nextSections.push({ data: grouped.thisWeek, title: 'Bu Hafta' });
    }
    if (grouped.older.length > 0) {
      nextSections.push({ data: grouped.older, title: 'Daha Eski' });
    }

    return nextSections;
  }, [notifications]);

  const renderRightActions = (notification: Notification) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => {
        swipeableRefs.current[notification.id]?.close();
        onDelete(notification);
      }}
      style={styles.deleteAction}
    >
      <Text style={styles.deleteText}>Sil</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: Notification }) => (
    <View style={styles.itemWrap}>
      <Swipeable
        friction={2}
        overshootRight={false}
        ref={ref => {
          swipeableRefs.current[item.id] = ref;
        }}
        renderRightActions={() => renderRightActions(item)}
        rightThreshold={44}
      >
        <NotificationCard notification={item} onPress={onPress} />
      </Swipeable>
    </View>
  );

  return (
    <SectionList
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListFooterComponent={<View style={styles.footer} />}
      contentContainerStyle={styles.contentContainer}
      keyExtractor={item => item.id}
      refreshControl={
        onRefresh ? (
          <RefreshControl colors={['#3D83FF']} onRefresh={onRefresh} refreshing={refreshing} tintColor="#3D83FF" />
        ) : undefined
      }
      renderItem={renderItem}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
      )}
      sections={sections}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
      style={styles.container}
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
  deleteAction: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#DC2626',
    borderRadius: 20,
    justifyContent: 'center',
    marginLeft: 8,
    minWidth: 84,
    paddingHorizontal: 18,
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    height: 88,
  },
  itemWrap: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    paddingBottom: 8,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  sectionTitle: {
    color: '#8B949E',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  separator: {
    height: 10,
  },
});
