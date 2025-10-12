import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Category {
  id: string;
  name: string;
  emoji: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[
            styles.pill,
            activeCategory === cat.id && styles.pillActive
          ]}
          onPress={() => onCategoryChange(cat.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.emoji}>{cat.emoji}</Text>
          <Text
            style={[
              styles.name,
              activeCategory === cat.id && styles.nameActive
            ]}
          >
            {cat.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginBottom: 16,
  },
  content: {
    gap: 12,
    paddingRight: 24,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    gap: 8,
  },
  pillActive: {
    backgroundColor: '#FFFFFF',
  },
  emoji: {
    fontSize: 16,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nameActive: {
    color: '#432870',
  },
});

