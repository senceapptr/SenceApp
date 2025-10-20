import React from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface MenuOverlayProps {
  overlayOpacity: Animated.Value;
  onClose: () => void;
}

export function MenuOverlay({ overlayOpacity, onClose }: MenuOverlayProps) {
  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: overlayOpacity,
        },
      ]}
      pointerEvents="none">
      <LinearGradient
        colors={[
          '#6B21A8',
          '#581C87',
          '#4C1D95',
          '#3B0764',
          '#2D1B69',
        ]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {/* Fluid overlay effect */}
      <View style={styles.fluidOverlay}>
        <LinearGradient
          colors={[
            'rgba(107, 33, 168, 0.4)',
            'transparent',
            'rgba(88, 28, 135, 0.3)',
            'transparent',
            'rgba(59, 7, 100, 0.5)',
          ]}
          style={styles.fluidGradient1}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <LinearGradient
          colors={[
            'transparent',
            'rgba(76, 29, 149, 0.3)',
            'transparent',
            'rgba(45, 27, 105, 0.4)',
          ]}
          style={styles.fluidGradient2}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  gradientBackground: {
    flex: 1,
  },
  fluidOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fluidGradient1: {
    position: 'absolute',
    top: -100,
    left: -50,
    right: 50,
    bottom: 100,
    borderRadius: 200,
    transform: [{ rotate: '15deg' }],
  },
  fluidGradient2: {
    position: 'absolute',
    top: 100,
    left: 50,
    right: -100,
    bottom: -50,
    borderRadius: 150,
    transform: [{ rotate: '-25deg' }],
  },
});



