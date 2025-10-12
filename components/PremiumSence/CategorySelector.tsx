import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const categories = [
  'All', 'Sports', 'Current Events', 'Politics', 'Media', 'Technology', 'Entertainment', 'Finance', 'Science'
];

export default function CategorySelector() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[styles.button, selectedCategory === category ? styles.buttonActive : styles.buttonInactive]}
          >
            <Text style={[styles.buttonText, selectedCategory === category ? styles.buttonTextActive : styles.buttonTextInactive]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  scrollRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  buttonActive: {
    backgroundColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  buttonInactive: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonTextActive: {
    color: '#fff',
  },
  buttonTextInactive: {
    color: '#222',
  },
});