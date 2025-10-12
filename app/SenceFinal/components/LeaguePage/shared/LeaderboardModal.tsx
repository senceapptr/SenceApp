import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
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
  
  if (!league) return null;

  const currentUser = mockLeaderboardData.find(user => user.isCurrentUser);
  const shouldShowAtTop = currentUser && (currentUser.rank <= 3 || scrollY > 200);
  const shouldShowAtBottom = currentUser && currentUser.rank > 10 && scrollY < 200;

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
            scrollEventThrottle={16}
          >
            {mockLeaderboardData.map((user) => (
              <View
                key={user.rank}
                style={[
                  styles.item,
                  user.isCurrentUser && styles.itemCurrent
                ]}
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
                  <Text style={styles.username}>
                    {user.username}
                    {user.isCurrentUser && <Text style={styles.currentLabel}> (Sen)</Text>}
                  </Text>
                  <Text style={styles.userStats}>
                    {user.correctPredictions}/{user.totalPredictions} doğru
                  </Text>
                </View>
                <View style={styles.points}>
                  <Text style={styles.pointsValue}>{user.points}</Text>
                  <Text style={styles.pointsLabel}>puan</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Fixed User Rank */}
          {shouldShowAtTop && currentUser && (
            <View style={styles.fixedTop}>
              <View style={[
                styles.fixedItem,
                currentUser.rank === 1 && styles.fixedGold,
                currentUser.rank === 2 && styles.fixedSilver,
                currentUser.rank === 3 && styles.fixedBronze
              ]}>
                <View style={[
                  styles.fixedRank,
                  currentUser.rank === 1 && styles.fixedRankGold,
                  currentUser.rank === 2 && styles.fixedRankSilver,
                  currentUser.rank === 3 && styles.fixedRankBronze
                ]}>
                  <Text style={styles.fixedRankText}>#{currentUser.rank}</Text>
                </View>
                <View style={styles.fixedAvatar}>
                  <Text style={styles.fixedAvatarText}>👤</Text>
                </View>
                <View style={styles.fixedInfo}>
                  <Text style={styles.fixedName}>{currentUser.username}</Text>
                  <Text style={styles.fixedStats}>
                    {currentUser.correctPredictions}/{currentUser.totalPredictions} doğru
                  </Text>
                </View>
                <View style={styles.fixedPoints}>
                  <Text style={styles.fixedPointsValue}>{currentUser.points}</Text>
                  <Text style={styles.fixedPointsLabel}>puan</Text>
                </View>
              </View>
            </View>
          )}

          {shouldShowAtBottom && currentUser && (
            <View style={styles.fixedBottom}>
              <View style={[
                styles.fixedItem,
                currentUser.rank === 1 && styles.fixedGold,
                currentUser.rank === 2 && styles.fixedSilver,
                currentUser.rank === 3 && styles.fixedBronze
              ]}>
                <View style={[
                  styles.fixedRank,
                  currentUser.rank === 1 && styles.fixedRankGold,
                  currentUser.rank === 2 && styles.fixedRankSilver,
                  currentUser.rank === 3 && styles.fixedRankBronze
                ]}>
                  <Text style={styles.fixedRankText}>#{currentUser.rank}</Text>
                </View>
                <View style={styles.fixedAvatar}>
                  <Text style={styles.fixedAvatarText}>👤</Text>
                </View>
                <View style={styles.fixedInfo}>
                  <Text style={styles.fixedName}>{currentUser.username}</Text>
                  <Text style={styles.fixedStats}>
                    {currentUser.correctPredictions}/{currentUser.totalPredictions} doğru
                  </Text>
                </View>
                <View style={styles.fixedPoints}>
                  <Text style={styles.fixedPointsValue}>{currentUser.points}</Text>
                  <Text style={styles.fixedPointsLabel}>puan</Text>
                </View>
              </View>
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
    marginHorizontal: 8,
    maxHeight: '85%',
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
  },
  itemCurrent: {
    backgroundColor: '#FDF4FF',
    borderColor: '#432870',
    borderWidth: 2,
  },
  rank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankGold: {
    backgroundColor: '#FFD700',
  },
  rankSilver: {
    backgroundColor: '#C0C0C0',
  },
  rankBronze: {
    backgroundColor: '#CD7F32',
  },
  rankText: {
    fontSize: 14,
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
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  fixedRankGold: {
    backgroundColor: '#FFD700',
  },
  fixedRankSilver: {
    backgroundColor: '#C0C0C0',
  },
  fixedRankBronze: {
    backgroundColor: '#CD7F32',
  },
  fixedRankText: {
    fontSize: 12,
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
  },
  fixedName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 1,
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

