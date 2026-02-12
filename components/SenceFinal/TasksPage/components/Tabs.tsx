import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ACCENT_DARK } from '../../LeaguePage/shared/theme';
import { TabsProps } from '../types';

export function Tabs({ activeTab, onChangeTab }: TabsProps) {
  const renderTab = (
    key: 'daily' | 'monthly',
    label: string,
    iconName: keyof typeof Ionicons.glyphMap
  ) => {
    const isActive = activeTab === key;

    return (
      <TouchableOpacity
        key={key}
        activeOpacity={0.85}
        onPress={() => onChangeTab(key)}
        style={[
          styles.tabButton,
          isActive && styles.activeTab,
        ]}
      >
        <Ionicons
          name={iconName}
          size={14}
          color={isActive ? '#FFFFFF' : '#9CA3AF'}
        />
        <Text style={[styles.tabText, isActive && styles.activeTabText]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsWrapper}>
        <View style={styles.track}>
          {renderTab('daily', 'Günlük', 'sunny-outline')}
          {renderTab('monthly', 'Aylık', 'calendar-outline')}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  tabsWrapper: {
    backgroundColor: '#0F172A',
    borderColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 4,
  },
  track: {
    flexDirection: 'row',
    gap: 4,
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 2,
  },
  activeTab: {
    backgroundColor: ACCENT_DARK,
    borderRadius: 16,
    shadowColor: 'rgba(0,0,0,0.45)',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  tabText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '700',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
});
