import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProductBadgeProps } from '../types';

export function ProductBadge({ text, position = 'absolute' }: ProductBadgeProps) {
  return (
    <View style={[
      styles.badge,
      position === 'absolute' ? styles.absoluteBadge : styles.relativeBadge
    ]}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#432870',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  absoluteBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
  },
  relativeBadge: {
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
});

