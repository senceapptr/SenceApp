import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet 
} from 'react-native';

interface FilterPillsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function FilterPills({ selectedCategory, onCategoryChange }: FilterPillsProps) {
  const categories = [
    { id: 'ending-soon', label: 'Yakında Bitecek' },
    { id: 'trending', label: 'Trend' },
    { id: 'sports', label: 'Spor' },
    { id: 'politics', label: 'Politika' },
    { id: 'technology', label: 'Teknoloji' },
    { id: 'entertainment', label: 'Eğlence' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.pill,
              selectedCategory === category.id && styles.pillActive
            ]}
            onPress={() => onCategoryChange(category.id)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.pillText,
              selectedCategory === category.id && styles.pillTextActive
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pillActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  pillText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  pillTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});
