import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface EmptyStateProps {
  onDiscover: () => void;
}

export function EmptyState({ onDiscover }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🏆</Text>
      <Text style={styles.title}>Henüz Lig Yok</Text>
      <Text style={styles.text}>Bir lige katıl veya kendi ligini oluştur!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={onDiscover}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#10B981', '#34D399']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Ligleri Keşfet</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 64,
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F0F6FC',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#8B949E',
    marginBottom: 24,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

