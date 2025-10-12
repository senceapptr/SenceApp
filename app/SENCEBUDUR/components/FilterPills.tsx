import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';

interface FilterPillsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

interface FilterOption {
  id: string;
  label: string;
}

export function FilterPills({ selectedCategory, onCategoryChange }: FilterPillsProps) {
  const filters: FilterOption[] = [
    { id: 'ending-soon', label: 'Bitmek Üzere' },
    { id: 'popular', label: 'Popüler' },
    { id: 'teknoloji', label: 'Teknoloji' },
    { id: 'spor', label: 'Spor' },
    { id: 'kripto', label: 'Kripto' },
    { id: 'politika', label: 'Politika' },
  ];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map((filter) => {
        const isActive = selectedCategory === filter.id;
        return (
          <TouchableOpacity
            key={filter.id}
            onPress={() => onCategoryChange(filter.id)}
            style={[
              styles.pill,
              isActive && styles.activePill
            ]}
          >
            <Text style={[
              styles.pillText,
              isActive && styles.activePillText
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activePill: {
    backgroundColor: '#6B46F0',
    borderColor: '#6B46F0',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  activePillText: {
    color: 'white',
  },
}); 