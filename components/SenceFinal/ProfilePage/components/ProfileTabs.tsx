import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabType } from '../types';

interface ProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        onPress={() => onTabChange('tickets')}
        style={[styles.tab, activeTab === 'tickets' && styles.activeTab]}
        activeOpacity={0.7}
      >
        <Ionicons name="ticket" size={16} color={activeTab === 'tickets' ? '#fff' : '#8B949E'} />
        <Text style={[styles.tabText, activeTab === 'tickets' && styles.activeTabText]}>
          Ticketlar
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onTabChange('statistics')}
        style={[styles.tab, activeTab === 'statistics' && styles.activeTab]}
        activeOpacity={0.7}
      >
        <Ionicons name="trending-up" size={16} color={activeTab === 'statistics' ? '#fff' : '#8B949E'} />
        <Text style={[styles.tabText, activeTab === 'statistics' && styles.activeTabText]}>
          İstatistikler
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#161B22',
    borderWidth: 1,
    borderColor: '#30363D',
    borderRadius: 16,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#10B981',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B949E',
  },
  activeTabText: {
    color: '#fff',
  },
});

