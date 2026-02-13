import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UserRankCardProps } from '../types';

const formatCredits = (credits: number) => {
  if (credits >= 1000000) return `${(credits / 1000000).toFixed(1)}M`;
  if (credits >= 1000) return `${(credits / 1000).toFixed(1)}K`;
  return credits.toLocaleString('tr-TR');
};

const getPositionTag = (rank: number) => {
  if (rank === 1) return 'Zirve';
  if (rank <= 10) return 'Elit';
  if (rank <= 50) return 'Üst Dilim';
  return 'Yükselişte';
};

export function UserRankCard({ credits, profileImage, rank, totalUsers, username }: UserRankCardProps) {
  const insets = useSafeAreaInsets();
  const percentile = totalUsers > 0 ? Math.round(((totalUsers - rank) / totalUsers) * 100) : 0;
  const topPercent = Math.max(1, 100 - percentile);

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom + 10, 24) }]}>
      <LinearGradient
        colors={['#111B2C', '#0B1422']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.topAccent} />

        <View style={styles.headerRow}>
          <View style={styles.userSection}>
            <Image
              source={{
                uri:
                  profileImage ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
              }}
              style={styles.avatar}
            />

            <View style={styles.userInfo}>
              <Text style={styles.username} numberOfLines={1}>
                {username || 'kullanici'}
              </Text>
            </View>
          </View>

          <View style={styles.rankBadge}>
            <Text style={styles.rankNumber}>#{rank}</Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Ionicons name="wallet-outline" size={13} color="#A8C5FF" />
            <Text style={styles.metricValue}>{formatCredits(credits)}</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricCard}>
            <Ionicons name="trending-up-outline" size={13} color="#A8C5FF" />
            <Text style={styles.metricValue}>Top %{topPercent}</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricCard}>
            <Ionicons name="speedometer-outline" size={13} color="#A8C5FF" />
            <Text style={styles.metricValue}>{getPositionTag(rank)}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#1F2937',
    borderColor: 'rgba(96, 165, 250, 0.5)',
    borderRadius: 23,
    borderWidth: 1.5,
    height: 46,
    marginRight: 12,
    width: 46,
  },
  container: {
    bottom: 0,
    left: 0,
    paddingHorizontal: 16,
    position: 'absolute',
    right: 0,
  },
  gradient: {
    borderColor: 'rgba(148, 163, 184, 0.26)',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: '#020617',
    shadowOffset: { height: -4, width: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricCard: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  metricDivider: {
    backgroundColor: 'rgba(148, 163, 184, 0.22)',
    height: 28,
    marginHorizontal: 8,
    width: 1,
  },
  metricsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  metricValue: {
    color: '#E6EEF9',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  rankBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    borderColor: 'rgba(148, 163, 184, 0.24)',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  rankNumber: {
    color: '#EAF2FF',
    fontSize: 18,
    fontWeight: '900',
  },
  topAccent: {
    backgroundColor: '#2F4F8C',
    borderRadius: 999,
    height: 2,
    left: 14,
    opacity: 0.9,
    position: 'absolute',
    right: 14,
    top: 0,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: '#EAF2FF',
    fontSize: 15,
    fontWeight: '700',
  },
  userSection: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginRight: 10,
  },
});
