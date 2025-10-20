import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { League } from '../types';
import { mockLeaderboardData } from '../utils';

interface LeaderboardModalProps {
  visible: boolean;
  league: League | null;
  onClose: () => void;
}

export function LeaderboardModal({ visible, league, onClose }: LeaderboardModalProps) {
  const [scrollY, setScrollY] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  
  // Animation for gold rank glow effect
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
    
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);
  
  if (!league) return null;

  const currentUser = mockLeaderboardData.find(user => user.isCurrentUser);
  
  // Calculate if current user should be sticky
  const currentUserIndex = currentUser ? currentUser.rank - 1 : -1;
  const itemHeight = 80; // Approximate height of each item
  const currentUserPosition = currentUserIndex * itemHeight;
  const stickyThreshold = 50; // Threshold for showing sticky
  
  // Always keep at bottom (sticky), regardless of scroll position
  const shouldShowAtBottom = Boolean(currentUser);
  
  // Never show at top - always keep at bottom
  const shouldShowAtTop = false;
  
  // Sticky is always shown at bottom if current user exists
  const shouldShowSticky = shouldShowAtBottom;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <LinearGradient
            colors={['#432870', '#5A3A8B', '#B29EFD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>🏆 Sıralama</Text>
            <Text style={styles.headerSubtitle}>{league.name}</Text>
          </LinearGradient>

          <ScrollView 
            style={styles.body}
            showsVerticalScrollIndicator={true}
            onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)}
            onContentSizeChange={(width, height) => setContentHeight(height)}
            onLayout={(event) => setScrollViewHeight(event.nativeEvent.layout.height)}
            scrollEventThrottle={16}
          >
            {mockLeaderboardData.map((user) => {
              const isGoldRank = user.rank === 1;
              const animatedOpacity = glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              });
              
              const ItemComponent = isGoldRank ? Animated.View : View;
              const itemStyle = isGoldRank 
                ? [
                    styles.item,
                    styles.itemGold,
                    user.isCurrentUser && styles.itemCurrent,
                    {
                      transform: [{ scale: pulseAnim }],
                      shadowOpacity: animatedOpacity,
                    }
                  ]
                : [
                    styles.item,
                    user.rank === 2 && styles.itemSilver,
                    user.rank === 3 && styles.itemBronze,
                    user.isCurrentUser && styles.itemCurrent
                  ];
              
              return (
                <ItemComponent
                  key={user.rank}
                  style={itemStyle}
                >
                <View
                  style={[
                    styles.rank,
                    user.rank === 1 && styles.rankGold,
                    user.rank === 2 && styles.rankSilver,
                    user.rank === 3 && styles.rankBronze,
                  ]}
                >
                  <Text style={styles.rankText}>#{user.rank}</Text>
                </View>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>👤</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">
                    {user.username}
                    {user.isCurrentUser && <Text style={styles.currentLabel}> (Sen)</Text>}
                  </Text>
                  <Text style={styles.userStats} numberOfLines={1}>
                    {user.correctPredictions}/{user.totalPredictions} doğru
                  </Text>
                </View>
                <View style={styles.points}>
                  <Text style={styles.pointsValue}>{user.points}</Text>
                  <Text style={styles.pointsLabel}>puan</Text>
                </View>
              </ItemComponent>
            )})}
          </ScrollView>

          {/* Fixed User Rank - Always show at bottom */}
          {shouldShowSticky && currentUser && (
            <View style={styles.fixedBottom}>
              {currentUser.rank === 1 ? (
                <Animated.View style={[
                  styles.fixedItem,
                  styles.fixedItemGold,
                  currentUser.isCurrentUser && styles.fixedCurrent,
                  {
                    transform: [{ scale: pulseAnim }],
                    shadowOpacity: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    }),
                  }
                ]}>
                  <View style={[
                    styles.fixedRank,
                    styles.fixedRankGold,
                  ]}>
                    <Text style={styles.fixedRankText}>#{currentUser.rank}</Text>
                  </View>
                  <View style={styles.fixedAvatar}>
                    <Text style={styles.fixedAvatarText}>👤</Text>
                  </View>
                  <View style={styles.fixedInfo}>
                    <Text style={styles.fixedName} numberOfLines={1} ellipsizeMode="tail">
                      {currentUser.username} (Sen)
                    </Text>
                    <Text style={styles.fixedStats} numberOfLines={1}>
                      {currentUser.correctPredictions}/{currentUser.totalPredictions} doğru
                    </Text>
                  </View>
                  <View style={styles.fixedPoints}>
                    <Text style={styles.fixedPointsValue}>{currentUser.points}</Text>
                    <Text style={styles.fixedPointsLabel}>puan</Text>
                  </View>
                </Animated.View>
              ) : (
                <View style={[
                  styles.fixedItem,
                  currentUser.rank === 2 && styles.fixedItemSilver,
                  currentUser.rank === 3 && styles.fixedItemBronze,
                  currentUser.isCurrentUser && styles.fixedCurrent
                ]}>
                  <View style={[
                    styles.fixedRank,
                    currentUser.rank === 2 && styles.fixedRankSilver,
                    currentUser.rank === 3 && styles.fixedRankBronze
                  ]}>
                    <Text style={styles.fixedRankText}>#{currentUser.rank}</Text>
                  </View>
                  <View style={styles.fixedAvatar}>
                    <Text style={styles.fixedAvatarText}>👤</Text>
                  </View>
                  <View style={styles.fixedInfo}>
                    <Text style={styles.fixedName} numberOfLines={1} ellipsizeMode="tail">
                      {currentUser.username} (Sen)
                    </Text>
                    <Text style={styles.fixedStats} numberOfLines={1}>
                      {currentUser.correctPredictions}/{currentUser.totalPredictions} doğru
                    </Text>
                  </View>
                  <View style={styles.fixedPoints}>
                    <Text style={styles.fixedPointsValue}>{currentUser.points}</Text>
                    <Text style={styles.fixedPointsLabel}>puan</Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginTop: 60,
    marginBottom: 20,
    marginHorizontal: 2,
    maxHeight: '85%',
    overflow: 'hidden',
    minWidth: 360,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 4,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 76, // leave space for sticky bottom
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 80,
  },
  itemGold: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FFD700',
    borderWidth: 3,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  itemSilver: {
    backgroundColor: '#F3E8FF',
    borderColor: '#8B5CF6',
    borderWidth: 2,
  },
  itemBronze: {
    backgroundColor: '#FED7AA',
    borderColor: '#F59E0B',
  },
  itemCurrent: {
    backgroundColor: '#FDF4FF',
    borderColor: '#432870',
    borderWidth: 2,
  },
  rank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rankGold: {
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  rankSilver: {
    backgroundColor: '#8B5CF6',
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  rankBronze: {
    backgroundColor: '#F59E0B',
    borderWidth: 2,
    borderColor: '#D97706',
  },
  rankText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  userInfo: {
    flex: 1,
    minWidth: 0, // Allow text to shrink
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
    flexShrink: 1,
  },
  currentLabel: {
    color: '#432870',
    fontWeight: '700',
  },
  userStats: {
    fontSize: 14,
    color: '#6B7280',
  },
  points: {
    alignItems: 'flex-end',
    minWidth: 90,
  },
  pointsValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  fixedTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  fixedBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  fixedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fixedItemGold: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FFD700',
    borderWidth: 3,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fixedItemSilver: {
    backgroundColor: '#F3E8FF',
    borderColor: '#8B5CF6',
    borderWidth: 2,
  },
  fixedItemBronze: {
    backgroundColor: '#FED7AA',
    borderColor: '#F59E0B',
  },
  fixedGold: {
    backgroundColor: '#FFF8DC',
    borderColor: '#FFD700',
  },
  fixedSilver: {
    backgroundColor: '#F5F5F5',
    borderColor: '#C0C0C0',
  },
  fixedBronze: {
    backgroundColor: '#FFF2CC',
    borderColor: '#CD7F32',
  },
  fixedRank: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  fixedRankGold: {
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  fixedRankSilver: {
    backgroundColor: '#8B5CF6',
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  fixedRankBronze: {
    backgroundColor: '#F59E0B',
    borderWidth: 2,
    borderColor: '#D97706',
  },
  fixedRankText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  fixedAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  fixedAvatarText: {
    fontSize: 16,
  },
  fixedInfo: {
    flex: 1,
    minWidth: 0, // Allow text to shrink
  },
  fixedName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 1,
    flexShrink: 1,
  },
  fixedCurrent: {
    backgroundColor: '#FDF4FF',
    borderColor: '#432870',
    borderWidth: 2,
  },
  fixedStats: {
    fontSize: 12,
    color: '#6B7280',
  },
  fixedPoints: {
    alignItems: 'flex-end',
  },
  fixedPointsValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#432870',
  },
  fixedPointsLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
});

