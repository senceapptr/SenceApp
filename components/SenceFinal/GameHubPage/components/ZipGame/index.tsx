// =====================================================
// ZIP GAME - MAIN SCREEN COMPONENT
// =====================================================

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    Modal,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ZipBoard } from './ZipBoard';
import { useZipGame } from './hooks';
import { formatTime } from './utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ZipGameScreenProps {
    onBack: () => void;
    onComplete: () => void;
}

export function ZipGameScreen({ onBack, onComplete }: ZipGameScreenProps) {
    const {
        puzzle,
        path,
        nextNumber,
        timer,
        attempts,
        isPlaying,
        isCompleted,
        loading,
        tryVisitCell,
        resetGame,
    } = useZipGame();

    // ... success modal logic ...

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const celebrationAnim = useRef(new Animated.Value(0)).current;

    // Show success modal when completed
    useEffect(() => {
        if (isCompleted) {
            setShowSuccessModal(true);
            Animated.spring(celebrationAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }).start();
        }
    }, [isCompleted]);

    const handleComplete = () => {
        setShowSuccessModal(false);
        onComplete();
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#C9F158" />
                <Text style={styles.loadingText}>Puzzle Yükleniyor...</Text>
            </View>
        );
    }

    if (!puzzle) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>Puzzle yüklenemedi.</Text>
                <TouchableOpacity style={styles.backButtonSimple} onPress={onBack}>
                    <Text style={styles.backButtonText}>Geri Dön</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Progress calculation based on numbered cells visited
    const numbersVisited = nextNumber - 1;
    const progress = puzzle.totalNumbers > 0 ? (numbersVisited / puzzle.totalNumbers) * 100 : 0;

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={onBack}>
                        <Ionicons name="chevron-back" size={24} color="#F0F6FC" />
                    </TouchableOpacity>

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Zip</Text>
                        <Text style={styles.subtitle}>⚡</Text>
                    </View>

                    <View style={styles.timerContainer}>
                        <Ionicons name="time-outline" size={18} color="#8B949E" />
                        <Text style={styles.timerText}>{formatTime(timer)}</Text>
                    </View>
                </View>

                {/* Progress indicator */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${progress}%` }
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {numbersVisited} / {puzzle.totalNumbers}
                    </Text>
                </View>

                {/* Helper text */}
                <Text style={styles.helperText}>
                    Numaralı kareleri sırayla bul ve yolu çiz
                </Text>

                {/* Game Board */}
                <View style={styles.boardContainer}>
                    <ZipBoard
                        puzzle={puzzle}
                        path={path}
                        nextNumber={nextNumber}
                        onCellTouch={tryVisitCell}
                    />
                </View>

                {/* Controls */}
                <View style={styles.controlsContainer}>
                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={resetGame}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="refresh" size={20} color="#F0F6FC" />
                        <Text style={styles.resetButtonText}>Sıfırla</Text>
                    </TouchableOpacity>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Hedef</Text>
                            <Text style={styles.statValue}>{nextNumber <= puzzle.totalNumbers ? nextNumber : '✓'}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Deneme</Text>
                            <Text style={styles.statValue}>{attempts}</Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>

            {/* Success Modal */}
            <Modal
                visible={showSuccessModal}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <Animated.View
                        style={[
                            styles.successModal,
                            {
                                transform: [
                                    { scale: celebrationAnim },
                                ],
                            },
                        ]}
                    >
                        <LinearGradient
                            colors={['#10B981', '#059669']}
                            style={styles.successGradient}
                        >
                            <Text style={styles.successEmoji}>🎉</Text>
                            <Text style={styles.successTitle}>Tebrikler!</Text>
                            <Text style={styles.successSubtitle}>Bulmacayı tamamladın</Text>

                            <View style={styles.successStats}>
                                <View style={styles.modalStatItem}>
                                    <Text style={styles.modalStatLabel}>Süre</Text>
                                    <Text style={styles.modalStatValue}>{formatTime(timer)}</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.modalStatItem}>
                                    <Text style={styles.modalStatLabel}>Deneme</Text>
                                    <Text style={styles.modalStatValue}>{attempts}</Text>
                                </View>
                            </View>

                            <View style={styles.rewardContainer}>
                                <Text style={styles.rewardText}>+100</Text>
                                <Text style={styles.rewardEmoji}>🪙</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.successButton}
                                onPress={handleComplete}
                                activeOpacity={0.9}
                            >
                                <Text style={styles.successButtonText}>Devam Et</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D1117',
    },
    safeArea: {
        flex: 1,
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#21262D',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#F0F6FC',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 20,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#21262D',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    timerText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#F0F6FC',
        fontVariant: ['tabular-nums'],
    },
    // Progress
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 16,
        gap: 12,
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#21262D',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#C9F158',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#8B949E',
        minWidth: 50,
        textAlign: 'right',
    },
    // Helper text
    helperText: {
        fontSize: 13,
        color: '#8B949E',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    // Board
    boardContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Controls
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#21262D',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 14,
    },
    resetButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#F0F6FC',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#8B949E',
        marginBottom: 2,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#F0F6FC',
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    successModal: {
        width: SCREEN_WIDTH * 0.85,
        borderRadius: 28,
        overflow: 'hidden',
    },
    successGradient: {
        padding: 32,
        alignItems: 'center',
    },
    successEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    successSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 24,
    },
    successStats: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    modalStatItem: {
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    modalStatLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 4,
    },
    modalStatValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    rewardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 24,
    },
    rewardText: {
        fontSize: 32,
        fontWeight: '900',
        color: '#C9F158',
    },
    rewardEmoji: {
        fontSize: 28,
    },
    successButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 48,
        paddingVertical: 16,
        borderRadius: 16,
    },
    successButtonText: {
        fontSize: 17,
        fontWeight: '800',
        color: '#10B981',
    },
    // Loading & Error
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        color: '#8B949E',
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    backButtonSimple: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#21262D',
        borderRadius: 12,
    },
    backButtonText: {
        color: '#F0F6FC',
        fontWeight: '700',
    },
});

export default ZipGameScreen;
