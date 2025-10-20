import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ProductCardProps } from '../types';
import { ProductImage } from './ProductImage';
import { ProductInfo } from './ProductInfo';
import { PriceDisplay } from './PriceDisplay';
import { AvailabilityBadge } from './AvailabilityBadge';
import { isProductAvailable } from '../utils';

export function ProductCard({ product, userCredits, onPress }: ProductCardProps) {
  const available = isProductAvailable(userCredits, product.price);
  
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ProductImage uri={product.image} badge={product.badge} />
      
      <View style={styles.info}>
        <ProductInfo name={product.name} description={product.description} />
        <PriceDisplay price={product.price} originalPrice={product.originalPrice} />
        <AvailabilityBadge available={available} variant="small" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F2F3F5',
  },
  info: {
    padding: 12,
  },
});

