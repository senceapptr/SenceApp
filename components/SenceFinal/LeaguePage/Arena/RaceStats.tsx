import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { leagueVotesService, LeagueVote } from '@/services/league-votes.service';

import { League } from '../types';
import { NEGATIVE_RED, PRIMARY_BLUE, YES_GREEN } from '../shared/theme';

interface RaceStatsProps {
  league: League;
  visible: boolean;
  onClose: () => void;
}

type TabType = 'pending' | 'resolved';

export function RaceStats({ league, onClose, visible }: RaceStatsProps) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [votes, setVotes] = useState<LeagueVote[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    accuracy: 0,
    losses: 0,
    pending: 0,
    totalPoints: 0,
    totalVotes: 0,
    wins: 0,
  });

  const loadData = useCallback(async () => {
    if (!user || !league) return;

    try {
      setLoading(true);

      // Load votes based on tab
      const status = activeTab === 'pending' ? 'pending' : undefined;
      const votesResult = await leagueVotesService.getUserVotes(league.id, user.id, status);

      if (votesResult.data) {
        const filteredVotes =
          activeTab === 'resolved'
            ? votesResult.data.filter(v => v.status !== 'pending' && v.status !== 'skipped')
            : votesResult.data.filter(v => v.status === 'pending');
        setVotes(filteredVotes);
      }

      // Load stats
      const statsResult = await leagueVotesService.getUserLeagueStats(league.id, user.id);
      if (statsResult.data) {
        setStats(statsResult.data);
      }
    } catch (err) {
      console.error('Load stats error:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, league, user]);

  useEffect(() => {
    if (visible && user && league) {
      loadData();
    }
  }, [league, loadData, user, visible]);

  const getStatusIcon = (vote: LeagueVote) => {
    switch (vote.status) {
      case 'won':
        return <Ionicons name="checkmark-circle" size={24} color={YES_GREEN} />;
      case 'lost':
        return <Ionicons name="close-circle" size={24} color={NEGATIVE_RED} />;
      case 'pending':
        return <Ionicons name="time" size={24} color="#F59E0B" />;
      default:
        return <Ionicons name="remove-circle" size={24} color="#6B7280" />;
    }
  };

  const getVoteLabel = (vote: 'yes' | 'no' | 'skip') => {
    switch (vote) {
      case 'yes':
        return { color: YES_GREEN, text: 'EVET' };
      case 'no':
        return { color: NEGATIVE_RED, text: 'HAYIR' };
      default:
        return { color: '#6B7280', text: 'PAS' };
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
          <View style={{ paddingTop: Math.max(insets.top, 20) }}>
            <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>İstatistikler</Text>
              <Text style={styles.headerSubtitle}>{league.name}</Text>

              {/* Stats Overview */}
              <View style={styles.statsOverview}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.totalVotes}</Text>
                  <Text style={styles.statLabel}>Tahmin</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: YES_GREEN }]}>{stats.wins}</Text>
                  <Text style={styles.statLabel}>Kazandı</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: NEGATIVE_RED }]}>{stats.losses}</Text>
                  <Text style={styles.statLabel}>Kaybetti</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: '#F59E0B' }]}>{stats.accuracy}%</Text>
                  <Text style={styles.statLabel}>Başarı</Text>
                </View>
              </View>

              {/* Total Points */}
              <View style={styles.totalPoints}>
                <Text style={styles.totalPointsLabel}>TOPLAM PUAN</Text>
                <Text style={styles.totalPointsValue}>{stats.totalPoints}</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
              onPress={() => setActiveTab('pending')}
              activeOpacity={0.7}
            >
              <Ionicons name="time" size={18} color={activeTab === 'pending' ? '#F59E0B' : '#6B7280'} />
              <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>Bekleyen</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'resolved' && styles.tabActive]}
              onPress={() => setActiveTab('resolved')}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark-done" size={18} color={activeTab === 'resolved' ? PRIMARY_BLUE : '#6B7280'} />
              <Text style={[styles.tabText, activeTab === 'resolved' && styles.tabTextActive]}>Sonuçlanan</Text>
            </TouchableOpacity>
          </View>

          {/* Vote List */}
          <ScrollView style={styles.voteList} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={PRIMARY_BLUE} />
              </View>
            ) : votes.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name={activeTab === 'pending' ? 'time-outline' : 'document-text-outline'}
                  size={48}
                  color="rgba(255,255,255,0.55)"
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyText}>
                  {activeTab === 'pending' ? 'Bekleyen tahminin yok' : 'Henüz sonuçlanan tahmin yok'}
                </Text>
              </View>
            ) : (
              votes.map(vote => {
                const voteLabel = getVoteLabel(vote.vote);
                return (
                  <View key={vote.id} style={styles.voteItem}>
                    <View style={styles.voteStatus}>{getStatusIcon(vote)}</View>

                    <View style={styles.voteInfo}>
                      <Text style={styles.voteQuestion} numberOfLines={2}>
                        {vote.questions?.title || 'Soru yükleniyor...'}
                      </Text>
                      <View style={styles.voteDetails}>
                        <View style={[styles.voteBadge, { backgroundColor: voteLabel.color + '20' }]}>
                          <Text style={[styles.voteBadgeText, { color: voteLabel.color }]}>{voteLabel.text}</Text>
                        </View>
                        <Text style={styles.voteOdds}>{vote.odds_at_vote}x</Text>
                      </View>
                    </View>

                    {vote.status !== 'pending' && (
                      <View style={styles.votePoints}>
                        <Text
                          style={[styles.pointsValue, { color: vote.points_earned >= 0 ? YES_GREEN : NEGATIVE_RED }]}
                        >
                          {vote.points_earned >= 0 ? '+' : ''}
                          {vote.points_earned}
                        </Text>
                        <Text style={styles.pointsLabel}>puan</Text>
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    top: 16,
    width: 36,
    zIndex: 10,
  },
  container: {
    backgroundColor: '#0D1117',
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
  },
  header: {
    padding: 20,
    paddingTop: 16,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginBottom: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  modalBackground: {
    backgroundColor: '#0D1117',
    flex: 1,
  },
  pointsLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
  },
  pointsValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  statDivider: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: 1,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    marginTop: 4,
  },
  statsOverview: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    flexDirection: 'row',
    marginBottom: 16,
    padding: 16,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  tab: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tabText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  totalPoints: {
    alignItems: 'center',
    backgroundColor: 'rgba(37, 110, 255, 0.15)',
    borderColor: 'rgba(37, 110, 255, 0.3)',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  totalPointsLabel: {
    color: PRIMARY_BLUE,
    fontSize: 13,
    fontWeight: '600',
  },
  totalPointsValue: {
    color: PRIMARY_BLUE,
    fontSize: 28,
    fontWeight: '900',
  },
  voteBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  voteBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  voteDetails: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  voteInfo: {
    flex: 1,
  },
  voteItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 16,
  },
  voteList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  voteOdds: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '600',
  },
  votePoints: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  voteQuestion: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 8,
  },
  voteStatus: {
    marginRight: 14,
  },
});
