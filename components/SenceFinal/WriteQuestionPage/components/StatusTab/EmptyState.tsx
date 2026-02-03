import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const EmptyState: React.FC = () => {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📝</Text>
      <Text style={styles.emptyTitle}>Henüz soru göndermemişsin</Text>
      <Text style={styles.emptySubtitle}>İlk sorununu yazmak için "Soru Yaz" sekmesine geç</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'rgba(32,32,32,0.7)',
    textAlign: 'center',
  },
});


