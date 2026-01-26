import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function EmptyState() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Görev yok</Text>
      <Text style={styles.subtitle}>Yeni görevler yakında burada görünecek.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#10B981',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#8B949E',
  },
});







