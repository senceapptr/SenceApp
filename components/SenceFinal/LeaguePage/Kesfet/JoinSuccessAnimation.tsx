import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet, Modal } from 'react-native';

interface JoinSuccessAnimationProps {
  visible: boolean;
}

export function JoinSuccessAnimation({ visible }: JoinSuccessAnimationProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <LinearGradient
          colors={['#256EFF', '#256EFF', '#256EFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-done-circle" size={92} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Lige Katıldın!</Text>
          <Text style={styles.subtitle}>Liglerim sayfasına yönlendiriliyorsun...</Text>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    flex: 1,
  },
  gradient: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 16,
  },
});
