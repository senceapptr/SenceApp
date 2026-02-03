import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Easing,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, G, Text as SvgText, Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const WHEEL_SIZE = SCREEN_WIDTH * 0.85;

interface DailySpinProps {
    isUsed: boolean;
    lastReward: number;
    onSpin: (predeterminedReward: number) => Promise<{ reward: number } | null>;
}

// Wheel segments - 8 segments like reference
const SEGMENTS = [
    { value: 50, color: '#10B981' },   // Green
    { value: 100, color: '#161B22' },  // Dark
    { value: 150, color: '#10B981' },  // Green
    { value: 200, color: '#161B22' },  // Dark
    { value: 250, color: '#10B981' },  // Green
    { value: 300, color: '#161B22' },  // Dark
    { value: 400, color: '#10B981' },  // Green
    { value: 500, color: '#161B22' },  // Dark (Jackpot)
];

const NUM_SEGMENTS = SEGMENTS.length;
const SEGMENT_ANGLE = 360 / NUM_SEGMENTS;

// SVG Wheel Component
function SpinWheel({ rotation }: { rotation: Animated.Value }) {
    const radius = WHEEL_SIZE / 2 - 10;
    const centerX = WHEEL_SIZE / 2;
    const centerY = WHEEL_SIZE / 2;

    const createSegmentPath = (index: number) => {
        const startAngle = (index * SEGMENT_ANGLE - 90) * (Math.PI / 180);
        const endAngle = ((index + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);

        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);

        return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
    };

    const getTextPosition = (index: number) => {
        const angle = ((index + 0.5) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
        const textRadius = radius * 0.65;
        return {
            x: centerX + textRadius * Math.cos(angle),
            y: centerY + textRadius * Math.sin(angle),
            rotation: (index + 0.5) * SEGMENT_ANGLE,
        };
    };

    const getCoinPosition = (index: number) => {
        const angle = (index * SEGMENT_ANGLE - 90) * (Math.PI / 180);
        const coinRadius = radius * 0.85;
        return {
            x: centerX + coinRadius * Math.cos(angle),
            y: centerY + coinRadius * Math.sin(angle),
        };
    };

    const spinInterpolation = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View style={{ transform: [{ rotate: spinInterpolation }] }}>
            <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
                {/* Outer ring */}
                <Circle
                    cx={centerX}
                    cy={centerY}
                    r={radius + 8}
                    fill="none"
                    stroke="#C9F158"
                    strokeWidth={4}
                />

                {/* Segments */}
                <G>
                    {SEGMENTS.map((segment, index) => (
                        <Path
                            key={index}
                            d={createSegmentPath(index)}
                            fill={segment.color}
                            stroke="#30363D"
                            strokeWidth={2}
                        />
                    ))}
                </G>

                {/* Segment Values */}
                {SEGMENTS.map((segment, index) => {
                    const pos = getTextPosition(index);
                    return (
                        <SvgText
                            key={`text-${index}`}
                            x={pos.x}
                            y={pos.y}
                            fill="#FFFFFF"
                            fontSize={18}
                            fontWeight="bold"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            rotation={pos.rotation}
                            origin={`${pos.x}, ${pos.y}`}
                        >
                            {segment.value}
                        </SvgText>
                    );
                })}

                {/* Coin decorations between segments */}
                {SEGMENTS.map((_, index) => {
                    const pos = getCoinPosition(index);
                    return (
                        <G key={`coin-${index}`}>
                            <Circle
                                cx={pos.x}
                                cy={pos.y}
                                r={10}
                                fill="#C9F158"
                            />
                            <Circle
                                cx={pos.x}
                                cy={pos.y}
                                r={6}
                                fill="#10B981"
                            />
                        </G>
                    );
                })}

                {/* Center circle */}
                <Circle
                    cx={centerX}
                    cy={centerY}
                    r={35}
                    fill="#0D1117"
                    stroke="#C9F158"
                    strokeWidth={4}
                />
                <Circle
                    cx={centerX}
                    cy={centerY}
                    r={25}
                    fill="#161B22"
                />
                <SvgText
                    x={centerX}
                    y={centerY + 6}
                    fill="#C9F158"
                    fontSize={24}
                    textAnchor="middle"
                >
                    🪙
                </SvgText>
            </Svg>
        </Animated.View>
    );
}

