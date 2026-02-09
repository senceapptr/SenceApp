import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TabsProps } from '../types';

export function Tabs({ activeTab, onChangeTab }: TabsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabsWrapper}>
        {/* Background Track */}
        <View style={styles.track}>
          {/* Daily Tab */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onChangeTab('daily')}
            style={styles.tabButton}
          >
            {activeTab === 'daily' ? (
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.activeTab}
              >
                <Text style={styles.activeTabText}>🌅 Günlük</Text>
              </LinearGradient>
            ) : (
              <View style={styles.inactiveTab}>
                <Text style={styles.inactiveTabText}>🌅 Günlük</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Monthly Tab */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onChangeTab('monthly')}
            style={styles.tabButton}
          >
            {activeTab === 'monthly' ? (
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.activeTab}
              >
                <Text style={styles.activeTabText}>📅 Aylık</Text>
              </LinearGradient>
            ) : (
              <View style={styles.inactiveTab}>
                <Text style={styles.inactiveTabText}>📅 Aylık</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabsWrapper: {
    backgroundColor: '#161B22',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  track: {
    flexDirection: 'row',
    gap: 4,
  },
  tabButton: {
    flex: 1,
  },
  activeTab: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  activeTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  inactiveTab: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  inactiveTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B949E',
  },
});
