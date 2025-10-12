import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CreateCardProps {
  onCreatePress: () => void;
}

export function CreateCard({ onCreatePress }: CreateCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.icon}>🏆</Text>
        <Text style={styles.title}>Kendi ligin, kendi kuralların.</Text>
        <Text style={styles.text}>
          Sadece izlemekle yetinme. Arkadaşlarını topla, ligini kur, sıralamada 1. ol!
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={onCreatePress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#432870', '#B29EFD']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>🚀 Lig Oluşturmaya Başla</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(67, 40, 112, 0.1)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: 'rgba(67, 40, 112, 0.3)',
    marginBottom: 16,
  },
  content: {
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 12,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: 'rgba(32, 32, 32, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

