import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EmptyStateProps } from '../types';

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🛍️</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 200,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202020',
    opacity: 0.6,
    textAlign: 'center',
  },
});

