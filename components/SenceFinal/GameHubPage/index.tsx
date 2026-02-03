import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    RefreshControl,
    Modal,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { DailySpin } from './components/DailySpin';
import { GameStatus } from './components/GameCard';
import { DailyProgress } from './components/DailyProgress';
import { ZipGameScreen } from './components/ZipGame';
import { useGameHub } from './hooks';
import { Header } from '../LeaguePage/shared/Header';
import { useHeaderAnimation } from '../LeaguePage/hooks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');



export interface GameHubPageProps {
    onBack: () => void;
    onMenuToggle: () => void;
}

// Game definitions
const GAMES = [
    {
        id: 'zip',
        name: 'Zip',
        description: 'Hızlı tahmin oyunu',
        icon: '⚡',
        image: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=300&h=400&fit=crop',
        reward: 100,
        type: 'zip' as const,
    },
    {
        id: 'higher_lower',
        name: 'Higher / Lower',
        description: 'Daha yüksek mi alçak mı?',
        icon: '📊',
        image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&h=400&fit=crop',
        reward: 100,
        type: 'higher_lower' as const,
    },
    {
        id: 'locked',
        name: 'Yakında',
        description: 'Yeni oyun geliyor!',
        icon: '🔮',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=400&fit=crop',
        reward: 0,
        type: null,
    },
];


