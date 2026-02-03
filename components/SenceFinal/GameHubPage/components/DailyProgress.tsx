import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DailyProgressProps {
    completed: number;
    total: number;
    bonusClaimed: boolean;
    bonusAmount: number;
    todayEarnings: number;
    onClaimBonus: () => Promise<void>;
}

export function DailyProgress({
    completed,
    total,
    bonusClaimed,
    bonusAmount,
    todayEarnings,
    onClaimBonus,
}: DailyProgressProps) {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const starAnim = useRef(new Animated.Value(0)).current;
    const [claiming, setClaiming] = React.useState(false);

    const canClaimBonus = completed >= total && !bonusClaimed;

    // Progress animation
    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: completed / total,
            duration: 1200,
            useNativeDriver: false,
        }).start();
    }, [completed, total]);

    // Star rotate animation
    useEffect(() => {
        Animated.loop(
            Animated.timing(starAnim, {
                toValue: 1,
                duration: 8000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    // Pulse & glow animation for claim button
    useEffect(() => {
        if (canClaimBonus) {
            Animated.loop(
                Animated.parallel([
                    Animated.sequence([
                        Animated.timing(pulseAnim, {
                            toValue: 1.1,
                            duration: 800,
                            useNativeDriver: true,
                        }),
                        Animated.timing(pulseAnim, {
                            toValue: 1,
                            duration: 800,
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.sequence([
                        Animated.timing(glowAnim, {
                            toValue: 1,
                            duration: 800,
                            useNativeDriver: false,
                        }),
                        Animated.timing(glowAnim, {
                            toValue: 0,
                            duration: 800,
                            useNativeDriver: false,
                        }),
                    ]),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
            glowAnim.setValue(0);
        }
    }, [canClaimBonus]);

    const handleClaimBonus = async () => {
        if (!canClaimBonus || claiming) return;

        setClaiming(true);
        await onClaimBonus();
        setClaiming(false);
    };

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const starRotate = starAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#10B981', '#059669', '#047857']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {/* Decorative Elements */}
                <Animated.View style={[styles.decorStar, styles.star1, { transform: [{ rotate: starRotate }] }]}>
                    <Text style={styles.starEmoji}>✨</Text>
                </Animated.View>
                <Animated.View style={[styles.decorStar, styles.star2, { transform: [{ rotate: starRotate }] }]}>
                    <Text style={styles.starEmoji}>⭐</Text>
                </Animated.View>
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />

                {/* Main Content */}
                <View style={styles.content}>
                    {/* Top Row - REMOVED PER USER REQUEST */}

                    {/* Progress Section */}
                    <View style={styles.progressSection}>
                        {/* Step Circles */}
                        <View style={styles.stepsRow}>
                            {Array.from({ length: total + 1 }, (_, i) => {
                                const isComplete = i <= completed;
                                const isCurrent = i === completed && i < total;
                                const isLast = i === total;

                                return (
                                    <React.Fragment key={i}>
                                        {/* Step Circle */}
                                        <View
                                            style={[
                                                styles.stepCircle,
                                                isComplete && styles.stepCircleComplete,
                                                isCurrent && styles.stepCircleCurrent,
                                                isLast && styles.stepCircleLast,
                                            ]}
                                        >
                                            {isLast ? (
                                                <Text style={styles.stepGift}>🎁</Text>
                                            ) : isComplete ? (
                                                <Ionicons name="checkmark" size={18} color="#0D1117" />
                                            ) : (
                                                <Text style={styles.stepNumber}>{i + 1}</Text>
                                            )}
                                        </View>

                                        {/* Connector Line */}
                                        {i < total && (
                                            <View style={styles.connectorContainer}>
                                                <View style={[
                                                    styles.connector,
                                                    i < completed && styles.connectorComplete
                                                ]} />
                                            </View>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </View>

                        {/* Progress Text */}
                        <Text style={styles.progressText}>
                            {completed}/{total} Oyun Tamamlandı
                        </Text>
                    </View>

                    {/* Bonus Section */}
                    <View style={styles.bonusSection}>
                        {bonusClaimed ? (
                            <View style={styles.bonusClaimed}>
                                <Ionicons name="checkmark-circle" size={24} color="#C9F158" />
                                <Text style={styles.bonusClaimedText}>
                                    Bonus alındı! +{bonusAmount} 🪙
                                </Text>
                            </View>
                        ) : canClaimBonus ? (
                            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                                <TouchableOpacity
                                    style={styles.claimButton}
                                    onPress={handleClaimBonus}
                                    disabled={claiming}
                                    activeOpacity={0.85}
                                >
                                    <LinearGradient
                                        colors={['#C9F158', '#A3E635']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.claimButtonGradient}
                                    >
                                        <Text style={styles.claimButtonEmoji}>🎁</Text>
                                        <Text style={styles.claimButtonText}>
                                            {claiming ? 'Alınıyor...' : `BONUS AL +${bonusAmount}`}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animated.View>
                        ) : (
                            <View style={styles.bonusPending}>
                                <Text style={styles.bonusPendingText}>
                                    🎁 Tümünü tamamla → +{bonusAmount} bonus
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 12, // Standard spacing now that we have a section header
        marginBottom: 20,
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 10,
    },
    gradient: {
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    // Decorative elements
    decorStar: {
        position: 'absolute',
    },
    star1: {
        top: 10,
        right: 20,
    },
    star2: {
        bottom: 15,
        left: 15,
    },
    starEmoji: {
        fontSize: 18,
        opacity: 0.5,
    },
    decorCircle1: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    decorCircle2: {
        position: 'absolute',
        bottom: -30,
        left: -30,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    content: {
        position: 'relative',
        zIndex: 1,
    },
    // Top Row
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    titleSection: {},
    title: {
        fontSize: 20,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 4,
        letterSpacing: 0.3,
    },
    subtitle: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    earningsBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 16,
        alignItems: 'center',
    },
    earningsLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 2,
    },
    earningsValue: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    earningsNumber: {
        fontSize: 20,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    earningsCoin: {
        fontSize: 16,
    },
    // Progress Section
    progressSection: {
        marginBottom: 20,
    },
    stepsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    stepCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    stepCircleComplete: {
        backgroundColor: '#C9F158',
        borderColor: '#FFFFFF',
    },
    stepCircleCurrent: {
        borderColor: '#FFFFFF',
        borderWidth: 3,
    },
    stepCircleLast: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(201, 241, 88, 0.3)',
        borderColor: '#C9F158',
    },
    stepNumber: {
        fontSize: 16,
        fontWeight: '800',
        color: 'rgba(255, 255, 255, 0.6)',
    },
    stepGift: {
        fontSize: 24,
    },
    connectorContainer: {
        flex: 1,
        height: 4,
        maxWidth: 60,
        marginHorizontal: 8,
    },
    connector: {
        flex: 1,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 2,
    },
    connectorComplete: {
        backgroundColor: '#C9F158',
    },
    progressText: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    // Bonus Section
    bonusSection: {
        alignItems: 'center',
    },
    bonusClaimed: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 18,
    },
    bonusClaimedText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    claimButton: {
        borderRadius: 22,
        overflow: 'hidden',
        shadowColor: '#C9F158',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
    },
    claimButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 28,
        gap: 10,
    },
    claimButtonEmoji: {
        fontSize: 22,
    },
    claimButtonText: {
        fontSize: 17,
        fontWeight: '900',
        color: '#0D1117',
        letterSpacing: 0.5,
    },
    bonusPending: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 18,
    },
    bonusPendingText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
