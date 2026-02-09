import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Alert,
    ScrollView,
    ImageBackground,
    Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    interpolate,
    Extrapolation,
    cancelAnimation,
} from 'react-native-reanimated';
import { Platform } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from '@/contexts/AuthContext';
import { leagueVotesService, UnansweredQuestion } from '@/services/league-votes.service';
import { League } from '../types';
import { RaceStats } from './RaceStats';
import { RaceEmptyState } from './RaceEmptyState';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_VELOCITY = 500;

interface RaceArenaProps {
    league: League;
    onClose: () => void;
}

export function RaceArena({ league, onClose }: RaceArenaProps) {
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
    const [questions, setQuestions] = useState<UnansweredQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showStats, setShowStats] = useState(false);
    const [history, setHistory] = useState<{ type: 'vote' | 'skip'; voteId?: string; questionId: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [skippedQuestions, setSkippedQuestions] = useState<UnansweredQuestion[]>([]);


    // Animation values
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotate = useSharedValue(0);
    const scale = useSharedValue(1);
    const cardOpacity = useSharedValue(1); // Control visibility during swap

    // Load questions
    const loadQuestions = useCallback(async () => {
        if (!user || !league) return;

        try {
            setLoading(true);
            const result = await leagueVotesService.getUnansweredQuestions(league.id, user.id, 30);

            if (result.data) {
                setQuestions(result.data);
                setCurrentIndex(0);
            }
        } catch (err) {
            console.error('Load questions error:', err);
            Alert.alert('Hata', 'Sorular yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    }, [user, league]);

    useEffect(() => {
        loadQuestions();
    }, [loadQuestions]);

    // Handle vote submission
    const handleVote = useCallback(async (vote: 'yes' | 'no' | 'skip') => {
        // Active questions memoized below
        const activeQuestionsList = selectedCategory === 'all'
            ? [...questions, ...skippedQuestions]
            : [...questions.filter(q => q.category_name === selectedCategory), ...skippedQuestions.filter(q => q.category_name === selectedCategory)];

        if (!user || currentIndex >= activeQuestionsList.length) return;

        const questionToVote = activeQuestionsList[currentIndex];
        const odds = vote === 'yes' ? questionToVote.yes_odds : questionToVote.no_odds;

        // For SKIP: add to skipped queue and move to next (no API call)
        if (vote === 'skip') {
            setSkippedQuestions(prev => [...prev, questionToVote]);
            setHistory(prev => [...prev, { type: 'skip', questionId: questionToVote.id }]);
            setCurrentIndex(prev => prev + 1);
            return;
        }

        try {
            const result = await leagueVotesService.submitVote({
                league_id: league.id,
                user_id: user.id,
                question_id: questionToVote.id,
                vote,
                odds_at_vote: odds,
            });

            if (result.data) {
                setHistory(prev => [...prev, { type: 'vote', voteId: result.data.id, questionId: questionToVote.id }]);
                setCurrentIndex(prev => prev + 1);
            }
        } catch (err) {
            console.error('Vote error:', err);
        }
    }, [user, league, questions, skippedQuestions, currentIndex, selectedCategory]);

    // Show card after index update
    useEffect(() => {
        // Fade in new card after swap
        cardOpacity.value = withTiming(1, { duration: 100 });
    }, [currentIndex]);

    // Handle undo
    const handleUndo = useCallback(async () => {
        if (history.length === 0) return;
        const lastAction = history[history.length - 1];

        // Reset animations immediately to prevent bounce during card swap
        translateX.value = 0;
        translateY.value = 0;
        rotate.value = 0;
        scale.value = 1;

        if (lastAction.type === 'vote' && lastAction.voteId) {
            try {
                await leagueVotesService.undoVote(lastAction.voteId);
            } catch (err) {
                console.error('Undo error:', err);
                return;
            }
        } else if (lastAction.type === 'skip') {
            // Remove from skipped list
            setSkippedQuestions(prev => prev.filter(q => q.id !== lastAction.questionId));
        }

        setHistory(prev => prev.slice(0, -1));
        setCurrentIndex(prev => Math.max(0, prev - 1));
    }, [history]);

    // Reset animation values
    const resetPosition = useCallback(() => {
        translateX.value = withSpring(0, { damping: 15 });
        translateY.value = withSpring(0, { damping: 15 });
        rotate.value = withSpring(0, { damping: 15 });
        scale.value = withSpring(1, { damping: 15 });
    }, []);

    // Swipe away animation
    // Swipe away animation
    const swipeAway = useCallback((direction: 'left' | 'right' | 'up') => {
        const targetX = direction === 'left' ? -SCREEN_WIDTH * 1.5 : direction === 'right' ? SCREEN_WIDTH * 1.5 : 0;
        const targetY = direction === 'up' ? -SCREEN_HEIGHT : 0;
        const vote = direction === 'left' ? 'yes' : direction === 'right' ? 'no' : 'skip';

        // Animate out
        translateX.value = withTiming(targetX, { duration: 250 });
        translateY.value = withTiming(targetY, { duration: 250 }, () => {
            // Callback after animation completes
            cardOpacity.value = 0; // Hide immediately
            translateX.value = 0;
            translateY.value = 0;
            rotate.value = 0;
            scale.value = 1;

            runOnJS(handleVote)(vote);
        });
    }, [handleVote]);

    // Gesture handler
    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = e.translationX;
            translateY.value = e.translationY;
            rotate.value = (e.translationX / SCREEN_WIDTH) * 20;
        })
        .onEnd((e) => {
            // Check swipe direction: LEFT = YES, RIGHT = NO, UP = SKIP
            if (Math.abs(e.translationX) > SWIPE_THRESHOLD || Math.abs(e.velocityX) > SWIPE_VELOCITY) {
                if (e.translationX > 0) {
                    runOnJS(swipeAway)('right');
                } else {
                    runOnJS(swipeAway)('left');
                }
            } else if (e.translationY < -SWIPE_THRESHOLD * 0.8 || e.velocityY < -SWIPE_VELOCITY) {
                // UP = negative Y
                runOnJS(swipeAway)('up');
            } else {
                runOnJS(resetPosition)();
            }
        });

    // Animated styles for current card
    const cardAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: cardOpacity.value,
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotate: `${rotate.value}deg` },
                { scale: scale.value },
            ],
        };
    });

    // Animated styles for next card - STATIC (no animation to prevent shaking)
    // Next card animation - scales up as current card slides away
    const nextCardAnimatedStyle = useAnimatedStyle(() => {
        const swipeProgress = interpolate(
            Math.abs(translateX.value),
            [0, SCREEN_WIDTH / 2],
            [0, 1],
            Extrapolation.CLAMP
        );
        const nextScale = interpolate(swipeProgress, [0, 1], [0.95, 1]);
        const nextOpacity = interpolate(swipeProgress, [0, 1], [0.85, 1]);

        return {
            transform: [{ scale: nextScale }],
            opacity: nextOpacity,
        };
    });

    // Yes/No overlay opacity - LEFT = YES (green), RIGHT = NO (red)
    const yesOverlayStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [-SCREEN_WIDTH * 0.3, 0], [1, 0], Extrapolation.CLAMP),
    }));

    const noOverlayStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [0, SCREEN_WIDTH * 0.3], [0, 1], Extrapolation.CLAMP),
    }));

    // UP = SKIP (negative Y)
    const skipOverlayStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateY.value, [-SCREEN_HEIGHT * 0.15, 0], [1, 0], Extrapolation.CLAMP),
    }));

    // Extract unique categories from questions
    const categories = React.useMemo(() => {
        const cats = questions.map(q => q.category_name).filter((c): c is string => !!c);
        const uniqueCategories = [...new Set(cats)];
        return ['all', ...uniqueCategories];
    }, [questions]);

    // Filter questions by selected category, then append skipped questions at the end
    const activeQuestions = React.useMemo(() => {
        const baseQuestions = selectedCategory === 'all'
            ? questions
            : questions.filter(q => q.category_name === selectedCategory);

        // Append skipped questions that match the current filter
        const matchingSkipped = selectedCategory === 'all'
            ? skippedQuestions
            : skippedQuestions.filter(q => q.category_name === selectedCategory);

        return [...baseQuestions, ...matchingSkipped];
    }, [questions, selectedCategory, skippedQuestions]);

    const currentQuestion = activeQuestions[currentIndex];
    const nextQuestion = activeQuestions[currentIndex + 1];
    const hasQuestions = activeQuestions.length > 0 && currentIndex < activeQuestions.length;

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#10B981" />
                    <Text style={styles.loadingText}>Sorular yükleniyor...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.safeArea}>
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                    <TouchableOpacity style={styles.backButton} onPress={onClose} activeOpacity={0.7}>
                        <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>{league.name}</Text>
                        <Text style={styles.headerSubtitle}>
                            {activeQuestions.length - currentIndex} soru kaldı
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.statsButton}
                        onPress={() => setShowStats(true)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="stats-chart" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {/* Category Tabs */}
                {categories.length > 1 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.categoryTabs}
                        contentContainerStyle={styles.categoryTabsContent}
                    >
                        {categories.map((cat, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.categoryTab,
                                    selectedCategory === cat && styles.categoryTabActive
                                ]}
                                onPress={() => setSelectedCategory(cat)}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.categoryTabText,
                                    selectedCategory === cat && styles.categoryTabTextActive
                                ]}>
                                    {cat === 'all' ? 'Tümü' : cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                {/* Card Area */}
                <View style={styles.cardArea}>
                    {!hasQuestions ? (
                        <RaceEmptyState
                            onExplore={onClose}
                            onResetFilter={() => setSelectedCategory('all')}
                            categoryName={selectedCategory === 'all' ? undefined : selectedCategory}
                        />
                    ) : (
                        <>
                            {/* Next Card (behind) */}
                            {nextQuestion && (
                                <Animated.View style={[styles.cardContainer, styles.nextCard, nextCardAnimatedStyle]}>
                                    {nextQuestion.image_url ? (
                                        <ImageBackground
                                            source={{ uri: nextQuestion.image_url }}
                                            style={styles.card}
                                            imageStyle={styles.cardImage}
                                        >
                                            <View style={styles.cardOverlay} />
                                            <Text style={styles.questionText} numberOfLines={4}>
                                                {nextQuestion.title}
                                            </Text>
                                        </ImageBackground>
                                    ) : (
                                        <LinearGradient
                                            colors={['#1a1a2e', '#16213e']}
                                            style={styles.card}
                                        >
                                            <Text style={styles.questionText} numberOfLines={4}>
                                                {nextQuestion.title}
                                            </Text>
                                        </LinearGradient>
                                    )}
                                </Animated.View>
                            )}

                            {/* Current Card */}
                            <GestureDetector gesture={panGesture}>
                                <Animated.View style={[styles.cardContainer, cardAnimatedStyle]}>
                                    <View style={styles.card}>
                                        {/* Background Image or Gradient */}
                                        {currentQuestion?.image_url && (
                                            <ImageBackground
                                                source={{ uri: currentQuestion.image_url }}
                                                style={StyleSheet.absoluteFillObject}
                                                imageStyle={styles.cardImage}
                                            >
                                                <View style={styles.cardOverlay} />
                                            </ImageBackground>
                                        )}
                                        {!currentQuestion?.image_url && (
                                            <LinearGradient
                                                colors={['#0f0f23', '#1a1a2e', '#16213e']}
                                                style={StyleSheet.absoluteFillObject}
                                            />
                                        )}

                                        {/* Yes Overlay */}
                                        <Animated.View style={[styles.voteOverlay, styles.yesOverlay, yesOverlayStyle]}>
                                            <View style={styles.overlayContent}>
                                                <Text style={styles.overlayText}>EVET</Text>
                                                <Text style={styles.overlayOdds}>{currentQuestion?.yes_odds}x</Text>
                                            </View>
                                        </Animated.View>

                                        {/* No Overlay */}
                                        <Animated.View style={[styles.voteOverlay, styles.noOverlay, noOverlayStyle]}>
                                            <View style={styles.overlayContent}>
                                                <Text style={styles.overlayText}>HAYIR</Text>
                                                <Text style={styles.overlayOdds}>{currentQuestion?.no_odds}x</Text>
                                            </View>
                                        </Animated.View>

                                        {/* Skip Overlay */}
                                        <Animated.View style={[styles.voteOverlay, styles.skipOverlay, skipOverlayStyle]}>
                                            <View style={styles.overlayContent}>
                                                <Text style={[styles.overlayText, { color: '#9CA3AF' }]}>PAS</Text>
                                            </View>
                                        </Animated.View>

                                        {/* Category Badge */}
                                        {currentQuestion?.category_name && (
                                            <View style={styles.categoryBadge}>
                                                <Text style={styles.categoryIcon}>{currentQuestion.category_icon || '🎯'}</Text>
                                                <Text style={styles.categoryText}>{currentQuestion.category_name}</Text>
                                            </View>
                                        )}

                                        {/* Question */}
                                        <View style={styles.questionContainer}>
                                            <Text style={styles.questionText}>{currentQuestion?.title}</Text>
                                        </View>

                                        {/* Odds Display */}
                                        <View style={styles.oddsContainer}>
                                            <View style={styles.oddsBox}>
                                                <Text style={styles.oddsLabel}>EVET</Text>
                                                <Text style={[styles.oddsValue, { color: '#10B981' }]}>
                                                    {currentQuestion?.yes_odds}x
                                                </Text>
                                            </View>
                                            <View style={styles.oddsDivider} />
                                            <View style={styles.oddsBox}>
                                                <Text style={styles.oddsLabel}>HAYIR</Text>
                                                <Text style={[styles.oddsValue, { color: '#EF4444' }]}>
                                                    {currentQuestion?.no_odds}x
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Swipe Hints */}
                                        <View style={styles.hintsContainer}>
                                            <View style={styles.hintItem}>
                                                <Ionicons name="arrow-back" size={16} color="#10B981" />
                                                <Text style={styles.hintText}>Evet</Text>
                                            </View>
                                            <View style={styles.hintItem}>
                                                <Ionicons name="arrow-up" size={16} color="#9CA3AF" />
                                                <Text style={styles.hintText}>Pas</Text>
                                            </View>
                                            <View style={styles.hintItem}>
                                                <Text style={styles.hintText}>Hayır</Text>
                                                <Ionicons name="arrow-forward" size={16} color="#EF4444" />
                                            </View>
                                        </View>
                                    </View>
                                </Animated.View>
                            </GestureDetector>
                        </>
                    )}
                </View>

                {/* Stats Modal */}
                <RaceStats
                    visible={showStats}
                    league={league}
                    onClose={() => setShowStats(false)}
                />
            </View>

            {/* Undo Button */}
            {history.length > 0 && hasQuestions && (
                <View style={[styles.undoButtonContainer, { bottom: insets.bottom + 40 }]}>
                    <TouchableOpacity style={styles.undoButton} onPress={handleUndo} activeOpacity={0.8}>
                        <LinearGradient
                            colors={['#374151', '#1F2937']}
                            style={styles.undoGradient}
                        >
                            <Ionicons name="arrow-undo" size={20} color="#FFFFFF" />
                            <Text style={styles.undoText}>Geri Al</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            )}
        </GestureHandlerRootView>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
        color: '#10B981',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 2,
    },
    statsButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardArea: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
    },
    cardContainer: {
        position: 'absolute',
        top: 20,
        width: SCREEN_WIDTH - 40,
        height: SCREEN_HEIGHT * 0.55,
    },
    nextCard: {
        zIndex: 0,
    },
    card: {
        flex: 1,
        borderRadius: 28,
        padding: 24,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
        overflow: 'hidden',
    },
    voteOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 28,
        zIndex: 10,
    },
    yesOverlay: {
        backgroundColor: 'rgba(16, 185, 129, 0.3)',
        borderWidth: 4,
        borderColor: '#10B981',
    },
    noOverlay: {
        backgroundColor: 'rgba(239, 68, 68, 0.3)',
        borderWidth: 4,
        borderColor: '#EF4444',
    },
    skipOverlay: {
        backgroundColor: 'rgba(156, 163, 175, 0.2)',
        borderWidth: 3,
        borderColor: '#9CA3AF',
    },
    overlayContent: {
        alignItems: 'center',
    },
    overlayText: {
        fontSize: 42,
        fontWeight: '900',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    overlayOdds: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 8,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    categoryIcon: {
        fontSize: 16,
    },
    categoryText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    questionContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 20,
    },
    questionText: {
        fontSize: 26,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 36,
    },
    oddsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        overflow: 'hidden',
    },
    oddsBox: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
    },
    oddsDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    oddsLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 4,
    },
    oddsValue: {
        fontSize: 24,
        fontWeight: '900',
    },
    hintsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 16,
    },
    hintItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    hintText: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.5)',
    },
    undoButtonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 100,
    },
    undoButton: {
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    undoGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    undoText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    // Category tabs styles
    categoryTabs: {
        maxHeight: 50,
        marginBottom: 8,
    },
    categoryTabsContent: {
        paddingHorizontal: 16,
        gap: 8,
        alignItems: 'center',
    },
    categoryTab: {
        paddingHorizontal: 16,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryTabActive: {
        backgroundColor: 'rgba(16,185,129,0.2)',
        borderColor: '#10B981',
    },
    categoryTabText: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
    },
    categoryTabTextActive: {
        color: '#FFFFFF',
    },
    // Card image styles
    cardImage: {
        borderRadius: 28,
    },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.55)',
        borderRadius: 28,
    },
});
