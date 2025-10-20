import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getCategoryColor } from '../utils';

interface CategoryBadgeProps {
  category: string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: getCategoryColor(category) }]}>
      <Text style={styles.text}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#202020',
  },
});

