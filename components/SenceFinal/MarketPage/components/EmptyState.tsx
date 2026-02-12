import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EmptyStateProps } from '../types';

export function EmptyState({ message, iconName = 'bag-outline', actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name={iconName as any} size={34} color="#256EFF" />
      </View>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <TouchableOpacity style={styles.actionButton} onPress={onAction} activeOpacity={0.8}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
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
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: '#30363D',
    backgroundColor: '#161B22',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B949E',
    textAlign: 'center',
  },
  actionButton: {
    marginTop: 16,
    backgroundColor: '#256EFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