export function DailySpin({ isUsed, lastReward, onSpin }: DailySpinProps) {
    const [spinning, setSpinning] = useState(false);
    const [showReward, setShowReward] = useState(false);
    const [currentReward, setCurrentReward] = useState(0);
    const spinAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rewardScaleAnim = useRef(new Animated.Value(0)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

    // Floating animation for coins
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handleSpin = async () => {
        if (spinning || isUsed) return;

        setSpinning(true);
        setShowReward(false);

        // STEP 1: Randomly select a target segment
        const randomSegmentIndex = Math.floor(Math.random() * NUM_SEGMENTS);
        const targetReward = SEGMENTS[randomSegmentIndex].value;

        // STEP 2: Calculate rotation to land on this segment
        // The pointer is at the top (12 o'clock = 0 degrees)
        // Wheel is drawn with segment 0 starting at top (-90 degrees in SVG coords)
        // Each segment spans SEGMENT_ANGLE degrees (45 for 8 segments)
        // We want the pointer to point at the CENTER of the selected segment

        // Segment center angle from initial position
        const segmentCenterAngle = (randomSegmentIndex + 0.5) * SEGMENT_ANGLE;

        // To make the pointer point at segment center, we need to rotate the wheel
        // so that segment center aligns with the top (0 degrees = where pointer is)
        // Since wheel rotates clockwise when we add rotation, we need:
        // targetRotation = 360 - segmentCenterAngle (to bring segment to top)
        const targetAngle = 360 - segmentCenterAngle;

        // Add multiple full rotations for visual effect (5-7 complete spins)
        const fullRotations = 5 + Math.floor(Math.random() * 3);
        const totalRotation = fullRotations + (targetAngle / 360);

        // STEP 3: Animate the spin
        Animated.sequence([
            // Pulse before spin
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1.02,
                duration: 100,
                useNativeDriver: true,
            }),
            // Main spin - wheel spins to the target segment
            Animated.timing(spinAnim, {
                toValue: totalRotation,
                duration: 4000,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(async () => {
            // STEP 4: After animation completes, call API with the predetermined reward
            const result = await onSpin(targetReward);

            if (result) {
                // Show the reward (should match targetReward)
                setCurrentReward(result.reward);
                setShowReward(true);

                // Reward pop animation
                Animated.spring(rewardScaleAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 6,
                    useNativeDriver: true,
                }).start();
            }

            setSpinning(false);
        });
    };

    const floatTranslate = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -8],
    });

    return (
        <View style={styles.container}>
            {/* Floating Coins Background */}
            <Animated.View style={[styles.floatingCoin, styles.coin1, { transform: [{ translateY: floatTranslate }] }]}>
                <Text style={styles.coinEmoji}>🪙</Text>
            </Animated.View>
            <Animated.View style={[styles.floatingCoin, styles.coin2, { transform: [{ translateY: floatTranslate }] }]}>
                <Text style={styles.coinEmoji}>🪙</Text>
            </Animated.View>
            <Animated.View style={[styles.floatingCoin, styles.coin3, { transform: [{ translateY: floatTranslate }] }]}>
                <Text style={styles.coinEmoji}>💎</Text>
            </Animated.View>

            {/* Title */}
            <Text style={styles.title}>Spin it to win it</Text>
            <Text style={styles.subtitle}>
                {isUsed ? 'Yarın tekrar gel!' : 'Çarkı çevir ve anında ödül kazan!'}
            </Text>

            {/* Wheel Container */}
            <View style={styles.wheelContainer}>
                {/* Pointer */}
                <View style={styles.pointer}>
                    <View style={styles.pointerTriangle} />
                </View>

                {/* Wheel */}
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <SpinWheel rotation={spinAnim} />
                </Animated.View>

                {/* Coin Stack at Bottom */}
                <View style={styles.coinStack}>
                    {[0, 1, 2, 3, 4].map((i) => (
                        <View key={i} style={[styles.stackCoin, { bottom: i * 4 }]}>
                            <LinearGradient
                                colors={['#C9F158', '#10B981']}
                                style={styles.stackCoinInner}
                            />
                        </View>
                    ))}
                </View>
            </View>

            {/* Reward Display */}
            {showReward && (
                <Animated.View
                    style={[
                        styles.rewardContainer,
                        {
                            transform: [{ scale: rewardScaleAnim }],
                        },
                    ]}
                >
                    <LinearGradient
                        colors={['#10B981', '#059669']}
                        style={styles.rewardGradient}
                    >
                        <Text style={styles.rewardEmoji}>🎉</Text>
                        <Text style={styles.rewardTitle}>Tebrikler!</Text>
                        <Text style={styles.rewardAmount}>+{currentReward} Coin</Text>
                    </LinearGradient>
                </Animated.View>
            )}

            {/* Already Used Display */}
            {isUsed && !showReward && lastReward > 0 && (
                <View style={styles.usedContainer}>
                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                    <Text style={styles.usedText}>Bugün kazandın: <Text style={styles.usedAmount}>+{lastReward}</Text></Text>
                </View>
            )}

            {/* Spin Button */}
            <TouchableOpacity
                style={[styles.spinButton, (isUsed || spinning) && styles.spinButtonDisabled]}
                onPress={handleSpin}
                disabled={isUsed || spinning}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={isUsed ? ['#30363D', '#21262D'] : ['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.spinButtonGradient}
                >
                    {spinning ? (
                        <Text style={styles.spinButtonText}>Çevriliyor...</Text>
                    ) : (
                        <Text style={[styles.spinButtonText, isUsed && styles.spinButtonTextDisabled]}>
                            {isUsed ? '✓ Tamamlandı' : 'Spin now'}
                        </Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        position: 'relative',
    },
    floatingCoin: {
        position: 'absolute',
        zIndex: 1,
    },
    coin1: {
        top: 30,
        left: 20,
    },
    coin2: {
        top: 60,
        right: 30,
    },
    coin3: {
        top: 100,
        left: 40,
    },
    coinEmoji: {
        fontSize: 24,
        opacity: 0.6,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#F0F6FC',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#8B949E',
        marginBottom: 24,
        textAlign: 'center',
    },
    wheelContainer: {
        width: WHEEL_SIZE,
        height: WHEEL_SIZE + 40,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 16,
    },
    pointer: {
        position: 'absolute',
        top: -15,
        zIndex: 10,
        alignItems: 'center',
    },
    pointerTriangle: {
        width: 0,
        height: 0,
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderTopWidth: 25,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#C9F158',
    },
    coinStack: {
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
    },
    stackCoin: {
        position: 'absolute',
        width: 60,
        height: 12,
        borderRadius: 6,
        overflow: 'hidden',
    },
    stackCoinInner: {
        flex: 1,
    },
    rewardContainer: {
        marginVertical: 16,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    rewardGradient: {
        paddingVertical: 20,
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    rewardEmoji: {
        fontSize: 40,
        marginBottom: 8,
    },
    rewardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    rewardAmount: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    usedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginVertical: 16,
        padding: 16,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    usedText: {
        fontSize: 16,
        color: '#8B949E',
    },
    usedAmount: {
        fontSize: 18,
        fontWeight: '800',
        color: '#10B981',
    },
    spinButton: {
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    spinButtonDisabled: {
        shadowOpacity: 0,
        elevation: 0,
    },
    spinButtonGradient: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
    },
    spinButtonText: {
        fontSize: 20,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    spinButtonTextDisabled: {
        color: '#8B949E',
    },
});
