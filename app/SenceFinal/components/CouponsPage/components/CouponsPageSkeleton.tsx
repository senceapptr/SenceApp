import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-350, 350],
  });

  return (
    <View 
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#E5E7EB',
          overflow: 'hidden',
        },
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
          colors={['#E5E7EB', '#F3F4F6', '#E5E7EB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, width: 350 }}
        />
      </Animated.View>
    </View>
  );
}

export function CouponsPageSkeleton() {
  return (
    <View style={styles.container}>
      {/* Statistics Cards - Gerçek boyutlarla eşleşiyor */}
      <View style={styles.statisticsContainer}>
        <View style={styles.statCard}>
          <ShimmerPlaceholder width={70} height={12} borderRadius={4} style={{ marginBottom: 8 }} />
          <ShimmerPlaceholder width={30} height={20} borderRadius={4} />
        </View>
        <View style={styles.statCard}>
          <ShimmerPlaceholder width={90} height={12} borderRadius={4} style={{ marginBottom: 8 }} />
          <ShimmerPlaceholder width={30} height={20} borderRadius={4} />
        </View>
        <View style={styles.statCard}>
          <ShimmerPlaceholder width={100} height={12} borderRadius={4} style={{ marginBottom: 8 }} />
          <ShimmerPlaceholder width={30} height={20} borderRadius={4} />
        </View>
      </View>

      {/* Category Tabs - Gerçek boyutlarla eşleşiyor */}
      <View style={styles.categoryTabsContainer}>
        <View style={styles.tab}>
          <ShimmerPlaceholder width={35} height={14} borderRadius={4} style={{ marginBottom: 2 }} />
          <ShimmerPlaceholder width={15} height={12} borderRadius={4} />
        </View>
        <View style={styles.tab}>
          <ShimmerPlaceholder width={30} height={14} borderRadius={4} style={{ marginBottom: 2 }} />
          <ShimmerPlaceholder width={15} height={12} borderRadius={4} />
        </View>
        <View style={styles.tab}>
          <ShimmerPlaceholder width={50} height={14} borderRadius={4} style={{ marginBottom: 2 }} />
          <ShimmerPlaceholder width={15} height={12} borderRadius={4} />
        </View>
        <View style={styles.tab}>
          <ShimmerPlaceholder width={55} height={14} borderRadius={4} style={{ marginBottom: 2 }} />
          <ShimmerPlaceholder width={15} height={12} borderRadius={4} />
        </View>
      </View>

      {/* Empty State Skeleton */}
      <View style={styles.emptyStateContainer}>
        <View style={styles.emptyStateCard}>
          {/* Icon circle */}
          <ShimmerPlaceholder width={120} height={120} borderRadius={60} style={{ marginBottom: 32 }} />
          
          {/* Title */}
          <ShimmerPlaceholder width={180} height={24} borderRadius={4} style={{ marginBottom: 12 }} />
          
          {/* Description lines */}
          <ShimmerPlaceholder width="90%" height={15} borderRadius={4} style={{ marginBottom: 6 }} />
          <ShimmerPlaceholder width="80%" height={15} borderRadius={4} style={{ marginBottom: 32 }} />
          
          {/* Button */}
          <ShimmerPlaceholder width={220} height={56} borderRadius={16} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 150,
  },
  
  // Statistics Cards - StatisticsCards.tsx ile birebir eşleşiyor
  statisticsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  // Category Tabs - CategoryTabs.tsx ile birebir eşleşiyor
  categoryTabsContainer: {
    marginBottom: 24,
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  // Empty State
  emptyStateContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
  },
  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

});
