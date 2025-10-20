import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AvailabilityBadgeProps } from '../types';

export function AvailabilityBadge({ available, variant = 'small' }: AvailabilityBadgeProps) {
  const isLarge = variant === 'large';
  
  return (
    <View style={[
      styles.badge,
      available ? styles.availableBadge : styles.unavailableBadge,
      isLarge && styles.largeBadge
    ]}>
      <Text style={[
        styles.text,
        available ? styles.availableText : styles.unavailableText,
        isLarge && styles.largeText
      ]}>
        {available ? '✓ Alabilir' : '✗ Yetersiz'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  largeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  availableBadge: {
    backgroundColor: '#D1FAE5',
  },
  unavailableBadge: {
    backgroundColor: '#FEE2E2',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
  largeText: {
    fontSize: 14,
  },
  availableText: {
    color: '#065F46',
  },
  unavailableText: {
    color: '#991B1B',
  },
});

