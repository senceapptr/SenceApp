import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TabType } from '../types';
import { ACCENT_DARK } from '../../LeaguePage/shared/theme';

interface WriteQuestionTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TAB_CONFIG: { key: TabType; label: string }[] = [
  { key: 'write', label: 'Soru Yaz' },
  { key: 'status', label: 'Durumlar' },
];

export const WriteQuestionTabs: React.FC<WriteQuestionTabsProps> = ({ activeTab, onTabChange }) => {
  const [tabsContainerWidth, setTabsContainerWidth] = useState(0);
  const indicatorTranslateX = useRef(new Animated.Value(0)).current;
  const tabWidth = tabsContainerWidth > 0 ? tabsContainerWidth / TAB_CONFIG.length : 0;

  const activeIndex = useMemo(() => TAB_CONFIG.findIndex(tab => tab.key === activeTab), [activeTab]);

  useEffect(() => {
    if (!tabWidth || activeIndex < 0) return;

    Animated.spring(indicatorTranslateX, {
      damping: 18,
      mass: 0.75,
      stiffness: 210,
      toValue: activeIndex * tabWidth,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, indicatorTranslateX, tabWidth]);

  return (
    <View style={styles.container}>
      <View style={styles.tabs} onLayout={event => setTabsContainerWidth(event.nativeEvent.layout.width)}>
        {tabWidth > 0 && (
          <Animated.View
            style={[
              styles.activeIndicator,
              {
                left: 4,
                transform: [{ translateX: indicatorTranslateX }],
                width: tabWidth - 8,
              },
            ]}
          />
        )}

        {TAB_CONFIG.map(tab => {
          const isActive = activeTab === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              onPress={() => onTabChange(tab.key)}
              activeOpacity={0.85}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activeIndicator: {
    backgroundColor: ACCENT_DARK,
    borderRadius: 16,
    bottom: 4,
    elevation: 2,
    position: 'absolute',
    shadowColor: 'rgba(0,0,0,0.45)',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    top: 4,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  container: {
    paddingBottom: 12,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 2,
  },
  tabs: {
    backgroundColor: '#0F172A',
    borderColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    padding: 4,
    position: 'relative',
  },
  tabText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '700',
  },
});
