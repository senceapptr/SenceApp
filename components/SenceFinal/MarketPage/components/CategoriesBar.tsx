import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { CategoriesBarProps } from '../types';
import { CategoryButton } from './CategoryButton';

export function CategoriesBar({ categories, selectedCategory, onSelectCategory }: CategoriesBarProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {categories.map((category) => (
          <CategoryButton
            key={category.id}
            category={category}
            isActive={selectedCategory === category.id}
            onPress={() => onSelectCategory(category.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D1117',
    paddingVertical: 12,
  },
  content: {
    paddingHorizontal: 16,
    gap: 10,
  },
});
