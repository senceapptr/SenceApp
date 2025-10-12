import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TabType } from '../types';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'discover' && styles.activeTab]}
          onPress={() => onTabChange('discover')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'discover' && styles.activeTabText]}>
            Keşfet
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my-leagues' && styles.activeTab]}
          onPress={() => onTabChange('my-leagues')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'my-leagues' && styles.activeTabText]}>
            Liglerim
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'create' && styles.activeTab]}
          onPress={() => onTabChange('create')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
            Oluştur
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F2F3F5',
    borderRadius: 20,
    padding: 4,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  activeTab: {
    backgroundColor: '#432870',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
});

