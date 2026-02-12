// =====================================================
// FILTER TABS
// =====================================================

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { FILTER_TABS } from '../utils';
import { NotificationFilter } from '../types';

interface FilterTabsProps {
  unreadCount?: number;
  activeFilter: NotificationFilter;
  onFilterChange: (filter: NotificationFilter) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ activeFilter, onFilterChange, unreadCount = 0 }) => {
  return (
    <View style={styles.container}>
      <View style={styles.segment}>
        {FILTER_TABS.map(tab => {
          const isActive = activeFilter === tab.key;
          const shouldShowUnreadBadge = tab.key === 'unread' && unreadCount > 0;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.85}
              onPress={() => onFilterChange(tab.key)}
              style={[styles.tab, isActive && styles.activeTab]}
            >
              <View style={styles.tabInner}>
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
                {shouldShowUnreadBadge && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activeTab: {
    backgroundColor: '#2F4F8C',
    borderColor: '#4766A2',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  container: {
    borderBottomColor: '#262C36',
    borderBottomWidth: 1,
    paddingBottom: 12,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  segment: {
    backgroundColor: '#0F172A',
    borderColor: '#30363D',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 4,
  },
  tab: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: 'relative',
  },
  tabInner: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
  },
  tabText: {
    color: '#8B949E',
    fontSize: 13,
    fontWeight: '700',
  },
  unreadBadge: {
    alignItems: 'center',
    backgroundColor: '#EF4444',
    borderColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 24,
    minWidth: 24,
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 14,
  },
});
