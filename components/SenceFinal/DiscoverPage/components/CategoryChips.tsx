import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import type { DiscoverCategory } from '../types';

interface CategoryChipsProps {
  categories: DiscoverCategory[];
  selectedId: string | null;
  onSelect: (categoryId: string | null) => void;
}

export function CategoryChips({ categories, selectedId, onSelect }: CategoryChipsProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Kategoriler</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
      >
        <TouchableOpacity
          style={[
            styles.chip,
            {
              backgroundColor: selectedId === null ? theme.accent : theme.surface,
              borderColor: selectedId === null ? theme.accent : theme.border,
              marginRight: 8,
            },
          ]}
          onPress={() => onSelect(null)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.chipText,
              { color: selectedId === null ? '#fff' : theme.textPrimary },
            ]}
          >
            Tümü
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => {
          const isSelected = selectedId === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? theme.accent : theme.surface,
                  borderColor: isSelected ? theme.accent : theme.border,
                  marginRight: 8,
                },
              ]}
              onPress={() => onSelect(cat.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.chipIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.chipText,
                  { color: isSelected ? '#fff' : theme.textPrimary },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  scroll: {},
  scrollContent: {
    paddingHorizontal: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
