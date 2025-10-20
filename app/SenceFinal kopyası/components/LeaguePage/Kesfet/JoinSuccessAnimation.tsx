import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface JoinSuccessAnimationProps {
  visible: boolean;
}

export function JoinSuccessAnimation({ visible }: JoinSuccessAnimationProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.container}>
        <LinearGradient
          colors={['#432870', '#5A3A8B', '#B29EFD']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.icon}>🎉</Text>
          <Text style={styles.title}>Lige Katıldın!</Text>
          <Text style={styles.subtitle}>Liglerim sayfasına yönlendiriliyorsun...</Text>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 96,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});

