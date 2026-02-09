import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserRankCardProps } from '../types';

export function UserRankCard({
    rank,
    totalUsers,
    credits,
    profileImage,
    username,
}: UserRankCardProps) {
    const percentile = totalUsers > 0 ? Math.round(((totalUsers - rank) / totalUsers) * 100) : 0;

    const getRankEmoji = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        if (rank <= 10) return '🏅';
        if (rank <= 50) return '⭐';
        return '📊';
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#161B22', '#21262D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}
            >
                {/* Glow effect */}
                <View style={styles.glowEffect} />

                <View style={styles.content}>
                    {/* Left: Avatar + Info */}
                    <View style={styles.leftSection}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{
                                    uri: profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
                                }}
                                style={styles.avatar}
                            />
                            <View style={styles.onlineDot} />
                        </View>

                        <View style={styles.userInfo}>
                            <Text style={styles.label}>Senin Sıralaman</Text>
                            <Text style={styles.username} numberOfLines={1}>@{username}</Text>
                        </View>
                    </View>

                    {/* Right: Rank + Stats */}
                    <View style={styles.rightSection}>
                        <View style={styles.rankBadge}>
                            <Text style={styles.rankEmoji}>{getRankEmoji(rank)}</Text>
                            <Text style={styles.rankNumber}>#{rank}</Text>
                        </View>

                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>
                                    {credits >= 1000 ? `${(credits / 1000).toFixed(1)}K` : credits}
                                </Text>
                                <Text style={styles.statLabel}>💎</Text>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>Top {100 - percentile}%</Text>
                                <Text style={styles.statLabel}>📈</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingBottom: 34, // Safe area
    },
    gradient: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#30363D',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    glowEffect: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#10B981',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#10B981',
        backgroundColor: '#21262D',
    },
    onlineDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#161B22',
    },
    userInfo: {
        flex: 1,
    },
    label: {
        fontSize: 11,
        fontWeight: '600',
        color: '#8B949E',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    username: {
        fontSize: 15,
        fontWeight: '700',
        color: '#10B981',
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    rankBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#21262D',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
        marginBottom: 8,
    },
    rankEmoji: {
        fontSize: 16,
    },
    rankNumber: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFD700',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        fontSize: 12,
        fontWeight: '700',
        color: '#F0F6FC',
    },
    statLabel: {
        fontSize: 12,
    },
    divider: {
        width: 1,
        height: 16,
        backgroundColor: '#30363D',
    },
});
