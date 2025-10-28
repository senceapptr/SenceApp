import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

interface RefreshIndicatorProps {
  isRefreshing: boolean;
  pullDistance: number;
}

export function RefreshIndicator({ isRefreshing, pullDistance }: RefreshIndicatorProps) {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  
  // Three dots animations
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  // Update opacity and scale based on pull distance
  useEffect(() => {
    if (!isRefreshing && pullDistance > 0) {
      // Dynamic opacity and scale based on pull
      const progress = Math.min(pullDistance / 80, 1);
      opacityAnim.setValue(progress);
      scaleAnim.setValue(progress);
    }
  }, [pullDistance, isRefreshing]);

  useEffect(() => {
    if (isRefreshing) {
      // Lock at full visibility
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 200,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();

      // Start wave animation
      const animateDot = (anim: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, {
              toValue: 1,
              duration: 400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        );
      };

      animateDot(dot1Anim, 0).start();
      animateDot(dot2Anim, 150).start();
      animateDot(dot3Anim, 300).start();
    } else if (pullDistance === 0) {
      // Fade out when released
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isRefreshing]);

  const translateY1 = dot1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const translateY2 = dot2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const translateY3 = dot3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  // Show when pulling or refreshing
  if (!isRefreshing && pullDistance <= 0) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.dotsContainer}>
        <Animated.View
          style={[
            styles.dot,
            { transform: [{ translateY: translateY1 }] },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            { transform: [{ translateY: translateY2 }] },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            { transform: [{ translateY: translateY3 }] },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#432870',
  },
});

