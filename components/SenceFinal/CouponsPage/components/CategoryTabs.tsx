import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { CategoryType } from '../types';

interface CategoryTabsProps {
  selectedCategory: CategoryType;
  previousCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
  totalCoupons: number;
  pendingCoupons: number;
  wonCoupons: number;
  lostCoupons: number;
}

export function CategoryTabs({
  selectedCategory,
  previousCategory,
  onCategoryChange,
  totalCoupons,
  pendingCoupons,
  wonCoupons,
  lostCoupons,
}: CategoryTabsProps) {
  const tabs = useMemo(
    () => [
      { id: 'all' as CategoryType, name: 'Tümü', count: totalCoupons },
      { id: 'pending' as CategoryType, name: 'Canlı', count: pendingCoupons },
      { id: 'won' as CategoryType, name: 'Kazanan', count: wonCoupons },
      { id: 'lost' as CategoryType, name: 'Kaybeden', count: lostCoupons },
    ],
    [totalCoupons, pendingCoupons, wonCoupons, lostCoupons],
  );

  const [tabsContainerWidth, setTabsContainerWidth] = useState(0);
  const tabIndicatorTranslateX = useRef(new Animated.Value(0)).current;

  const activeTabIndex = tabs.findIndex(tab => tab.id === selectedCategory);
  const previousTabIndex = tabs.findIndex(tab => tab.id === previousCategory);
  const tabWidth = tabsContainerWidth > 0 ? tabsContainerWidth / tabs.length : 0;

  useEffect(() => {
    if (!tabWidth || activeTabIndex < 0) return;
    const fromIndex = previousTabIndex >= 0 ? previousTabIndex : activeTabIndex;

    tabIndicatorTranslateX.stopAnimation();
    tabIndicatorTranslateX.setValue(fromIndex * tabWidth);
    if (fromIndex === activeTabIndex) return;

    Animated.spring(tabIndicatorTranslateX, {
      toValue: activeTabIndex * tabWidth,
      useNativeDriver: true,
      damping: 18,
      stiffness: 210,
      mass: 0.75,
    }).start();
  }, [activeTabIndex, previousTabIndex, tabWidth, tabIndicatorTranslateX]);

  return (
    <View style={styles.container}>
      <View style={styles.tabsLeague} onLayout={event => setTabsContainerWidth(event.nativeEvent.layout.width)}>
        {tabWidth > 0 && (
          <Animated.View
            style={[
              styles.tabsLeagueIndicator,
              {
                width: tabWidth - 8,
                left: 4,
                transform: [{ translateX: tabIndicatorTranslateX }],
              },
            ]}
          />
        )}
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabLeagueButton}
            onPress={() => onCategoryChange(tab.id)}
            activeOpacity={0.85}
          >
            <Text
              style={[styles.tabLeagueText, selectedCategory === tab.id && styles.tabLeagueTextActive]}
              numberOfLines={1}
            >
              {tab.name}
            </Text>
            <View style={[styles.tabLeagueBadge, selectedCategory === tab.id && styles.tabLeagueBadgeActive]}>
              <Text style={[styles.tabLeagueBadgeText, selectedCategory === tab.id && styles.tabLeagueBadgeTextActive]}>
                {tab.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  tabsLeague: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 4,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  tabsLeagueIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    borderRadius: 16,
    backgroundColor: '#256EFF',
    shadowColor: '#256EFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  tabLeagueButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    gap: 4,
    zIndex: 2,
  },
  tabLeagueText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  tabLeagueTextActive: {
    color: '#FFFFFF',
  },
  tabLeagueBadge: {
    minWidth: 22,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(148,163,184,0.28)',
    alignItems: 'center',
  },
  tabLeagueBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.26)',
  },
  tabLeagueBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D1D5DB',
  },
  tabLeagueBadgeTextActive: {
    color: '#FFFFFF',
  },
});
