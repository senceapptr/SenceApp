import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { leaguesService } from '@/services/leagues.service';

import { PRIMARY_BLUE } from './theme';
import { League, LeaderboardUser } from '../types';

interface LeaderboardModalProps {
  visible: boolean;
  onClose: () => void;
  league: League | null;
}

const PLACEHOLDER_AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=72&h=72&fit=crop&crop=face';

const createPlaceholder = (rank: number): LeaderboardUser => ({
  avatar: PLACEHOLDER_AVATAR,
  correctPredictions: 0,
  isCurrentUser: false,
  isPlaceholder: true,
  points: 0,
  rank,
  streak: 0,
  totalPredictions: 0,
  username: rank === 1 ? '1. sıra boş' : rank === 2 ? '2. sıra boş' : '3. sıra boş',
});

export function LeaderboardModal({ league, onClose, visible }: LeaderboardModalProps) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);

  const loadLeaderboardData = useCallback(async () => {
    if (!league || !user) return;

    try {
      setLoading(true);
      const result = await leaguesService.getLeagueMembers(league.id);

      if (result.data) {
        const mappedData: LeaderboardUser[] = result.data.map((member: any, index: number) => ({
          avatar: member.profiles?.profile_image || PLACEHOLDER_AVATAR,
          correctPredictions: member.correct_predictions || 0,
          isCurrentUser: member.user_id === user.id,
          points: member.points || 0,
          rank: member.rank || index + 1,
          streak: 0,
          totalPredictions: member.total_predictions || 0,
          username: member.profiles?.username || 'Anonim',
        }));
        setLeaderboardData(mappedData);
      } else {
        setLeaderboardData([]);
      }
    } catch (err) {
      console.error('Leaderboard load error:', err);
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  }, [league, user]);

  useEffect(() => {
    if (visible && league) {
      loadLeaderboardData();
    }
  }, [league, loadLeaderboardData, visible]);

  const sortedUsers = useMemo(() => {
    return [...leaderboardData].sort((a, b) => a.rank - b.rank);
  }, [leaderboardData]);

  const topThree = useMemo(() => {
    return [1, 2, 3].map(rank => sortedUsers.find(userItem => userItem.rank === rank) || createPlaceholder(rank));
  }, [sortedUsers]);

  const podiumOrder = useMemo(() => [topThree[1], topThree[0], topThree[2]], [topThree]);
  const listFromFour = useMemo(() => sortedUsers.filter(userItem => userItem.rank >= 4), [sortedUsers]);

  if (!league) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 8 }]}>
          <TouchableOpacity style={styles.backButton} onPress={onClose} activeOpacity={0.75}>
            <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Sıralama</Text>
            <Text style={styles.headerSubtitle}>{league.name}</Text>
          </View>
          <View style={styles.headerPlaceholder} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={PRIMARY_BLUE} />
            <Text style={styles.loadingText}>Sıralama yükleniyor...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.podiumSection}>
              {podiumOrder.map(userItem => {
                const isFirst = userItem.rank === 1;

                return (
                  <View
                    key={`${userItem.rank}-${userItem.username}`}
                    style={[styles.podiumItem, isFirst && styles.podiumItemCenter]}
                  >
                    <View style={[styles.rankBadge, isFirst && styles.rankBadgeCenter]}>
                      <Text style={styles.rankBadgeText}>#{userItem.rank}</Text>
                    </View>
                    <Image
                      source={{ uri: userItem.avatar }}
                      style={[styles.podiumAvatar, userItem.isPlaceholder && styles.placeholderAvatar]}
                    />
                    <Text
                      style={[styles.podiumUsername, userItem.isCurrentUser && styles.currentUsername]}
                      numberOfLines={1}
                    >
                      {userItem.username}
                    </Text>
                    <Text style={styles.podiumPoints}>{userItem.points} puan</Text>
                    <View style={[styles.podiumStand, isFirst && styles.podiumStandCenter]} />
                  </View>
                );
              })}
            </View>

            <View style={styles.listSection}>
              <Text style={styles.listTitle}>Sıralama</Text>

              {listFromFour.length === 0 ? (
                <View style={styles.listEmptyState}>
                  <Ionicons name="list-outline" size={22} color="rgba(255,255,255,0.55)" />
                  <Text style={styles.listEmptyText}>Henüz 4+ sıralama oluşmadı</Text>
                </View>
              ) : (
                listFromFour.map(userItem => (
                  <View
                    key={`${userItem.rank}-${userItem.username}`}
                    style={[styles.listItem, userItem.isCurrentUser && styles.currentListItem]}
                  >
                    <Text style={styles.listRank}>#{userItem.rank}</Text>
                    <Image source={{ uri: userItem.avatar }} style={styles.listAvatar} />
                    <View style={styles.listInfo}>
                      <Text
                        style={[styles.listUsername, userItem.isCurrentUser && styles.currentUsername]}
                        numberOfLines={1}
                      >
                        {userItem.username}
                      </Text>
                      <Text style={styles.listMeta}>
                        {userItem.correctPredictions}/{userItem.totalPredictions} doğru
                      </Text>
                    </View>
                    <Text style={styles.listPoints}>{userItem.points}</Text>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  container: {
    backgroundColor: '#0D1117',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 36,
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  currentListItem: {
    backgroundColor: 'rgba(37,110,255,0.12)',
    borderColor: 'rgba(37,110,255,0.35)',
  },
  currentUsername: {
    color: '#D6E4FF',
  },
  header: {
    alignItems: 'center',
    borderBottomColor: 'rgba(255,255,255,0.07)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerPlaceholder: {
    height: 44,
    width: 44,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    marginTop: 2,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  listAvatar: {
    borderRadius: 16,
    height: 32,
    marginRight: 10,
    width: 32,
  },
  listEmptyState: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 18,
  },
  listEmptyText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '600',
  },
  listInfo: {
    flex: 1,
    minWidth: 0,
  },
  listItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  listMeta: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 1,
  },
  listPoints: {
    color: PRIMARY_BLUE,
    fontSize: 18,
    fontWeight: '800',
    minWidth: 40,
    textAlign: 'right',
  },
  listRank: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '700',
    marginRight: 10,
    width: 28,
  },
  listSection: {
    marginTop: 10,
  },
  listTitle: {
    color: '#F0F6FC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  listUsername: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: PRIMARY_BLUE,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 12,
  },
  placeholderAvatar: {
    opacity: 0.65,
  },
  podiumAvatar: {
    borderRadius: 26,
    height: 52,
    marginBottom: 8,
    width: 52,
  },
  podiumItem: {
    alignItems: 'center',
    flex: 1,
    maxWidth: 112,
  },
  podiumItemCenter: {
    marginTop: -10,
  },
  podiumPoints: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
  },
  podiumSection: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 216,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  podiumStand: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height: 48,
    width: '82%',
  },
  podiumStandCenter: {
    backgroundColor: 'rgba(37,110,255,0.34)',
    height: 70,
  },
  podiumUsername: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    maxWidth: 96,
    textAlign: 'center',
  },
  rankBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    marginBottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rankBadgeCenter: {
    backgroundColor: 'rgba(37,110,255,0.32)',
  },
  rankBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
