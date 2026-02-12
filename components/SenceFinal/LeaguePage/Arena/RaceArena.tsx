import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useAuth } from '@/contexts/AuthContext';
import { leagueVotesService, UnansweredQuestion } from '@/services/league-votes.service';

import { League } from '../types';
import { RaceStats } from './RaceStats';
import { RaceEmptyState } from './RaceEmptyState';
import { NEGATIVE_RED, PRIMARY_BLUE, YES_GREEN } from '../shared/theme';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_VELOCITY = 500;

type SwipeDirection = 'left' | 'right' | 'up';
type LastAction = {
  canUndo: boolean;
  direction: SwipeDirection;
  questionId: string;
  type: 'vote' | 'skip';
  voteId?: string;
};

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
  const [lastAction, setLastAction] = useState<LastAction | null>(null);
  const [isUndoing, setIsUndoing] = useState(false);
  const [pendingUndoDirection, setPendingUndoDirection] = useState<SwipeDirection | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [skippedQuestions, setSkippedQuestions] = useState<UnansweredQuestion[]>([]);
  const [frozenNextQuestion, setFrozenNextQuestion] = useState<UnansweredQuestion | null>(null);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);
  const cardOpacity = useSharedValue(1);
  const nextCardProgress = useSharedValue(0);

  const entryTranslateX = useSharedValue(0);
  const entryTranslateY = useSharedValue(0);
  const entryOpacity = useSharedValue(1);
  const nextQuestionRef = useRef<UnansweredQuestion | null>(null);

  const loadQuestions = useCallback(async () => {
    if (!user || !league) return;

    try {
      setLoading(true);
      const result = await leagueVotesService.getUnansweredQuestions(league.id, user.id, 30);

      if (result.data) {
        setQuestions(result.data);
        setCurrentIndex(0);
        setLastAction(null);
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

  const handleVote = useCallback(
    async (vote: 'yes' | 'no' | 'skip', direction: SwipeDirection) => {
      const activeQuestionsList =
        selectedCategory === 'all'
          ? [...questions, ...skippedQuestions]
          : [
              ...questions.filter(q => q.category_name === selectedCategory),
              ...skippedQuestions.filter(q => q.category_name === selectedCategory),
            ];

      if (!user || currentIndex >= activeQuestionsList.length) return;

      const questionToVote = activeQuestionsList[currentIndex];
      const odds = vote === 'yes' ? questionToVote.yes_odds : questionToVote.no_odds;

      if (vote === 'skip') {
        setSkippedQuestions(prev => [...prev, questionToVote]);
        setLastAction({
          canUndo: true,
          direction,
          questionId: questionToVote.id,
          type: 'skip',
        });
        setCurrentIndex(prev => prev + 1);
        return;
      }

      try {
        const result = await leagueVotesService.submitVote({
          league_id: league.id,
          odds_at_vote: odds,
          question_id: questionToVote.id,
          user_id: user.id,
          vote,
        });

        if (result.data) {
          setLastAction({
            canUndo: true,
            direction,
            questionId: questionToVote.id,
            type: 'vote',
            voteId: result.data.id,
          });
          setCurrentIndex(prev => prev + 1);
        }
      } catch (err) {
        console.error('Vote error:', err);
      }
    },
    [currentIndex, league, questions, selectedCategory, skippedQuestions, user],
  );

  useLayoutEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    rotate.value = 0;
    scale.value = 1;

    if (pendingUndoDirection) {
      const startX =
        pendingUndoDirection === 'left'
          ? -SCREEN_WIDTH * 0.16
          : pendingUndoDirection === 'right'
            ? SCREEN_WIDTH * 0.16
            : 0;
      const startY = pendingUndoDirection === 'up' ? -SCREEN_HEIGHT * 0.12 : 0;

      nextCardProgress.value = 0;
      entryTranslateX.value = startX;
      entryTranslateY.value = startY;
      entryOpacity.value = 0;
      cardOpacity.value = 1;

      entryTranslateX.value = withTiming(0, {
        duration: 1100,
        easing: Easing.inOut(Easing.quad),
      });
      entryTranslateY.value = withTiming(0, {
        duration: 1100,
        easing: Easing.inOut(Easing.quad),
      });
      entryOpacity.value = withTiming(1, { duration: 1100 }, finished => {
        if (finished) {
          runOnJS(setIsUndoing)(false);
          runOnJS(setPendingUndoDirection)(null);
          runOnJS(setFrozenNextQuestion)(null);
        }
      });
      return;
    }

    nextCardProgress.value = 0;
    entryOpacity.value = 1;
    entryTranslateX.value = 0;
    entryTranslateY.value = 0;
    cardOpacity.value = withTiming(1, { duration: 100 });

    const timer = setTimeout(() => {
      setFrozenNextQuestion(null);
    }, 170);

    return () => clearTimeout(timer);
  }, [
    cardOpacity,
    currentIndex,
    entryOpacity,
    entryTranslateX,
    entryTranslateY,
    nextCardProgress,
    pendingUndoDirection,
    rotate,
    scale,
    translateX,
    translateY,
  ]);

  const resetPosition = useCallback(() => {
    translateX.value = withSpring(0, { damping: 15 });
    translateY.value = withSpring(0, { damping: 15 });
    rotate.value = withSpring(0, { damping: 15 });
    scale.value = withSpring(1, { damping: 15 });
    nextCardProgress.value = withTiming(0, { duration: 180 });
  }, [nextCardProgress, rotate, scale, translateX, translateY]);

  const handleUndo = useCallback(async () => {
    if (isUndoing || !lastAction || !lastAction.canUndo) return;

    const activeQuestionsList =
      selectedCategory === 'all'
        ? [...questions, ...skippedQuestions]
        : [
            ...questions.filter(q => q.category_name === selectedCategory),
            ...skippedQuestions.filter(q => q.category_name === selectedCategory),
          ];
    const currentVisibleQuestion = activeQuestionsList[currentIndex] ?? null;

    setIsUndoing(true);
    setFrozenNextQuestion(currentVisibleQuestion);
    nextCardProgress.value = 0;

    if (lastAction.type === 'vote' && lastAction.voteId) {
      try {
        await leagueVotesService.undoVote(lastAction.voteId);
      } catch (err) {
        console.error('Undo error:', err);
        setIsUndoing(false);
        return;
      }
    } else if (lastAction.type === 'skip') {
      setSkippedQuestions(prev => prev.filter(q => q.id !== lastAction.questionId));
    }

    setPendingUndoDirection(lastAction.direction);
    setLastAction(null);
    setCurrentIndex(prev => Math.max(0, prev - 1));
  }, [currentIndex, isUndoing, lastAction, nextCardProgress, questions, selectedCategory, skippedQuestions]);

  const swipeAway = useCallback(
    (direction: SwipeDirection) => {
      const targetX = direction === 'left' ? -SCREEN_WIDTH * 1.5 : direction === 'right' ? SCREEN_WIDTH * 1.5 : 0;
      const targetY = direction === 'up' ? -SCREEN_HEIGHT : 0;
      const vote = direction === 'left' ? 'yes' : direction === 'right' ? 'no' : 'skip';

      setFrozenNextQuestion(nextQuestionRef.current || null);
      nextCardProgress.value = withTiming(1, { duration: 180 });
      translateX.value = withTiming(targetX, { duration: 260 });
      translateY.value = withTiming(targetY, { duration: 260 }, () => {
        runOnJS(handleVote)(vote, direction);
      });
    },
    [handleVote, nextCardProgress, translateX, translateY],
  );

  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
      rotate.value = (e.translationX / SCREEN_WIDTH) * 20;

      const horizontalProgress = Math.abs(e.translationX) / (SCREEN_WIDTH * 0.35);
      const verticalProgress = Math.abs(e.translationY) / (SCREEN_HEIGHT * 0.22);
      const swipeProgress = Math.min(1, Math.max(horizontalProgress, verticalProgress));
      nextCardProgress.value = swipeProgress;
    })
    .onEnd(e => {
      if (Math.abs(e.translationX) > SWIPE_THRESHOLD || Math.abs(e.velocityX) > SWIPE_VELOCITY) {
        if (e.translationX > 0) {
          runOnJS(swipeAway)('right');
        } else {
          runOnJS(swipeAway)('left');
        }
      } else if (e.translationY < -SWIPE_THRESHOLD * 0.8 || e.velocityY < -SWIPE_VELOCITY) {
        runOnJS(swipeAway)('up');
      } else {
        runOnJS(resetPosition)();
      }
    });

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value * entryOpacity.value,
    transform: [
      { translateX: translateX.value + entryTranslateX.value },
      { translateY: translateY.value + entryTranslateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  const nextCardAnimatedStyle = useAnimatedStyle(() => {
    const nextOpacity = interpolate(nextCardProgress.value, [0, 1], [0.72, 1], Extrapolation.CLAMP);
    const nextTranslateY = interpolate(nextCardProgress.value, [0, 1], [14, 0], Extrapolation.CLAMP);

    return {
      opacity: nextOpacity,
      transform: [{ translateY: nextTranslateY }],
    };
  });

  const yesOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SCREEN_WIDTH * 0.3, 0], [1, 0], Extrapolation.CLAMP),
  }));

  const noOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SCREEN_WIDTH * 0.3], [0, 1], Extrapolation.CLAMP),
  }));

  const skipOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [-SCREEN_HEIGHT * 0.15, 0], [1, 0], Extrapolation.CLAMP),
  }));

  const categories = React.useMemo(() => {
    const cats = questions.map(q => q.category_name).filter((c): c is string => !!c);
    const uniqueCategories = [...new Set(cats)];
    return ['all', ...uniqueCategories];
  }, [questions]);

  const activeQuestions = React.useMemo(() => {
    const baseQuestions =
      selectedCategory === 'all' ? questions : questions.filter(q => q.category_name === selectedCategory);

    const matchingSkipped =
      selectedCategory === 'all'
        ? skippedQuestions
        : skippedQuestions.filter(q => q.category_name === selectedCategory);

    return [...baseQuestions, ...matchingSkipped];
  }, [questions, selectedCategory, skippedQuestions]);

  const currentQuestion = activeQuestions[currentIndex];
  const nextQuestion = activeQuestions[currentIndex + 1];
  const displayedNextQuestion = frozenNextQuestion ?? nextQuestion;
  const hasQuestions = activeQuestions.length > 0 && currentIndex < activeQuestions.length;
  const remainingQuestions = Math.max(activeQuestions.length - currentIndex, 0);
  const showUndoInHeader = !!lastAction?.canUndo;

  useEffect(() => {
    nextQuestionRef.current = nextQuestion || null;
  }, [nextQuestion]);

  const renderQuestionCard = (question: UnansweredQuestion, includeOverlays: boolean) => (
    <View style={styles.card}>
      {question.image_url ? (
        <ImageBackground
          source={{ uri: question.image_url }}
          style={StyleSheet.absoluteFillObject}
          imageStyle={styles.cardImage}
        >
          <View style={styles.cardOverlay} />
        </ImageBackground>
      ) : (
        <LinearGradient colors={['#0f0f23', '#1a1a2e', '#16213e']} style={StyleSheet.absoluteFillObject} />
      )}

      {includeOverlays && (
        <>
          <Animated.View style={[styles.voteOverlay, styles.yesOverlay, yesOverlayStyle]}>
            <View style={styles.overlayContent}>
              <Text style={styles.overlayText}>EVET</Text>
              <Text style={styles.overlayOdds}>{question.yes_odds}x</Text>
            </View>
          </Animated.View>

          <Animated.View style={[styles.voteOverlay, styles.noOverlay, noOverlayStyle]}>
            <View style={styles.overlayContent}>
              <Text style={styles.overlayText}>HAYIR</Text>
              <Text style={styles.overlayOdds}>{question.no_odds}x</Text>
            </View>
          </Animated.View>

          <Animated.View style={[styles.voteOverlay, styles.skipOverlay, skipOverlayStyle]}>
            <View style={styles.overlayContent}>
              <Text style={[styles.overlayText, { color: '#9CA3AF' }]}>PAS</Text>
            </View>
          </Animated.View>
        </>
      )}

      {question.category_name && (
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryIcon}>{question.category_icon || '🎯'}</Text>
          <Text style={styles.categoryText}>{question.category_name}</Text>
        </View>
      )}

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.title}</Text>
      </View>

      <View style={styles.oddsContainer}>
        <View style={styles.oddsBox}>
          <Text style={styles.oddsLabel}>EVET</Text>
          <Text style={[styles.oddsValue, { color: YES_GREEN }]}>{question.yes_odds}x</Text>
        </View>
        <View style={styles.oddsDivider} />
        <View style={styles.oddsBox}>
          <Text style={styles.oddsLabel}>HAYIR</Text>
          <Text style={[styles.oddsValue, { color: NEGATIVE_RED }]}>{question.no_odds}x</Text>
        </View>
      </View>

      <View style={styles.hintsContainer}>
        <View style={styles.hintItem}>
          <Ionicons name="arrow-back" size={16} color={YES_GREEN} />
          <Text style={styles.hintText}>Evet</Text>
        </View>
        <View style={styles.hintItem}>
          <Ionicons name="arrow-up" size={16} color="#9CA3AF" />
          <Text style={styles.hintText}>Pas</Text>
        </View>
        <View style={styles.hintItem}>
          <Text style={styles.hintText}>Hayır</Text>
          <Ionicons name="arrow-forward" size={16} color={NEGATIVE_RED} />
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_BLUE} />
          <Text style={styles.loadingText}>Sorular yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.safeArea}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.backButton} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{league.name}</Text>
          </View>

          <View style={styles.headerActions}>
            {showUndoInHeader && (
              <TouchableOpacity
                style={[styles.headerActionButton, isUndoing && styles.headerActionButtonDisabled]}
                onPress={handleUndo}
                activeOpacity={0.8}
                disabled={isUndoing}
              >
                <Ionicons name="arrow-undo" size={20} color="#D6E4FF" />
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.headerActionButton} onPress={() => setShowStats(true)} activeOpacity={0.7}>
              <Ionicons name="stats-chart" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

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
                style={[styles.categoryTab, selectedCategory === cat && styles.categoryTabActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryTabText, selectedCategory === cat && styles.categoryTabTextActive]}>
                  {cat === 'all' ? 'Tümü' : cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={[styles.cardArea, !hasQuestions && styles.cardAreaEmpty]}>
          {!hasQuestions ? (
            <View style={styles.emptyStateWrapper}>
              <RaceEmptyState
                onExplore={onClose}
                onResetFilter={() => setSelectedCategory('all')}
                categoryName={selectedCategory === 'all' ? undefined : selectedCategory}
              />
            </View>
          ) : (
            <>
              {displayedNextQuestion && (
                <Animated.View style={[styles.cardContainer, styles.nextCard, nextCardAnimatedStyle]}>
                  {renderQuestionCard(displayedNextQuestion, false)}
                </Animated.View>
              )}

              {currentQuestion && (
                <GestureDetector gesture={panGesture}>
                  <Animated.View style={[styles.cardContainer, cardAnimatedStyle]}>
                    {renderQuestionCard(currentQuestion, true)}
                  </Animated.View>
                </GestureDetector>
              )}
            </>
          )}
        </View>

        {hasQuestions && (
          <View style={[styles.remainingContainer, { bottom: Math.max(insets.bottom + 12, 24) }]}>
            <Ionicons name="layers-outline" size={15} color="rgba(255,255,255,0.74)" />
            <Text style={styles.remainingText}>{remainingQuestions} soru kaldı</Text>
          </View>
        )}

        <RaceStats visible={showStats} league={league} onClose={() => setShowStats(false)} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  card: {
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 28,
    borderWidth: 1,
    elevation: 10,
    flex: 1,
    justifyContent: 'space-between',
    overflow: 'hidden',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  cardArea: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    paddingBottom: 8,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  cardAreaEmpty: {
    justifyContent: 'center',
    paddingBottom: 48,
    paddingTop: 0,
  },
  cardContainer: {
    height: SCREEN_HEIGHT * 0.55,
    position: 'absolute',
    top: 20,
    width: SCREEN_WIDTH - 40,
  },
  cardImage: {
    borderRadius: 28,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 28,
  },
  categoryBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryTab: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  categoryTabActive: {
    backgroundColor: 'rgba(37,110,255,0.2)',
    borderColor: PRIMARY_BLUE,
  },
  categoryTabs: {
    marginBottom: 8,
    maxHeight: 50,
  },
  categoryTabsContent: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  categoryTabText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  container: {
    backgroundColor: '#0D1117',
    flex: 1,
  },
  emptyStateWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -56,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  headerActionButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  headerActionButtonDisabled: {
    opacity: 0.45,
  },
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  hintItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  hintsContainer: {
    backgroundColor: 'rgba(13,17,23,0.48)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  hintText: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    fontWeight: '700',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: PRIMARY_BLUE,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  nextCard: {
    zIndex: 0,
  },
  noOverlay: {
    backgroundColor: 'rgba(239, 68, 68, 0.28)',
    borderColor: NEGATIVE_RED,
    borderWidth: 4,
  },
  oddsBox: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 16,
  },
  oddsContainer: {
    backgroundColor: 'rgba(13,17,23,0.5)',
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  oddsDivider: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: 1,
  },
  oddsLabel: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  oddsValue: {
    fontSize: 24,
    fontWeight: '900',
  },
  overlayContent: {
    alignItems: 'center',
  },
  overlayOdds: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { height: 2, width: 0 },
    textShadowRadius: 10,
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 36,
    textAlign: 'center',
  },
  remainingContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.11)',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: 'absolute',
  },
  remainingText: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    fontWeight: '700',
  },
  safeArea: {
    flex: 1,
  },
  skipOverlay: {
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
    borderColor: '#9CA3AF',
    borderWidth: 3,
  },
  voteOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    borderRadius: 28,
    justifyContent: 'center',
    zIndex: 10,
  },
  yesOverlay: {
    backgroundColor: 'rgba(16, 185, 129, 0.28)',
    borderColor: YES_GREEN,
    borderWidth: 4,
  },
});
