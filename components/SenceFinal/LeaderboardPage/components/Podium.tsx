import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PodiumProps, LeaderboardUser } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Medal/Crown configurations
const PODIUM_CONFIG = {
    1: {
        icon: '👑',
        medal: '🥇',
        colors: ['#FFD700', '#FFA500', '#FF8C00'] as const,
        glowColor: 'rgba(255, 215, 0, 0.4)',
        borderColor: '#FFD700',
        height: 120,
        avatarSize: 90,
        fontSize: 18,
    },
    2: {
        icon: '',
        medal: '🥈',
        colors: ['#C0C0C0', '#A8A8A8', '#909090'] as const,
        glowColor: 'rgba(192, 192, 192, 0.3)',
        borderColor: '#C0C0C0',
        height: 90,
        avatarSize: 70,
        fontSize: 15,
    },
    3: {
        icon: '',
        medal: '🥉',
        colors: ['#CD7F32', '#B87333', '#A0522D'] as const,
        glowColor: 'rgba(205, 127, 50, 0.3)',
        borderColor: '#CD7F32',
        height: 70,
        avatarSize: 70,
        fontSize: 15,
    },
};

interface PodiumItemProps {
    user: LeaderboardUser;
    position: 1 | 2 | 3;
    isCurrentUser?: boolean;
}

function PodiumItem({ user, position, isCurrentUser }: PodiumItemProps) {
    const config = PODIUM_CONFIG[position];
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Entry animation
        Animated.sequence([
            Animated.delay(position * 150),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Glow pulse animation (only for 1st place)
        if (position === 1) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, []);

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
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
            {/* Crown for 1st place */}
            {position === 1 && (
                <Animated.Text style={[styles.crown, { opacity: scaleAnim }]}>
                    {config.icon}
                </Animated.Text>
            )}

            {/* Avatar with glow */}
            <View style={[styles.avatarContainer, { width: config.avatarSize, height: config.avatarSize }]}>
                {position === 1 && (
                    <Animated.View
                        style={[
                            styles.glowRing,
                            {
                                width: config.avatarSize + 20,
                                height: config.avatarSize + 20,
                                borderRadius: (config.avatarSize + 20) / 2,
                                backgroundColor: config.glowColor,
                                opacity: glowOpacity,
                            },
                        ]}
                    />
                )}
                <View
                    style={[
                        styles.avatarBorder,
                        {
                            width: config.avatarSize + 8,
                            height: config.avatarSize + 8,
                            borderRadius: (config.avatarSize + 8) / 2,
                            borderColor: config.borderColor,
                        },
                    ]}
                >
                    <Image
                        source={{
                            uri: user.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
                        }}
                        style={[
                            styles.avatar,
                            {
                                width: config.avatarSize,
                                height: config.avatarSize,
                                borderRadius: config.avatarSize / 2,
                            },
                        ]}
                    />
                </View>

                {/* Medal badge */}
                <View style={styles.medalBadge}>
                    <Text style={styles.medalText}>{config.medal}</Text>
                </View>
            </View>

            {/* Username */}
            <Text
                style={[
                    styles.username,
                    { fontSize: config.fontSize },
                    isCurrentUser && styles.currentUserName,
                ]}
                numberOfLines={1}
            >
                {user.username || user.full_name?.split(' ')[0] || 'User'}
            </Text>

            {/* Credits */}
            <View style={styles.creditsContainer}>
                <LinearGradient
                    colors={config.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.creditsGradient}
                >
                    <Text style={styles.creditsIcon}>💎</Text>
                    <Text style={styles.creditsText}>
                        {user.credits >= 1000000
                            ? `${(user.credits / 1000000).toFixed(1)}M`
                            : user.credits >= 1000
                                ? `${(user.credits / 1000).toFixed(1)}K`
                                : user.credits.toLocaleString('tr-TR')}
                    </Text>
                </LinearGradient>
            </View>

            {/* Podium base */}
            <LinearGradient
                colors={config.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[
                    styles.podiumBase,
                    { height: config.height },
                ]}
            >
                <Text style={styles.rankNumber}>{position}</Text>
            </LinearGradient>
        </Animated.View>
    );
}

export function Podium({ users, currentUserId }: PodiumProps) {
    if (users.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🏆</Text>
                <Text style={styles.emptyText}>Henüz sıralama yok</Text>
            </View>
        );
    }

    // Reorder for visual: [2nd, 1st, 3rd] if 3 users
    // If fewer, just order them nicely
    const orderedUsers = users.length === 1
        ? [users[0]]
        : users.length === 2
            ? [users[1], users[0]]
            : [
                users[1], // 2nd place (left)
                users[0], // 1st place (center, highest)
                users[2], // 3rd place (right)
            ].filter(Boolean);

    const getPosition = (index: number): 1 | 2 | 3 => {
        if (users.length === 1) return 1;
        if (users.length === 2) {
            // orderedUsers = [users[1], users[0]]
            // index 0 -> user[1] (rank 2)
            // index 1 -> user[0] (rank 1)
            return index === 0 ? 2 : 1;
        }
        // Normal 3 user logic: [2nd, 1st, 3rd]
        if (index === 0) return 2;
        if (index === 1) return 1;
        return 3;
    };

    return (
        <View style={styles.container}>
            {/* Decorative particles */}
            <View style={styles.particles}>
                {[...Array(12)].map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.particle,
                            {
                                left: `${(i * 8.5) % 100}%`,
                                top: `${(i * 13) % 80}%`,
                                opacity: 0.3 + (i % 3) * 0.2,
                                transform: [{ scale: 0.5 + (i % 3) * 0.3 }],
                            },
                        ]}
                    >
                        <Text style={styles.particleText}>✨</Text>
                    </View>
                ))}
            </View>

            <View style={styles.podiumRow}>
                {orderedUsers.map((user, index) => (
                    <PodiumItem
                        key={user.id}
                        user={user}
                        position={getPosition(index)}
                        isCurrentUser={user.id === currentUserId}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 10,
        position: 'relative',
    },
    particles: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
    },
    particle: {
        position: 'absolute',
    },
    particleText: {
        fontSize: 12,
    },
    podiumRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: 8,
    },
    podiumItem: {
        alignItems: 'center',
        flex: 1,
        maxWidth: (SCREEN_WIDTH - 48) / 3,
    },
    crown: {
        fontSize: 32,
        marginBottom: 4,
    },
    avatarContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    glowRing: {
        position: 'absolute',
    },
    avatarBorder: {
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#161B22',
    },
    avatar: {
        backgroundColor: '#21262D',
    },
    medalBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: '#161B22',
        borderRadius: 14,
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    medalText: {
        fontSize: 18,
    },
    username: {
        fontWeight: '700',
        color: '#F0F6FC',
        textAlign: 'center',
        marginBottom: 6,
    },
    currentUserName: {
        color: '#10B981',
    },
    creditsContainer: {
        marginBottom: 8,
    },
    creditsGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        gap: 4,
    },
    creditsIcon: {
        fontSize: 12,
    },
    creditsText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#0D1117',
    },
    podiumBase: {
        width: '100%',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankNumber: {
        fontSize: 28,
        fontWeight: '900',
        color: 'rgba(0, 0, 0, 0.3)',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8B949E',
    },
});
