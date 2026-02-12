import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EmptyStateProps } from '../types';

export const EmptyState: React.FC<EmptyStateProps> = ({ message, title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 96,
  },
  message: {
    color: '#8B949E',
    fontSize: 14,
    lineHeight: 21,
    maxWidth: 320,
    textAlign: 'center',
  },
  title: {
    color: '#F0F6FC',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
});
