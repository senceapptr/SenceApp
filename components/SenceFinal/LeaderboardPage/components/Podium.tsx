import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet, Image, Animated, Dimensions } from 'react-native';

import { PodiumProps, LeaderboardUser } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PodiumPosition = 1 | 2 | 3;

const PODIUM_CONFIG: Record<
  PodiumPosition,
  {
    avatarSize: number;
    borderColor: string;
    creditTextColor: string;
    glowColor: string;
    pedestalGradient: [string, string];
    pedestalHeight: number;
  }
> = {
  1: {
    avatarSize: 86,
    borderColor: '#F8D768',
    creditTextColor: '#F8FAFC',
    glowColor: 'rgba(248, 215, 104, 0.5)',
    pedestalGradient: ['#FFE08A', '#F2B705'],
    pedestalHeight: 112,
  },
  2: {
    avatarSize: 70,
    borderColor: '#E3E8F1',
    creditTextColor: '#F3F7FD',
    glowColor: 'rgba(227, 232, 241, 0.3)',
    pedestalGradient: ['#F1F5F9', '#AAB4C1'],
    pedestalHeight: 88,
  },
  3: {
    avatarSize: 70,
    borderColor: '#D59460',
    creditTextColor: '#F7E6D6',
    glowColor: 'rgba(213, 148, 96, 0.28)',
    pedestalGradient: ['#E6A979', '#A7673F'],
    pedestalHeight: 70,
  },
};

const formatCredits = (credits: number) => {
  if (credits >= 1000000) return `${(credits / 1000000).toFixed(1)}M`;
  if (credits >= 1000) return `${(credits / 1000).toFixed(1)}K`;
  return credits.toLocaleString('tr-TR');
};

interface PodiumItemProps {
  user: LeaderboardUser;
  isCurrentUser?: boolean;
  position: PodiumPosition;
}

function PodiumItem({ isCurrentUser, position, user }: PodiumItemProps) {
  const config = PODIUM_CONFIG[position];
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      damping: 18,
      mass: 0.72,
      stiffness: 185,
      toValue: 1,
      useNativeDriver: true,
    }).start();

    let pulseAnimation: Animated.CompositeAnimation | undefined;

    if (position === 1) {
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            duration: 1500,
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            duration: 1500,
            toValue: 0,
            useNativeDriver: true,
          }),
        ]),
      );
      pulseAnimation.start();
    }

    return () => pulseAnimation?.stop();
  }, [glowAnim, position, scaleAnim]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.74],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.1],
  });

  return (
    <Animated.View
      style={[
        styles.podiumItem,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={[styles.avatarContainer, { height: config.avatarSize, width: config.avatarSize }]}>
        {position === 1 && (
          <Animated.View
            style={[
              styles.glowRing,
              {
                backgroundColor: config.glowColor,
                borderRadius: (config.avatarSize + 22) / 2,
                height: config.avatarSize + 22,
                opacity: glowOpacity,
                transform: [{ scale: glowScale }],
                width: config.avatarSize + 22,
              },
            ]}
          />
        )}

        <View
          style={[
            styles.avatarBorder,
            {
              borderColor: config.borderColor,
              borderWidth: position === 1 ? 2.8 : 2.4,
            },
          ]}
        >
          <Image
            source={{
              uri:
                user.profile_image ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
            }}
            style={[
              styles.avatar,
              { borderRadius: config.avatarSize / 2, height: config.avatarSize, width: config.avatarSize },
            ]}
          />
        </View>
      </View>

      <Text style={[styles.username, isCurrentUser && styles.currentUserName]} numberOfLines={1}>
        {user.username || user.full_name?.split(' ')[0] || 'Kullanıcı'}
      </Text>

      <View style={styles.creditsChip}>
        <Ionicons name="wallet-outline" size={12} color={config.creditTextColor} />
        <Text style={[styles.creditsText, { color: config.creditTextColor }]}>{formatCredits(user.credits)}</Text>
      </View>

      <LinearGradient
        colors={config.pedestalGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.pedestal, { height: config.pedestalHeight }]}
      >
        <Text style={styles.pedestalNumber}>{position}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

export function Podium({ currentUserId, users }: PodiumProps) {
  if (users.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconWrap}>
          <Ionicons name="bar-chart-outline" size={24} color="#8FA6C8" />
        </View>
        <Text style={styles.emptyTitle}>Henüz sıralama verisi yok</Text>
        <Text style={styles.emptyText}>Veri geldiğinde liderlik burada görünecek.</Text>
      </View>
    );
  }

  const visualUsers: { position: PodiumPosition; user: LeaderboardUser }[] =
    users.length === 1
      ? [{ position: 1, user: users[0] }]
      : users.length === 2
        ? [
            { position: 2, user: users[1] },
            { position: 1, user: users[0] },
          ]
        : [
            { position: 2, user: users[1] },
            { position: 1, user: users[0] },
            { position: 3, user: users[2] },
          ];

  return (
    <View style={styles.container}>
      <View style={styles.decorLayer} pointerEvents="none">
        {Array.from({ length: 10 }).map((_, index) => (
          <View
            key={`decor-${index}`}
            style={[
              styles.decorDot,
              {
                left: `${(index * 11) % 94}%`,
                opacity: 0.14 + (index % 3) * 0.08,
                top: `${(index * 17) % 82}%`,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.podiumRow}>
        {visualUsers.map(({ position, user }) => (
          <PodiumItem key={user.id} user={user} position={position} isCurrentUser={user.id === currentUserId} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#111827',
  },
  avatarBorder: {
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 999,
    justifyContent: 'center',
    padding: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  container: {
    marginBottom: 4,
    paddingBottom: 18,
    paddingHorizontal: 16,
    paddingTop: 18,
    position: 'relative',
  },
  creditsChip: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderColor: 'rgba(148, 163, 184, 0.24)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  creditsText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  currentUserName: {
    color: '#93C5FD',
  },
  decorDot: {
    backgroundColor: '#3D4E68',
    borderRadius: 2,
    height: 4,
    position: 'absolute',
    width: 4,
  },
  decorLayer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    borderColor: 'rgba(148, 163, 184, 0.16)',
    borderRadius: 22,
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 18,
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  emptyIconWrap: {
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    borderColor: 'rgba(148, 163, 184, 0.18)',
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    marginBottom: 12,
    width: 36,
  },
  emptyText: {
    color: '#7F8EA4',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyTitle: {
    color: '#D3DDEB',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  glowRing: {
    position: 'absolute',
  },
  pedestal: {
    alignItems: 'center',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    justifyContent: 'center',
    width: '100%',
  },
  pedestalNumber: {
    color: 'rgba(17, 24, 39, 0.42)',
    fontSize: 28,
    fontWeight: '900',
  },
  podiumItem: {
    alignItems: 'center',
    flex: 1,
    maxWidth: (SCREEN_WIDTH - 48) / 3,
  },
  podiumRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  username: {
    color: '#E4ECF8',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
});
