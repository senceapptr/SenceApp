import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useAuth } from '@/contexts/AuthContext';
import { leaguesService } from '@/services/leagues.service';
import { League, LeaderboardUser } from '../types';

interface LeaderboardModalProps {
  visible: boolean;
  league: League | null;
  onClose: () => void;
}

export function LeaderboardModal({ visible, league, onClose }: LeaderboardModalProps) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(false);

  // Animation for gold crown
  const crownRotation = useSharedValue(0);

  useEffect(() => {
    crownRotation.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 500 }),
        withTiming(5, { duration: 500 }),
        withTiming(0, { duration: 500 })
      ),
      -1,
      true
    );
  }, []);

  const crownAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${crownRotation.value}deg` }],
  }));

  const loadLeaderboardData = async () => {
    if (!league || !user) return;

    try {
      setLoading(true);
      const result = await leaguesService.getLeagueMembers(league.id);

      if (result.data) {
        const mappedLeaderboard: LeaderboardUser[] = result.data.map((member: any, index: number) => ({
          rank: index + 1,
          username: member.profiles?.username || 'Anonim',
          points: member.points || 0,
          streak: 0,
          correctPredictions: member.correct_predictions || 0,
          totalPredictions: member.total_predictions || 0,
          avatar: member.profiles?.profile_image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
          isCurrentUser: member.user_id === user.id,
        }));
        setLeaderboardData(mappedLeaderboard);
      }
    } catch (err) {
      console.error('Leaderboard load error:', err);
      Alert.alert('Hata', 'Sıralama verileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && league) {
      loadLeaderboardData();
    }
  }, [visible, league]);

  if (!league) return null;

  const currentUser = leaderboardData.find(u => u.isCurrentUser);

  // Create placeholder users if leaderboard has fewer than 3 entries
  const createPlaceholderUser = (rank: number): LeaderboardUser => ({
    rank,
    username: rank === 1 ? '1. Sıra Seni Bekliyor!' : rank === 2 ? '2. Sıra Boş' : '3. Sıra Boş',
    points: 0,
    streak: 0,
    correctPredictions: 0,
    totalPredictions: 0,
    avatar: `https://api.dicebear.com/7.x/bottts/png?seed=placeholder${rank}&backgroundColor=transparent`,
    isCurrentUser: false,
    isPlaceholder: true,
  });

  // Fill top 3 with placeholders if needed
  const top3WithPlaceholders = [...leaderboardData.slice(0, 3)];
  while (top3WithPlaceholders.length < 3) {
    top3WithPlaceholders.push(createPlaceholderUser(top3WithPlaceholders.length + 1));
  }

  const top3 = top3WithPlaceholders;
  const rest = leaderboardData.slice(3);

  // Reorder for podium display: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]];

  const getPodiumHeight = (rank: number) => {
    switch (rank) {
      case 1: return 100;
      case 2: return 75;
      case 3: return 55;
      default: return 50;
    }
  };

  const getPodiumColor = (rank: number) => {
    switch (rank) {
      case 1: return ['#FFD700', '#FFA500'];
      case 2: return ['#C0C0C0', '#A8A8A8'];
      case 3: return ['#CD7F32', '#B8722D'];
      default: return ['#6B7280', '#525252'];
    }
  };

  const getCrownIcon = (rank: number) => {
    switch (rank) {
      case 1: return '👑';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
      presentationStyle="fullScreen"
    >
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          {/* Header */}
          <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 8 }]}>
            <TouchableOpacity style={styles.backButton} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>🏆 Sıralama</Text>
              <Text style={styles.headerSubtitle}>{league.name}</Text>
            </View>

            <View style={styles.headerPlaceholder} />
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#10B981" />
              <Text style={styles.loadingText}>Sıralama yükleniyor...</Text>
            </View>
          ) : (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Podium Section */}
              {top3.length > 0 && (
                <View style={styles.podiumSection}>
                  <View style={styles.podiumContainer}>
                    {podiumOrder.map((user, index) => {
                      if (!user) return null;
                      return (
                        <View key={user.rank} style={styles.podiumItem}>
                          {/* Avatar & Crown */}
                          <View style={styles.podiumAvatarContainer}>
                            {user.rank === 1 ? (
                              <Animated.Text style={[styles.crownIcon, crownAnimatedStyle]}>
                                👑
                              </Animated.Text>
                            ) : getCrownIcon(user.rank) ? (
                              <Text style={styles.medalIcon}>{getCrownIcon(user.rank)}</Text>
                            ) : null}

                            <View style={[
                              styles.podiumAvatarBorder,
                              { borderColor: getPodiumColor(user.rank)[0] }
                            ]}>
                              <Image
                                source={{ uri: user.avatar }}
                                style={styles.podiumAvatar}
                              />
                            </View>
                          </View>

                          {/* Username */}
                          <Text
                            style={[
                              styles.podiumUsername,
                              user.isCurrentUser && styles.podiumUsernameCurrent
                            ]}
                            numberOfLines={1}
                          >
                            {user.username}
                          </Text>

                          {/* Points */}
                          <Text style={styles.podiumPoints}>{user.points} puan</Text>

                          {/* Podium Stand */}
                          <LinearGradient
                            colors={getPodiumColor(user.rank) as [string, string]}
                            style={[
                              styles.podiumStand,
                              { height: getPodiumHeight(user.rank) }
                            ]}
                          >
                            <Text style={styles.podiumRank}>#{user.rank}</Text>
                          </LinearGradient>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Rest of the list */}
              {rest.length > 0 && (
                <View style={styles.listSection}>
                  {rest.map((user) => (
                    <View
                      key={user.rank}
                      style={[
                        styles.listItem,
                        user.isCurrentUser && styles.listItemCurrent
                      ]}
                    >
                      <View style={styles.listRank}>
                        <Text style={styles.listRankText}>#{user.rank}</Text>
                      </View>

                      <Image
                        source={{ uri: user.avatar }}
                        style={styles.listAvatar}
                      />

                      <View style={styles.listInfo}>
                        <Text style={[
                          styles.listUsername,
                          user.isCurrentUser && styles.listUsernameCurrent
                        ]} numberOfLines={1}>
                          {user.username}
                          {user.isCurrentUser && <Text style={styles.youLabel}> (Sen)</Text>}
                        </Text>
                        <Text style={styles.listStats}>
                          {user.correctPredictions}/{user.totalPredictions} doğru
                        </Text>
                      </View>

                      <View style={styles.listPoints}>
                        <Text style={styles.listPointsValue}>{user.points}</Text>
                        <Text style={styles.listPointsLabel}>puan</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Fixed current user if not in top 10 */}
              {currentUser && currentUser.rank > 10 && (
                <View style={styles.fixedUserContainer}>
                  <View style={styles.fixedUserDivider}>
                    <Text style={styles.fixedUserDividerText}>• • •</Text>
                  </View>
                  <View style={[styles.listItem, styles.listItemCurrent]}>
                    <View style={styles.listRank}>
                      <Text style={styles.listRankText}>#{currentUser.rank}</Text>
                    </View>
                    <Image
                      source={{ uri: currentUser.avatar }}
                      style={styles.listAvatar}
                    />
                    <View style={styles.listInfo}>
                      <Text style={[styles.listUsername, styles.listUsernameCurrent]} numberOfLines={1}>
                        {currentUser.username}
                        <Text style={styles.youLabel}> (Sen)</Text>
                      </Text>
                      <Text style={styles.listStats}>
                        {currentUser.correctPredictions}/{currentUser.totalPredictions} doğru
                      </Text>
                    </View>
                    <View style={styles.listPoints}>
                      <Text style={styles.listPointsValue}>{currentUser.points}</Text>
                      <Text style={styles.listPointsLabel}>puan</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Empty space at bottom */}
              <View style={{ height: 40 }} />
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  headerPlaceholder: {
    width: 44,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  content: {
    flex: 1,
  },
  podiumSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  podiumItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 95,
  },
  podiumAvatarContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  crownIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  medalIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  podiumAvatarBorder: {
    borderWidth: 3,
    borderRadius: 32,
    padding: 2,
  },
  podiumAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  podiumUsername: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
    maxWidth: 90,
  },
  podiumUsernameCurrent: {
    color: '#10B981',
  },
  podiumPoints: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
  },
  podiumStand: {
    width: 80,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumRank: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  listSection: {
    paddingHorizontal: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  listItemCurrent: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  listRank: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listRankText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
  },
  listUsername: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  listUsernameCurrent: {
    color: '#10B981',
  },
  youLabel: {
    fontWeight: '700',
    color: '#10B981',
  },
  listStats: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  listPoints: {
    alignItems: 'flex-end',
  },
  listPointsValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10B981',
  },
  listPointsLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  fixedUserContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  fixedUserDivider: {
    alignItems: 'center',
    marginBottom: 12,
  },
  fixedUserDividerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
  },
});
