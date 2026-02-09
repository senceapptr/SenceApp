import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LeaderboardItemProps } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function LeaderboardItem({ user, isCurrentUser }: LeaderboardItemProps) {
    const getRankColor = (rank: number) => {
        if (rank <= 10) return '#10B981';
        if (rank <= 25) return '#3B82F6';
        if (rank <= 50) return '#8B5CF6';
        return '#8B949E';
    };

    return (
        <View style={[styles.container, isCurrentUser && styles.currentUserContainer]}>
            {isCurrentUser && (
                <LinearGradient
                    colors={['rgba(16, 185, 129, 0.15)', 'rgba(16, 185, 129, 0.05)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.currentUserGradient}
                />
            )}

            {/* Rank */}
            <View style={[styles.rankContainer, { backgroundColor: getRankColor(user.rank) + '20' }]}>
                <Text style={[styles.rankText, { color: getRankColor(user.rank) }]}>
                    #{user.rank}
                </Text>
            </View>

            {/* Avatar */}
            <View style={styles.avatarContainer}>
                <Image
                    source={{
                        uri: user.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
                    }}
                    style={styles.avatar}
                />
                {isCurrentUser && <View style={styles.currentUserDot} />}
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
                <Text style={[styles.username, isCurrentUser && styles.currentUserName]} numberOfLines={1}>
                    {user.username || user.full_name || 'User'}
                </Text>
                <View style={styles.levelBadge}>
                    <Text style={styles.levelIcon}>⭐</Text>
                    <Text style={styles.levelText}>Lv. {user.level || 1}</Text>
                </View>
            </View>

            {/* Credits */}
            <View style={styles.creditsContainer}>
                <Text style={styles.creditsIcon}>💎</Text>
                <Text style={styles.creditsText}>
                    {user.credits >= 1000000
                        ? `${(user.credits / 1000000).toFixed(1)}M`
                        : user.credits >= 1000
                            ? `${(user.credits / 1000).toFixed(1)}K`
                            : user.credits.toLocaleString('tr-TR')}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        marginBottom: 8,
        backgroundColor: '#161B22',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#30363D',
        overflow: 'hidden',
    },
    currentUserContainer: {
        borderColor: '#10B981',
        borderWidth: 2,
    },
    currentUserGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    rankContainer: {
        width: 44,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    rankText: {
        fontSize: 13,
        fontWeight: '800',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#21262D',
    },
    currentUserDot: {
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
        marginRight: 12,
    },
    username: {
        fontSize: 15,
        fontWeight: '700',
        color: '#F0F6FC',
        marginBottom: 4,
    },
    currentUserName: {
        color: '#10B981',
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    levelIcon: {
        fontSize: 10,
    },
    levelText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#8B949E',
    },
    creditsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#21262D',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 6,
    },
    creditsIcon: {
        fontSize: 14,
    },
    creditsText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#F0F6FC',
    },
});
