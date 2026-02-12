import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PriceDisplayProps } from '../types';
import { formatPrice } from '../utils';

export function PriceDisplay({ price, originalPrice }: PriceDisplayProps) {
  return (
    <View style={styles.container}>
      {originalPrice && (
        <View style={styles.priceRow}>
          <Text style={styles.originalPrice}>{formatPrice(originalPrice)}</Text>
          <Ionicons name="diamond-outline" size={13} color="#6B7280" />
        </View>
      )}
      <View style={styles.priceRow}>
        <Text style={styles.price}>{formatPrice(price)}</Text>
        <Ionicons name="diamond-outline" size={14} color="#F0F6FC" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  priceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: '#8B949E',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F0F6FC',
  },
});
