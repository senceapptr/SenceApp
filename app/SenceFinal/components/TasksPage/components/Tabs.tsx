import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TabsProps } from '../types';

export function Tabs({ activeTab, onChangeTab }: TabsProps) {
  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'daily' && styles.activeTab]}
        onPress={() => onChangeTab('daily')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, activeTab === 'daily' && styles.activeTabText]}>Günlük Görevler</Text>
        {activeTab === 'daily' && (
          <LinearGradient colors={["#c61585", "#432870"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.tabIndicator} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
        onPress={() => onChangeTab('monthly')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, activeTab === 'monthly' && styles.activeTabText]}>Aylık Görevler</Text>
        {activeTab === 'monthly' && (
          <LinearGradient colors={["#c61585", "#432870"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.tabIndicator} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F2F3F5',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: 'relative',
  },
  activeTab: {},
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(32, 32, 32, 0.6)',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#432870',
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
});







