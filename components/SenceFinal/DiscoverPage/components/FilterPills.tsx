import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import type { FilterType } from '../types';

const FILTERS: { id: FilterType; label: string; icon: string }[] = [
  { id: 'all', label: 'Tümü', icon: 'apps' },
  { id: 'trending', label: 'Trendler', icon: 'flame' },
  { id: 'high-odds', label: 'Yüksek Oranlar', icon: 'trending-up' },
  { id: 'ending-soon', label: 'Yakında Bitecek', icon: 'alarm' },
];

interface FilterPillsProps {
  selected: FilterType;
  onSelect: (filter: FilterType) => void;
}

export function FilterPills({ selected, onSelect }: FilterPillsProps) {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scroll}
    >
      {FILTERS.map((filter) => {
        const isSelected = selected === filter.id;
        return (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.pill,
              {
                backgroundColor: isSelected ? theme.accent : theme.surface,
                borderColor: isSelected ? theme.accent : theme.border,
                marginRight: 8,
              },
            ]}
            onPress={() => onSelect(filter.id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={filter.icon as any}
              size={16}
              color={isSelected ? '#fff' : theme.textMuted}
              style={styles.pillIcon}
            />
            <Text
              style={[
                styles.pillText,
                { color: isSelected ? '#fff' : theme.textPrimary },
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillIcon: {
    marginRight: 6,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
