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
        {available ? 'Satın Al' : 'Kredi Yetersiz'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  largeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  availableBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    borderColor: 'rgba(16, 185, 129, 0.28)',
    borderWidth: 1,
  },
  unavailableBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.26)',
    borderWidth: 1,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
  },
  largeText: {
    fontSize: 15,
  },
  availableText: {
    color: '#10B981',
  },
  unavailableText: {
    color: '#EF4444',
  },
});
