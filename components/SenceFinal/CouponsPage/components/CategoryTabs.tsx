import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CategoryType } from '../types';

interface CategoryTabsProps {
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
  totalCoupons: number;
  pendingCoupons: number;
  wonCoupons: number;
  lostCoupons: number;
  cancelledCoupons: number;
}

export function CategoryTabs({
  selectedCategory,
  onCategoryChange,
  totalCoupons,
  pendingCoupons,
  wonCoupons,
  lostCoupons,
  cancelledCoupons,
}: CategoryTabsProps) {
  const tabs = [
    { id: 'all' as CategoryType, name: 'Tümü', count: totalCoupons },
    { id: 'pending' as CategoryType, name: 'Canlı', count: pendingCoupons },
    { id: 'won' as CategoryType, name: 'Kazanan', count: wonCoupons },
    { id: 'lost' as CategoryType, name: 'Kaybeden', count: lostCoupons },
    { id: 'cancelled' as CategoryType, name: 'İptal', count: cancelledCoupons },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              selectedCategory === tab.id ? styles.activeTab : styles.inactiveTab
            ]}
            onPress={() => onCategoryChange(tab.id)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.tabText,
              selectedCategory === tab.id ? styles.activeTabText : styles.inactiveTabText
            ]}>
              {tab.name}
            </Text>
            <Text style={[
              styles.tabCount,
              selectedCategory === tab.id ? styles.activeTabCount : styles.inactiveTabCount
            ]}>
              {tab.count}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  scrollContainer: {
    paddingHorizontal: 0,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#10B981',
  },
  inactiveTab: {
    backgroundColor: '#21262D',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  inactiveTabText: {
    color: '#8B949E',
  },
  tabCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeTabCount: {
    color: '#FFFFFF',
    opacity: 0.8,
  },
  inactiveTabCount: {
    color: '#484F58',
  },
});
