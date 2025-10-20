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
        onPress={() => onTabChange('predictions')}
        style={[styles.tab, activeTab === 'predictions' && styles.activeTab]}
        activeOpacity={0.7}
      >
        <Ionicons name="stats-chart" size={16} color={activeTab === 'predictions' ? 'white' : '#202020'} />
        <Text style={[styles.tabText, activeTab === 'predictions' && styles.activeTabText]}>
          Tahminler
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => onTabChange('statistics')}
        style={[styles.tab, activeTab === 'statistics' && styles.activeTab]}
        activeOpacity={0.7}
      >
        <Ionicons name="trending-up" size={16} color={activeTab === 'statistics' ? 'white' : '#202020'} />
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(32,32,32,0.1)',
    borderRadius: 16,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    backgroundColor: '#432870',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
  },
  activeTabText: {
    color: 'white',
  },
});

