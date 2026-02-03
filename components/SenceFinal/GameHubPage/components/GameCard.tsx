import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48 - 12) / 2; // 2 cards per row with gap

export type GameStatus = 'available' | 'completed' | 'locked';

interface GameCardProps {
    id: string;
    name: string;
    description: string;
    icon: string;
    status: GameStatus;
    reward: number;
    earnedReward?: number;
    onPress: () => void;
}

export function GameCard({
    name,
    description,
    icon,
    status,
    reward,
    earnedReward,
    onPress,
}: GameCardProps) {
    const isLocked = status === 'locked';
    const isCompleted = status === 'completed';
    const isAvailable = status === 'available';

    const getGradientColors = (): [string, string, string] => {
        if (isCompleted) return ['#10B981', '#059669', '#047857'];
        if (isLocked) return ['#30363D', '#21262D', '#161B22'];
        return ['#10B981', '#0D9668', '#047857'];
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            disabled={isLocked}
            activeOpacity={0.85}
        >
            <LinearGradient
                colors={getGradientColors()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {/* Status Badge */}
                {isLocked && (
                    <View style={styles.lockedBadge}>
                        <Ionicons name="lock-closed" size={12} color="#8B949E" />
                        <Text style={styles.lockedBadgeText}>Yakında</Text>
                    </View>
                )}

                {isCompleted && (
                    <View style={styles.completedBadge}>
                        <Ionicons name="checkmark-circle" size={20} color="#C9F158" />
                    </View>
                )}

                {/* Game Icon */}
                <View style={[styles.iconContainer, isLocked && styles.iconContainerLocked]}>
                    <Text style={styles.icon}>{icon}</Text>
                </View>

                {/* Game Info */}
                <Text style={[styles.name, isLocked && styles.nameLocked]} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={[styles.description, isLocked && styles.descriptionLocked]} numberOfLines={2}>
                    {description}
                </Text>

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    {/* Reward */}
                    {isCompleted && earnedReward ? (
                        <View style={styles.earnedReward}>
                            <Ionicons name="checkmark" size={14} color="#C9F158" />
                            <Text style={styles.earnedRewardText}>+{earnedReward}</Text>
                        </View>
                    ) : !isLocked ? (
                        <View style={styles.rewardBadge}>
                            <Text style={styles.rewardIcon}>🪙</Text>
                            <Text style={styles.rewardText}>{reward}</Text>
                        </View>
                    ) : (
                        <View style={styles.rewardBadgeLocked}>
                            <Text style={styles.rewardIcon}>🔒</Text>
                            <Text style={styles.rewardTextLocked}>???</Text>
                        </View>
                    )}

                    {/* Play Badge - only for available games */}
                    {isAvailable && (
                        <View style={styles.playBadge}>
                            <Text style={styles.playBadgeText}>PLAY</Text>
                            <Ionicons name="play" size={12} color="#0D1117" />
                        </View>
                    )}
                </View>

                {/* Decorative Elements */}
                {!isLocked && (
                    <>
                        <View style={styles.decorCircle1} />
                        <View style={styles.decorCircle2} />
                    </>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    gradient: {
        padding: 16,
        minHeight: 200,
        position: 'relative',
        overflow: 'hidden',
    },
    lockedBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        gap: 4,
    },
    lockedBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#8B949E',
    },
    completedBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    iconContainerLocked: {
        opacity: 0.5,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    icon: {
        fontSize: 32,
    },
    name: {
        fontSize: 17,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 4,
        letterSpacing: 0.3,
    },
    nameLocked: {
        color: '#8B949E',
    },
    description: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.85)',
        lineHeight: 16,
        marginBottom: 16,
    },
    descriptionLocked: {
        color: '#6E7681',
    },
    bottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    rewardBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    rewardBadgeLocked: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    rewardIcon: {
        fontSize: 14,
    },
    rewardText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    rewardTextLocked: {
        fontSize: 14,
        fontWeight: '800',
        color: '#6E7681',
    },
    earnedReward: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(201, 241, 88, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    earnedRewardText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#C9F158',
    },
    playBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#C9F158',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 4,
    },
    playBadgeText: {
        fontSize: 11,
        fontWeight: '900',
        color: '#0D1117',
        letterSpacing: 0.5,
    },
    // Decorative elements
    decorCircle1: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    decorCircle2: {
        position: 'absolute',
        bottom: -30,
        left: -30,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
});
