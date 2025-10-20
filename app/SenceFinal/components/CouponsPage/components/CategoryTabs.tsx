import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CategoryType } from '../types';

interface CategoryTabsProps {
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
  totalCoupons: number;
  liveCoupons: number;
  wonCoupons: number;
  lostCoupons: number;
}

export function CategoryTabs({ 
  selectedCategory, 
  onCategoryChange,
  totalCoupons,
  liveCoupons,
  wonCoupons,
  lostCoupons
}: CategoryTabsProps) {
  const tabs = [
    { id: 'all' as CategoryType, name: 'Tümü', count: totalCoupons },
    { id: 'live' as CategoryType, name: 'Canlı', count: liveCoupons },
    { id: 'won' as CategoryType, name: 'Kazanan', count: wonCoupons },
    { id: 'lost' as CategoryType, name: 'Kaybeden', count: lostCoupons }
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
    paddingHorizontal: 20,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#432870',
  },
  inactiveTab: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    color: '#374151',
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
    color: '#6B7280',
  },
});




