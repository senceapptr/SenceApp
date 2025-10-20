import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AnimatedHeroGradientProps {
  height: number;
  borderRadius?: number;
  speed?: number;
  children?: React.ReactNode;
}

export function AnimatedHeroGradient({
  height,
  borderRadius = 18,
  speed = 8000,
  children,
}: AnimatedHeroGradientProps) {
  // Animation values for each blob
  const blob1Anim = useRef(new Animated.Value(0)).current;
  const blob2Anim = useRef(new Animated.Value(0)).current;
  const blob3Anim = useRef(new Animated.Value(0)).current;
  const blob4Anim = useRef(new Animated.Value(0)).current;
  const blob5Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create infinite looping animations with different speeds
    const createAnimation = (animValue: Animated.Value, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start all animations
    createAnimation(blob1Anim, speed).start();
    createAnimation(blob2Anim, speed * 1.1).start();
    createAnimation(blob3Anim, speed * 0.9).start();
    createAnimation(blob4Anim, speed * 1.2).start();
    createAnimation(blob5Anim, speed * 0.85).start();
  }, [speed]);

  return (
    <View style={[styles.container, { height, borderRadius, overflow: 'hidden' }]}>
      {/* Blob 1 - Deep Purple */}
      <Animated.View
        style={[
          styles.blob,
          {
            width: height * 1.5,
            height: height * 1.5,
            borderRadius: height * 0.75,
            transform: [
              {
                translateX: blob1Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-height * 0.3, SCREEN_WIDTH - height * 0.2],
                }),
              },
              {
                translateY: blob1Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-height * 0.2, height * 0.2],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['#2B1560', 'transparent']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Blob 2 - Blue Violet */}
      <Animated.View
        style={[
          styles.blob,
          {
            width: height * 1.3,
            height: height * 1.3,
            borderRadius: height * 0.65,
            transform: [
              {
                translateX: blob2Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [SCREEN_WIDTH - height * 0.2, -height * 0.3],
                }),
              },
              {
                translateY: blob2Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [height * 0.1, -height * 0.1],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['#8A2BE2', 'transparent']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Blob 3 - Magenta */}
      <Animated.View
        style={[
          styles.blob,
          {
            width: height * 1.2,
            height: height * 1.2,
            borderRadius: height * 0.6,
            transform: [
              {
                translateX: blob3Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [SCREEN_WIDTH * 0.2, SCREEN_WIDTH * 0.8],
                }),
              },
              {
                translateY: blob3Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [height * 0.3, -height * 0.1],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['#C33CDE', 'transparent']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Blob 4 - Orange */}
      <Animated.View
        style={[
          styles.blob,
          {
            width: height * 1.1,
            height: height * 1.1,
            borderRadius: height * 0.55,
            transform: [
              {
                translateX: blob4Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [SCREEN_WIDTH * 0.7, SCREEN_WIDTH * 0.1],
                }),
              },
              {
                translateY: blob4Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-height * 0.2, height * 0.3],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['#F2A65A', 'transparent']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Blob 5 - Deep Purple/Magenta Mix */}
      <Animated.View
        style={[
          styles.blob,
          {
            width: height * 1.4,
            height: height * 1.4,
            borderRadius: height * 0.7,
            transform: [
              {
                translateX: blob5Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [SCREEN_WIDTH * 0.1, SCREEN_WIDTH * 0.9],
                }),
              },
              {
                translateY: blob5Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [height * 0.2, -height * 0.3],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['#6B2D9E', 'transparent']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Children overlay */}
      {children && (
        <View style={styles.childrenContainer}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#1A0B2E', // Dark purple base
  },
  blob: {
    position: 'absolute',
    opacity: 0.7,
  },
  gradient: {
    flex: 1,
    borderRadius: 1000, // Very large to ensure circular
  },
  childrenContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});