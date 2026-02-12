import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProductInfoProps } from '../types';

export function ProductInfo({ name }: ProductInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F0F6FC',
    marginBottom: 4,
  },
});
