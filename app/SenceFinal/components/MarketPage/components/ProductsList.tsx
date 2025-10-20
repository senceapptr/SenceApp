import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProductsListProps } from '../types';
import { ProductCard } from './ProductCard';
import { EmptyState } from './EmptyState';

export function ProductsList({ 
  products, 
  userCredits, 
  selectedCategory,
  categoryName, 
  onProductPress 
}: ProductsListProps) {
  if (products.length === 0) {
    return <EmptyState message="Bu kategoride ürün bulunamadı" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {selectedCategory === 'all' ? 'Tüm Ürünler' : categoryName}
        </Text>
        <Text style={styles.count}>
          {products.length} ürün
        </Text>
      </View>
      
      <View style={styles.grid}>
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            userCredits={userCredits}
            onPress={() => onProductPress(product)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
  },
  count: {
    fontSize: 14,
    fontWeight: '700',
    color: '#432870',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 24,
  },
});

