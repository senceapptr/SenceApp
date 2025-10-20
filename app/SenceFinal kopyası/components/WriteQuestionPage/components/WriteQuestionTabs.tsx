import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TabType } from '../types';

interface WriteQuestionTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const WriteQuestionTabs: React.FC<WriteQuestionTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.tabsContainer}>
      <View style={styles.tabsWrapper}>
        <TouchableOpacity
          onPress={() => onTabChange('write')}
          style={[styles.tab, activeTab === 'write' && styles.activeTab]}
          activeOpacity={0.8}
        >
          <Text style={styles.tabIcon}>✍️</Text>
          <Text style={[styles.tabText, activeTab === 'write' && styles.activeTabText]}>
            Soru Yaz
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onTabChange('status')}
          style={[styles.tab, activeTab === 'status' && styles.activeTab]}
          activeOpacity={0.8}
        >
          <Text style={styles.tabIcon}>📋</Text>
          <Text style={[styles.tabText, activeTab === 'status' && styles.activeTabText]}>
            Durumlar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tabsWrapper: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 4,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F2F3F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#432870',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(32,32,32,0.7)',
  },
  activeTabText: {
    color: 'white',
  },
});