export function GameHubPage({ onBack, onMenuToggle }: GameHubPageProps) {
    const {
        loading,
        dailyState,
        error,
        spinAvailable,
        gamesCompleted,
        totalGames,
        todayEarnings,
        refreshState,
        spinWheel,
        completeGame,
        claimBonus,
    } = useGameHub();

    const [refreshing, setRefreshing] = useState(false);
    const [selectedGame, setSelectedGame] = useState<string | null>(null);
    const [showSpinModal, setShowSpinModal] = useState(false);
    const [showZipGame, setShowZipGame] = useState(false);

    // Initial value for slide animation
    // Header Animation
    const { headerTranslateY, handleScroll } = useHeaderAnimation();
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(slideAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await refreshState();
        setRefreshing(false);
    };

    const getGameStatus = (gameId: string): GameStatus => {
        if (gameId === 'locked') return 'locked';
        if (gameId === 'zip' && dailyState?.zip_completed) return 'completed';
        if (gameId === 'higher_lower' && dailyState?.higher_lower_completed) return 'completed';
        return 'available';
    };

    const getGameReward = (gameId: string): number => {
        if (gameId === 'zip') return dailyState?.zip_reward || 0;
        if (gameId === 'higher_lower') return dailyState?.higher_lower_reward || 0;
        return 0;
    };

    const handleGamePress = (gameId: string) => {
        if (gameId === 'locked') return;
        if (gameId === 'zip') {
            // Open Zip game directly
            setShowZipGame(true);
            return;
        }
        setSelectedGame(gameId);
    };

    const handleZipComplete = async () => {
        await completeGame('zip');
        setShowZipGame(false);
    };

    const handleClaimBonus = async () => {
        await claimBonus();
    };

    const handlePlayGame = async () => {
        if (!selectedGame) return;

        const game = GAMES.find(g => g.id === selectedGame);
        if (!game?.type) return;

        await completeGame(game.type);
        setSelectedGame(null);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0D1117" />

            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Header */}
            <Header onMenuToggle={onMenuToggle} headerTranslateY={headerTranslateY}>
                <View style={styles.headerTitleContainer}>
                    {/* Can be empty or hold centered title if needed independently */}
                </View>
            </Header>

            {/* ScrollView needs top padding and onScroll handler for animation */}

            {/* Content */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#10B981" />
                    <Text style={styles.loadingText}>Yükleniyor...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={48} color="#EF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={refreshState}>
                        <Text style={styles.retryButtonText}>Tekrar Dene</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor="#10B981"
                            colors={['#10B981']}
                            progressViewOffset={100}
                        />
                    }
                >
                    {/* Spin & Win Banner */}
                    <TouchableOpacity
                        style={styles.spinBanner}
                        onPress={() => setShowSpinModal(true)}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={['#10B981', '#059669', '#047857']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.spinBannerGradient}
                        >
                            {/* Mascot placeholder */}
                            <View style={styles.mascotContainer}>
                                <Text style={styles.mascotEmoji}>🦊</Text>
                            </View>

                            <View style={styles.spinBannerContent}>
                                <Text style={styles.spinBannerTitle}>SPIN</Text>
                                <Text style={styles.spinBannerAnd}>&</Text>
                                <Text style={styles.spinBannerWin}>WIN</Text>
                            </View>

                            {/* Mini wheel preview */}
                            <View style={styles.miniWheel}>
                                <View style={styles.miniWheelInner}>
                                    {[0, 1, 2, 3].map((i) => (
                                        <View
                                            key={i}
                                            style={[
                                                styles.miniWheelSegment,
                                                {
                                                    backgroundColor: i % 2 === 0 ? '#C9F158' : '#161B22',
                                                    transform: [{ rotate: `${i * 90}deg` }]
                                                }
                                            ]}
                                        />
                                    ))}
                                </View>
                                {!spinAvailable && (
                                    <View style={styles.miniWheelUsed}>
                                        <Ionicons name="checkmark" size={20} color="#10B981" />
                                    </View>
                                )}
                            </View>

                            {/* Floating coins */}
                            <Animated.View style={[styles.floatingCoinBanner, styles.bannerCoin1]}>
                                <Text>🪙</Text>
                            </Animated.View>
                            <Animated.View style={[styles.floatingCoinBanner, styles.bannerCoin2]}>
                                <Text>🪙</Text>
                            </Animated.View>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Oyunlar Section - Fixed Grid */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleContainer}>
                                <Text style={styles.sectionIcon}>🎮</Text>
                                <Text style={styles.sectionTitle}>Oyunlar</Text>
                            </View>
                        </View>

                        {/* Game Cards Grid - 3 cards, not scrollable */}
                        <View style={styles.gameCardsContainer}>
                            {/* Zip Game */}
                            <TouchableOpacity
                                style={styles.largeGameCard}
                                onPress={() => handleGamePress('zip')}
                                activeOpacity={0.9}
                                disabled={dailyState?.zip_completed}
                            >
                                <LinearGradient
                                    colors={dailyState?.zip_completed ? ['#30363D', '#21262D'] : ['#10B981', '#059669']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.largeGameCardGradient}
                                >
                                    {/* Background pattern */}
                                    <View style={styles.gameCardPattern}>
                                        <Text style={styles.gameCardPatternIcon}>⚡</Text>
                                        <Text style={[styles.gameCardPatternIcon, styles.patternIcon2]}>⚡</Text>
                                        <Text style={[styles.gameCardPatternIcon, styles.patternIcon3]}>⚡</Text>
                                    </View>

                                    {/* Status Badge */}
                                    {dailyState?.zip_completed ? (
                                        <View style={styles.completedBadge}>
                                            <Ionicons name="checkmark-circle" size={12} color="#C9F158" />
                                            <Text style={styles.completedBadgeText}>Tamamlandı</Text>
                                        </View>
                                    ) : (
                                        <View style={styles.rewardBadge}>
                                            <Text style={styles.rewardBadgeText}>+100 🪙</Text>
                                        </View>
                                    )}

                                    {/* Main Icon */}
                                    <View style={styles.gameCardMainIcon}>
                                        <Text style={styles.gameCardIconText}>⚡</Text>
                                    </View>

                                    {/* Game Name */}
                                    <Text style={styles.largeGameCardName}>Zip</Text>
                                    <Text style={styles.largeGameCardDesc}>Hızlı tahmin oyunu</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Higher/Lower Game */}
                            <TouchableOpacity
                                style={styles.largeGameCard}
                                onPress={() => handleGamePress('higher_lower')}
                                activeOpacity={0.9}
                                disabled={dailyState?.higher_lower_completed}
                            >
                                <LinearGradient
                                    colors={dailyState?.higher_lower_completed ? ['#30363D', '#21262D'] : ['#8B5CF6', '#7C3AED']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.largeGameCardGradient}
                                >
                                    {/* Background pattern */}
                                    <View style={styles.gameCardPattern}>
                                        <Text style={styles.gameCardPatternIcon}>📊</Text>
                                        <Text style={[styles.gameCardPatternIcon, styles.patternIcon2]}>📈</Text>
                                        <Text style={[styles.gameCardPatternIcon, styles.patternIcon3]}>📉</Text>
                                    </View>

                                    {/* Status Badge */}
                                    {dailyState?.higher_lower_completed ? (
                                        <View style={styles.completedBadge}>
                                            <Ionicons name="checkmark-circle" size={12} color="#C9F158" />
                                            <Text style={styles.completedBadgeText}>Tamamlandı</Text>
                                        </View>
                                    ) : (
                                        <View style={styles.rewardBadge}>
                                            <Text style={styles.rewardBadgeText}>+100 🪙</Text>
                                        </View>
                                    )}

                                    {/* Main Icon */}
                                    <View style={styles.gameCardMainIcon}>
                                        <Text style={styles.gameCardIconText}>📊</Text>
                                    </View>

                                    {/* Game Name */}
                                    <Text style={styles.largeGameCardName}>Higher / Lower</Text>
                                    <Text style={styles.largeGameCardDesc}>Daha yüksek mi alçak mı?</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Coming Soon Game */}
                            <View style={[styles.largeGameCard, styles.lockedGameCard]}>
                                <LinearGradient
                                    colors={['#21262D', '#161B22']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.largeGameCardGradient}
                                >
                                    {/* Locked overlay */}
                                    <View style={styles.lockedOverlay}>
                                        <Ionicons name="lock-closed" size={28} color="#8B949E" />
                                    </View>

                                    {/* Coming Soon Badge */}
                                    <View style={styles.comingSoonBadge}>
                                        <Text style={styles.comingSoonBadgeText}>Yakında</Text>
                                    </View>

                                    {/* Game Name */}
                                    <Text style={[styles.largeGameCardName, styles.lockedText]}>???</Text>
                                    <Text style={[styles.largeGameCardDesc, styles.lockedText]}>Yeni oyun geliyor!</Text>
                                </LinearGradient>
                            </View>
                        </View>
                    </View>

                    {/* Günlük İlerleme Section */}
                    <View style={[styles.section, { marginTop: 32 }]}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleContainer}>
                                <Text style={styles.sectionIcon}>📊</Text>
                                <Text style={styles.sectionTitle}>Günlük İlerleme</Text>
                            </View>
                        </View>
                    </View>

                    {/* Daily Progress */}
                    <DailyProgress
                        completed={gamesCompleted}
                        total={totalGames}
                        bonusClaimed={dailyState?.daily_bonus_claimed || false}
                        bonusAmount={200}
                        todayEarnings={todayEarnings}
                        onClaimBonus={handleClaimBonus}
                    />

                    {/* Bottom Spacing */}
                    <View style={styles.bottomSpacing} />
                </ScrollView>
            )}

            {/* Spin Wheel Modal */}
            <Modal
                visible={showSpinModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowSpinModal(false)}
            >
                <View style={styles.spinModal}>
                    <SafeAreaView style={styles.spinModalContent}>
                        {/* Modal Header */}
                        <View style={styles.spinModalHeader}>
                            <TouchableOpacity
                                style={styles.spinModalClose}
                                onPress={() => setShowSpinModal(false)}
                            >
                                <Ionicons name="chevron-back" size={24} color="#F0F6FC" />
                            </TouchableOpacity>

                            <View style={styles.spinModalCurrency}>
                                <View style={styles.currencyItem}>
                                    <Text style={styles.currencyIcon}>🪙</Text>
                                    <Text style={styles.currencyValue}>{todayEarnings}</Text>
                                    <TouchableOpacity style={styles.currencyAdd}>
                                        <Ionicons name="add" size={14} color="#0D1117" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Spin Wheel Component */}
                        <View style={styles.spinWheelContainer}>
                            <DailySpin
                                isUsed={!spinAvailable}
                                lastReward={dailyState?.daily_spin_reward || 0}
                                onSpin={spinWheel}
                            />
                        </View>
                    </SafeAreaView>
                </View>
            </Modal>

            {/* Game Modal */}
            <Modal
                visible={selectedGame !== null}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setSelectedGame(null)}
            >
                <View style={styles.gameModal}>
                    <SafeAreaView style={styles.gameModalContent}>
                        <View style={styles.gameModalHeader}>
                            <TouchableOpacity
                                style={styles.gameModalClose}
                                onPress={() => setSelectedGame(null)}
                            >
                                <Ionicons name="close" size={24} color="#F0F6FC" />
                            </TouchableOpacity>
                            <Text style={styles.gameModalTitle}>
                                {GAMES.find(g => g.id === selectedGame)?.name || 'Oyun'}
                            </Text>
                        </View>

                        <View style={styles.gameModalBody}>
                            <Text style={styles.gameModalIcon}>
                                {GAMES.find(g => g.id === selectedGame)?.icon || '🎮'}
                            </Text>
                            <Text style={styles.gameModalHeading}>Yakında!</Text>
                            <Text style={styles.gameModalDescription}>
                                Bu oyunun tam versiyonu çok yakında geliyor.{'\n'}
                                Şimdilik demo olarak tamamlayabilirsin.
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.gameModalPlayButton}
                            onPress={handlePlayGame}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#10B981', '#059669']}
                                style={styles.gameModalPlayGradient}
                            >
                                <Text style={styles.gameModalPlayText}>Tamamla (+100 coin)</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>
            </Modal>

            {/* Zip Game Modal */}
            <Modal
                visible={showZipGame}
                animationType="slide"
                presentationStyle="fullScreen"
            >
                <ZipGameScreen
                    onBack={() => setShowZipGame(false)}
                    onComplete={handleZipComplete}
                />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D1117',
    },
    headerTitleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingTop: 100, // Make room for fixed header
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#21262D',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContent: {
        flex: 1,
        marginLeft: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#C9F158',
    },
    currencyContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    currencyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#21262D',
        paddingLeft: 8,
        paddingRight: 4,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    currencyIcon: {
        fontSize: 16,
    },
    currencyValue: {
        fontSize: 14,
        fontWeight: '800',
        color: '#F0F6FC',
    },
    currencyAdd: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#C9F158',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#8B949E',
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    errorText: {
        marginTop: 12,
        fontSize: 16,
        color: '#8B949E',
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 16,
        backgroundColor: '#21262D',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    retryButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F0F6FC',
    },
    // Spin Banner
    spinBanner: {
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 24,
        overflow: 'hidden',
    },
    spinBannerGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        minHeight: 140,
        position: 'relative',
    },
    mascotContainer: {
        width: 80,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mascotEmoji: {
        fontSize: 60,
    },
    spinBannerContent: {
        flex: 1,
        marginLeft: 8,
    },
    spinBannerTitle: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 2,
    },
    spinBannerAnd: {
        fontSize: 20,
        fontWeight: '600',
        color: '#C9F158',
        marginVertical: -4,
    },
    spinBannerWin: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 2,
    },
    miniWheel: {
        width: 80,
        height: 80,
        position: 'relative',
    },
    miniWheelInner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#C9F158',
        overflow: 'hidden',
        position: 'relative',
    },
    miniWheelSegment: {
        position: 'absolute',
        width: 40,
        height: 40,
        top: 0,
        left: 0,
        transformOrigin: 'bottom right',
    },
    miniWheelUsed: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    floatingCoinBanner: {
        position: 'absolute',
    },
    bannerCoin1: {
        top: 10,
        right: 20,
        opacity: 0.6,
    },
    bannerCoin2: {
        bottom: 10,
        right: 40,
        opacity: 0.4,
    },
    // Sections
    section: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionIcon: {
        fontSize: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#F0F6FC',
    },
    sectionActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    viewAllButton: {
        backgroundColor: '#10B981',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    viewAllText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    arrowButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#21262D',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Top Games
    topGamesScroll: {
        gap: 12,
    },
    topGameCard: {
        width: 120,
        height: 160,
        borderRadius: 16,
        overflow: 'hidden',
    },
    topGameGradient: {
        flex: 1,
        padding: 12,
        justifyContent: 'flex-end',
    },
    topGameIcon: {
        fontSize: 40,
        marginBottom: 8,
    },
    topGameName: {
        fontSize: 12,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    // Games Grid
    gamesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    bottomSpacing: {
        height: 120,
    },
    // Daily Games Section
    dailyGamesSection: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    // Large Game Cards - Horizontal Layout
    gameCardsContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    largeGameCard: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    lockedGameCard: {
        shadowOpacity: 0,
        elevation: 0,
    },
    largeGameCardGradient: {
        padding: 12,
        height: 160,
        position: 'relative',
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    gameCardPattern: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    gameCardPatternIcon: {
        position: 'absolute',
        fontSize: 50,
        opacity: 0.15,
        top: -10,
        right: -10,
    },
    patternIcon2: {
        top: 30,
        right: 20,
        fontSize: 30,
        opacity: 0.1,
    },
    patternIcon3: {
        top: 60,
        right: 40,
        fontSize: 25,
        opacity: 0.07,
    },
    completedBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 8,
        gap: 3,
    },
    completedBadgeText: {
        fontSize: 9,
        fontWeight: '700',
        color: '#C9F158',
    },
    rewardBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    rewardBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    gameCardMainIcon: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    gameCardIconText: {
        fontSize: 22,
    },
    largeGameCardName: {
        fontSize: 14,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 2,
        letterSpacing: 0.3,
    },
    largeGameCardDesc: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    lockedOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    comingSoonBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(139, 148, 158, 0.3)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    comingSoonBadgeText: {
        fontSize: 9,
        fontWeight: '700',
        color: '#8B949E',
    },
    lockedText: {
        color: '#6E7681',
    },
    // Spin Modal
    spinModal: {
        flex: 1,
        backgroundColor: '#0D1117',
    },
    spinModalContent: {
        flex: 1,
    },
    spinModalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    spinModalClose: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#21262D',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinModalCurrency: {
        flexDirection: 'row',
    },
    spinWheelContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    // Game Modal
    gameModal: {
        flex: 1,
        backgroundColor: '#0D1117',
    },
    gameModalContent: {
        flex: 1,
    },
    gameModalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#21262D',
    },
    gameModalClose: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#21262D',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gameModalTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '800',
        color: '#F0F6FC',
        textAlign: 'center',
        marginRight: 40,
    },
    gameModalBody: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    gameModalIcon: {
        fontSize: 80,
        marginBottom: 24,
    },
    gameModalHeading: {
        fontSize: 28,
        fontWeight: '900',
        color: '#F0F6FC',
        marginBottom: 12,
    },
    gameModalDescription: {
        fontSize: 16,
        color: '#8B949E',
        textAlign: 'center',
        lineHeight: 24,
    },
    gameModalPlayButton: {
        marginHorizontal: 24,
        marginBottom: 24,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
    },
    gameModalPlayGradient: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    gameModalPlayText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
    },
});

export default GameHubPage;
