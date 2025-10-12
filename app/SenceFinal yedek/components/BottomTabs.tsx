import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BottomTabsProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function BottomTabs({ currentPage, onPageChange }: BottomTabsProps) {
  const tabs = [
    { id: 'home', name: 'Ana Sayfa', lib: 'ion', active: 'home', inactive: 'home-outline' },
    { id: 'discover', name: 'Keşfet', lib: 'ion', active: 'search', inactive: 'search-outline' },
    { id: 'coupons', name: 'Kuponlarım', lib: 'mci', active: 'ticket-confirmation', inactive: 'ticket-confirmation-outline' },
    { id: 'leagues', name: 'Ligler', lib: 'ion', active: 'trophy', inactive: 'trophy-outline' },
  ] as const;

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => {
            const isActive = currentPage === tab.id;
            
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => onPageChange(tab.id)}
                activeOpacity={0.7}
              >
                <View style={styles.tabContent}>
                  {renderIcon(tab, isActive)}
                  <Text style={[styles.tabText, { color: isActive ? '#432870' : '#6B7280', fontWeight: isActive ? '700' : '600' }]}>
                    {tab.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  activeTab: {
    // Active tab styling handled in tabContent
  },
  tabContent: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    minWidth: 56,
  },
  activeTabContent: {},
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  activeTabIcon: {},
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeTabText: {},
});

function renderIcon(
  tab: { id: string; name: string; lib: 'ion' | 'mci'; active: string; inactive: string },
  isActive: boolean
) {
  const color = isActive ? '#432870' : '#6B7280';
  const size = isActive ? 26 : 22;
  if (tab.lib === 'ion') {
    // @ts-ignore - names are runtime strings
    return <Ionicons name={isActive ? (tab.active as any) : (tab.inactive as any)} size={size} color={color} style={{ marginBottom: 2 }} />;
  }
  // MaterialCommunityIcons
  // @ts-ignore - names are runtime strings
  return <MaterialCommunityIcons name={isActive ? (tab.active as any) : (tab.inactive as any)} size={size} color={color} style={{ marginBottom: 2 }} />;
}