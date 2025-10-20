import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PriceDisplayProps } from '../types';
import { formatPrice } from '../utils';

export function PriceDisplay({ price, originalPrice }: PriceDisplayProps) {
  return (
    <View style={styles.container}>
      {originalPrice && (
        <Text style={styles.originalPrice}>
          {formatPrice(originalPrice)} 💎
        </Text>
      )}
      <Text style={styles.price}>
        {formatPrice(price)} 💎
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#202020',
    opacity: 0.5,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '900',
    color: '#432870',
  },
});

