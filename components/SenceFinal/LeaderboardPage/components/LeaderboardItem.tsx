import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet, Image } from 'react-native';

import { LeaderboardItemProps } from '../types';

const formatCredits = (credits: number) => {
  if (credits >= 1000000) return `${(credits / 1000000).toFixed(1)}M`;
  if (credits >= 1000) return `${(credits / 1000).toFixed(1)}K`;
  return credits.toLocaleString('tr-TR');
};

const getRankStyle = (rank: number) => {
  if (rank <= 3) {
    return {
      badgeBackground: 'rgba(245, 158, 11, 0.2)',
      badgeBorder: '#F59E0B',
      textColor: '#FBBF24',
    };
  }

  if (rank <= 10) {
    return {
      badgeBackground: 'rgba(59, 130, 246, 0.2)',
      badgeBorder: '#3B82F6',
      textColor: '#93C5FD',
    };
  }

  if (rank <= 25) {
    return {
      badgeBackground: 'rgba(99, 102, 241, 0.2)',
      badgeBorder: '#6366F1',
      textColor: '#A5B4FC',
    };
  }

  return {
    badgeBackground: 'rgba(148, 163, 184, 0.2)',
    badgeBorder: 'rgba(148, 163, 184, 0.45)',
    textColor: '#CBD5E1',
  };
};

export function LeaderboardItem({ isCurrentUser, user }: LeaderboardItemProps) {
  const rankStyle = getRankStyle(user.rank);

  return (
    <View style={[styles.container, isCurrentUser && styles.currentUserContainer]}>
      {isCurrentUser && (
        <LinearGradient
          colors={['rgba(47, 79, 140, 0.3)', 'rgba(47, 79, 140, 0.05)']}
          end={{ x: 1, y: 0.2 }}
          start={{ x: 0, y: 0 }}
          style={styles.currentUserGradient}
        />
      )}

      <View
        style={[
          styles.rankContainer,
          {
            backgroundColor: rankStyle.badgeBackground,
            borderColor: rankStyle.badgeBorder,
          },
        ]}
      >
        <Text style={[styles.rankText, { color: rankStyle.textColor }]}>#{user.rank}</Text>
      </View>

      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri:
              user.profile_image ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
          }}
          style={styles.avatar}
        />
        {isCurrentUser && <View style={styles.currentUserDot} />}
      </View>

      <View style={styles.userInfo}>
        <Text style={[styles.username, isCurrentUser && styles.currentUserName]} numberOfLines={1}>
          {user.username || user.full_name || 'Kullanıcı'}
        </Text>

        <View style={styles.metaRow}>
          <Ionicons name="layers-outline" size={11} color="#94A3B8" />
          <Text style={styles.metaText}>Seviye {user.level || 1}</Text>
        </View>
      </View>

      <View style={styles.creditsContainer}>
        <Ionicons name="wallet-outline" size={13} color="#C8D7F2" />
        <Text style={styles.creditsText}>{formatCredits(user.credits)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#1F2937',
    borderRadius: 22,
    height: 44,
    width: 44,
  },
  avatarContainer: {
    marginRight: 12,
    position: 'relative',
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#10192A',
    borderColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  creditsContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  creditsText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 5,
  },
  currentUserContainer: {
    borderColor: 'rgba(96, 165, 250, 0.55)',
    borderWidth: 1.5,
  },
  currentUserDot: {
    backgroundColor: '#60A5FA',
    borderColor: '#10192A',
    borderRadius: 6,
    borderWidth: 2,
    bottom: -1,
    height: 12,
    position: 'absolute',
    right: -1,
    width: 12,
  },
  currentUserGradient: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  currentUserName: {
    color: '#D4E4FF',
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  metaText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  rankContainer: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    marginRight: 12,
    minWidth: 48,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  rankText: {
    fontSize: 13,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
    marginRight: 10,
  },
  username: {
    color: '#EAF1FA',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
});
