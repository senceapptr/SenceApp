import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withTiming,
  withSequence
} from 'react-native-reanimated';

interface TasksButtonProps {
  onTasks?: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function TasksButton({ onTasks }: TasksButtonProps) {
  const scale = useSharedValue(1);
  const iconRotation = useSharedValue(0);
  const iconScale = useSharedValue(1);
  const arrowX = useSharedValue(0);
  const particleOpacity = useSharedValue(0.3);

  React.useEffect(() => {
    // Continuous animations
    iconRotation.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 1200 }),
        withTiming(-5, { duration: 1200 }),
        withTiming(0, { duration: 1200 })
      ),
      -1,
      false
    );

    iconScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1200 }),
        withTiming(1, { duration: 1200 })
      ),
      -1,
      false
    );

    arrowX.value = withRepeat(
      withSequence(
        withTiming(3, { duration: 800 }),
        withTiming(0, { duration: 800 })
      ),
      -1,
      false
    );

    particleOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200 }),
        withTiming(0.3, { duration: 1200 })
      ),
      -1,
      false
    );
  }, []);

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${iconRotation.value}deg` },
      { scale: iconScale.value }
    ],
  }));

  const arrowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: arrowX.value }],
  }));

  return (
    <AnimatedTouchableOpacity
      style={[styles.container, animatedStyle]}
      onPress={onTasks}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={['#059669', '#10B981', '#34D399']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {/* Animated Background Pattern */}
        <View style={styles.backgroundPattern} />

        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.leftContent}>
            {/* Animated Icon */}
            <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
              <LinearGradient
                colors={['#FEF3C7', '#FDE68A', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                <Text style={styles.iconText}>📋</Text>
              </LinearGradient>
            </Animated.View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>Görevler</Text>
            </View>
          </View>

          {/* Animated Arrow */}
          <View style={styles.rightContent}>
            <Animated.View style={[styles.arrowContainer, arrowAnimatedStyle]}>
              <Text style={styles.arrow}>›</Text>
            </Animated.View>
          </View>
        </View>

        {/* Bottom Accent Line */}
        <LinearGradient
          colors={['#FEF3C7', '#FDE68A', '#FEF3C7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.accentLine}
        />

        {/* Floating Particles */}
        <View style={styles.particlesContainer}>
          {Array.from({ length: 5 }, (_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                {
                  left: `${15 + i * 15}%`,
                  top: `${25 + (i % 2) * 50}%`,
                },
                {
                  opacity: particleOpacity,
                }
              ]}
            />
          ))}
        </View>
      </LinearGradient>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: 'relative',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 10,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
  },
  rightContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardInfo: {
    alignItems: 'flex-end',
  },
  multiplier: {
    color: '#FEF3C7',
    fontSize: 14,
    fontWeight: '800',
  },
  multiplierLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
  },
  arrowContainer: {
    opacity: 0.8,
  },
  arrow: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 18,
    fontWeight: 'bold',
  },
  accentLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    opacity: 0.5,
  },
  particle: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: '#FEF3C7',
    borderRadius: 1.5,
  },
});
