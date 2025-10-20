import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { ProductImageProps } from '../types';
import { ProductBadge } from './ProductBadge';

export function ProductImage({ uri, badge }: ProductImageProps) {
  return (
    <View style={styles.container}>
      {badge && <ProductBadge text={badge} position="absolute" />}
      <Image 
        source={{ uri }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

