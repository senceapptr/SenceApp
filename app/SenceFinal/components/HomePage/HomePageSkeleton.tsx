import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Shimmer Component
function ShimmerPlaceholder({ 
  width, 
  height, 
  borderRadius = 4, 
  style 
}: { 
  width: number | string; 
  height: number; 
  borderRadius?: number; 
  style?: any;
}) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <View 
      style={[
        {
          width,
          height,
          borderRadius,
          overflow: 'hidden',
        },
        { backgroundColor: '#E5E7EB' },
        style,
      ]}
    >
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={[
            'rgba(229, 231, 235, 0)',
            'rgba(255, 255, 255, 1)',
            'rgba(229, 231, 235, 0)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, width: 300 }}
        />
      </Animated.View>
    </View>
  );
}

export function HomePageSkeleton() {
  return (
    <View style={styles.container}>
      {/* Featured Question Card Area */}
      <View style={styles.featuredSection}>
        {/* User count - sol alt */}
        <View style={styles.userCount}>
          <ShimmerPlaceholder width={50} height={20} borderRadius={4} />
        </View>
        
        {/* Time remaining - sağ alt */}
        <View style={styles.timeRemaining}>
          <ShimmerPlaceholder width={110} height={20} borderRadius={4} />
        </View>

        {/* Question text - ortada */}
        <View style={styles.questionText}>
          <ShimmerPlaceholder width="70%" height={22} borderRadius={4} style={{ marginBottom: 8, backgroundColor: '#FFFFFF' }} />
          <ShimmerPlaceholder width="50%" height={22} borderRadius={4} style={{ backgroundColor: '#FFFFFF' }} />
        </View>

        {/* Vote buttons - EVET/HAYIR */}
        <View style={styles.voteButtonsRow}>
          <ShimmerPlaceholder width="47%" height={60} borderRadius={16} style={{ backgroundColor: '#FFFFFF' }} />
          <ShimmerPlaceholder width="47%" height={60} borderRadius={16} style={{ backgroundColor: '#FFFFFF' }} />
        </View>

        {/* Pagination dots */}
        <View style={styles.paginationDots}>
          <ShimmerPlaceholder width={8} height={8} borderRadius={4} style={{ marginHorizontal: 4 }} />
          <ShimmerPlaceholder width={8} height={8} borderRadius={4} style={{ marginHorizontal: 4 }} />
          <ShimmerPlaceholder width={8} height={8} borderRadius={4} style={{ marginHorizontal: 4 }} />
          <ShimmerPlaceholder width={8} height={8} borderRadius={4} style={{ marginHorizontal: 4 }} />
          <ShimmerPlaceholder width={8} height={8} borderRadius={4} style={{ marginHorizontal: 4 }} />
        </View>
      </View>

      {/* Günlük Aktiviteler Section */}
      <View style={styles.activitiesSection}>
        <ShimmerPlaceholder width={150} height={20} borderRadius={4} style={{ marginBottom: 16 }} />
        <View style={styles.activitiesRow}>
          <ActivityButtonSkeleton />
          <ActivityButtonSkeleton />
          <ActivityButtonSkeleton />
        </View>
      </View>

      {/* Aktif Kuponlar Section */}
      <View style={styles.couponsSection}>
        <ShimmerPlaceholder width={120} height={20} borderRadius={4} style={{ marginBottom: 16 }} />
        <ShimmerPlaceholder width="100%" height={140} borderRadius={20} />
      </View>
    </View>
  );
}

// Activity Button Skeleton
function ActivityButtonSkeleton() {
  return (
    <View style={styles.activityButton}>
      <ShimmerPlaceholder width={48} height={48} borderRadius={24} style={{ marginBottom: 12 }} />
      <ShimmerPlaceholder width={60} height={14} borderRadius={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Featured Section (Question Card Area)
  featuredSection: {
    height: SCREEN_HEIGHT * 0.56,
    backgroundColor: '#e4e4e4',
    position: 'relative',
    paddingHorizontal: 24,
    paddingTop: 120,
    paddingBottom: 40,
    justifyContent: 'flex-end',
  },
  userCount: {
    position: 'absolute',
    left: 24,
    top: 120,
  },
  timeRemaining: {
    position: 'absolute',
    right: 24,
    top: 120,
  },
  questionText: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  voteButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Günlük Aktiviteler
  activitiesSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  activitiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  activityButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
  },

  // Aktif Kuponlar
  couponsSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
});
