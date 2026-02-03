import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProductInfoProps } from '../types';

export function ProductInfo({ name, description }: ProductInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      <Text style={styles.description} numberOfLines={1}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#202020',
    opacity: 0.7,
  },
});

