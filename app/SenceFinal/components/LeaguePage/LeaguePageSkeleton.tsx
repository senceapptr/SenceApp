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

export function LeaguePageSkeleton() {
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <ShimmerPlaceholder width="100%" height={56} borderRadius={24} />
      </View>

      {/* Section Title */}
      <View style={styles.sectionTitleContainer}>
        <ShimmerPlaceholder width={150} height={20} borderRadius={4} />
      </View>

      {/* League Cards */}
      <View style={styles.cardsContainer}>
        <LeagueCardSkeleton />
        <LeagueCardSkeleton />
      </View>
    </View>
  );
}

// Skeleton for individual league card
function LeagueCardSkeleton() {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          {/* Title */}
          <ShimmerPlaceholder width="80%" height={18} borderRadius={4} style={{ marginBottom: 8 }} />
          {/* Description */}
          <ShimmerPlaceholder width="95%" height={14} borderRadius={4} style={{ marginBottom: 12 }} />
          {/* Meta row (Badge + separator + username) */}
          <View style={styles.metaRow}>
            <ShimmerPlaceholder width={60} height={20} borderRadius={12} />
            <ShimmerPlaceholder width={4} height={4} borderRadius={2} style={{ marginHorizontal: 8 }} />
            <ShimmerPlaceholder width={120} height={12} borderRadius={4} />
          </View>
        </View>
        <View style={styles.cardHeaderRight}>
          {/* Prize/Position */}
          <ShimmerPlaceholder width={70} height={18} borderRadius={4} style={{ marginBottom: 4 }} />
          <ShimmerPlaceholder width={50} height={14} borderRadius={4} />
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <ShimmerPlaceholder width={80} height={14} borderRadius={4} />
        <ShimmerPlaceholder width={100} height={14} borderRadius={4} />
      </View>

      {/* Join Button */}
      <ShimmerPlaceholder width="100%" height={48} borderRadius={24} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 180,
    paddingHorizontal: 20,
  },

  // Search Bar
  searchBarContainer: {
    marginBottom: 24,
  },

  // Section Title
  sectionTitleContainer: {
    marginBottom: 16,
  },

  // Cards Container
  cardsContainer: {
    gap: 16,
  },

  // League Card
  card: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F2F3F5',
    padding: 24,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 16,
  },
  cardHeaderRight: {
    alignItems: 'flex-end',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});


