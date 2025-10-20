import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CategoryButtonProps } from '../types';

export function CategoryButton({ category, isActive, onPress }: CategoryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, isActive && styles.activeButton]}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{category.icon}</Text>
      <Text style={[styles.text, isActive && styles.activeText]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#F2F3F5',
  },
  activeButton: {
    backgroundColor: '#432870',
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
  },
  activeText: {
    color: 'white',
  },
});

