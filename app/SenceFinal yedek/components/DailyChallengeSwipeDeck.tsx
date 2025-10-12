import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';
import { challengePredictions } from '../constants/dailyChallengeData';

const { width, height } = Dimensions.get('window');

interface DailyChallengeSwipeDeckProps {
  onComplete: (selections: any[]) => void;
  onBack: () => void;
  triviaMultiplier: number;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function DailyChallengeSwipeDeck({ onComplete, onBack, triviaMultiplier }: DailyChallengeSwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<any[]>([]);
  const [passTokens, setPassTokens] = useState(1);
  
  // Use first 6 predictions for the challenge
  const deckCards = challengePredictions.slice(0, 6);
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const progressWidth = useSharedValue(0);

  React.useEffect(() => {
    const progress = (selections.length / 5) * 100;
    progressWidth.value = withTiming(progress, { duration: 300 });
  }, [selections.length]);

  const handleSwipe = useCallback((vote: 'yes' | 'no') => {
    if (currentIndex >= deckCards.length) return;

    const currentCard = deckCards[currentIndex];
    const newSelection = {
      id: currentCard.id,
      title: currentCard.title,
      vote: vote,
      odds: vote === 'yes' ? currentCard.yesOdds : currentCard.noOdds,
      category: currentCard.category,
      image: currentCard.image
    };

    const newSelections = [...selections, newSelection];
    setSelections(newSelections);
    setCurrentIndex(prev => prev + 1);

    if (newSelections.length === 5) {
      setTimeout(() => {
        onComplete(newSelections);
      }, 500);
    }
  }, [currentIndex, deckCards, selections, onComplete]);

  const handlePass = useCallback(() => {
    if (passTokens <= 0 || currentIndex >= deckCards.length) return;

    setPassTokens(prev => prev - 1);
    setCurrentIndex(prev => prev + 1);
  }, [passTokens, currentIndex, deckCards.length]);

  const handleManualSwipe = useCallback((direction: 'yes' | 'no' | 'pass') => {
    if (direction === 'pass') {
      translateY.value = withTiming(-400, { duration: 300 }, () => {
        runOnJS(handlePass)();
        translateY.value = 0;
      });
    } else if (direction === 'yes') {
      translateX.value = withTiming(400, { duration: 300 }, () => {
        runOnJS(handleSwipe)('yes');
        translateX.value = 0;
      });
    } else {
      translateX.value = withTiming(-400, { duration: 300 }, () => {
        runOnJS(handleSwipe)('no');
        translateX.value = 0;
      });
    }
  }, [handlePass, handleSwipe]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
      scale.value = withSpring(0.95);
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
    },
    onEnd: (event) => {
      const threshold = 100;
      const upThreshold = -80;
      
      scale.value = withSpring(1);
      
      if (Math.abs(event.translationY) > Math.abs(event.translationX) && event.translationY < upThreshold) {
        // Swipe up - Pass
        translateY.value = withTiming(-400, { duration: 300 }, () => {
          runOnJS(handlePass)();
          translateX.value = 0;
          translateY.value = 0;
        });
      } else if (event.translationX > threshold) {
        // Swipe right - Yes
        translateX.value = withTiming(400, { duration: 300 }, () => {
          runOnJS(handleSwipe)('yes');
          translateX.value = 0;
          translateY.value = 0;
        });
      } else if (event.translationX < -threshold) {
        // Swipe left - No
        translateX.value = withTiming(-400, { duration: 300 }, () => {
          runOnJS(handleSwipe)('no');
          translateX.value = 0;
          translateY.value = 0;
        });
      } else {
        // Reset position
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-width, width],
      [-25, 25],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, width * 0.8],
      [1, 0.3],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation}deg` },
        { scale: scale.value }
      ],
      opacity,
    };
  });

  const yesIndicatorStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, 100], [0, 1], Extrapolate.CLAMP),
  }));

  const noIndicatorStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-100, 0], [1, 0], Extrapolate.CLAMP),
  }));

  const passIndicatorStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [-80, 0], [1, 0], Extrapolate.CLAMP),
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  if (currentIndex >= deckCards.length && selections.length < 5) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#202020" translucent />
        <LinearGradient
          colors={['#202020', '#2A2A2A', '#1A1A1A']}
          style={styles.errorGradient}
        >
          <View style={styles.errorContent}>
            <View style={styles.errorIcon}>
              <Text style={styles.errorIconText}>😕</Text>
            </View>
            <Text style={styles.errorTitle}>Kartlar Bitti!</Text>
            <Text style={styles.errorDescription}>
              5 tahmin yapman gerekiyor ama sadece {selections.length} seçtin.
            </Text>
            <TouchableOpacity
              onPress={onBack}
              style={styles.errorButton}
            >
              <LinearGradient
                colors={['#432870', '#B29EFD']}
                style={styles.errorButtonGradient}
              >
                <Text style={styles.errorButtonText}>Tekrar Dene</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (currentIndex >= deckCards.length || selections.length >= 5) return null;

  const currentCard = deckCards[currentIndex];
  const nextCard = currentIndex + 1 < deckCards.length ? deckCards[currentIndex + 1] : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#202020" translucent />
      
      <LinearGradient
        colors={['#202020', '#2A2A2A', '#1A1A1A']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Swipe & Predict</Text>
            <Text style={styles.headerSubtitle}>
              {selections.length}/5 seçildi • {triviaMultiplier}x çarpan bonusu
            </Text>
          </View>

          <View style={styles.passTokenContainer}>
            <Text style={styles.passTokenNumber}>{passTokens}</Text>
            <Text style={styles.passTokenLabel}>geçme</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            {[...Array(5)].map((_, index) => (
              <View key={index} style={styles.progressSegment}>
                <Animated.View 
                  style={[
                    styles.progressSegmentFill, 
                    index < selections.length && styles.progressSegmentActive
                  ]} 
                />
              </View>
            ))}
          </View>
        </View>

        {/* Card Stack */}
        <View style={styles.cardStack}>
          {/* Next Card (Background) */}
          {nextCard && (
            <View style={styles.nextCard}>
              <Image source={{ uri: nextCard.image }} style={styles.cardImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.cardOverlay}
              />
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>{nextCard.title}</Text>
              </View>
            </View>
          )}

          {/* Current Card */}
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.currentCard, cardAnimatedStyle]}>
              {/* Swipe Indicators */}
              <Animated.View style={[styles.yesIndicator, yesIndicatorStyle]}>
                <View style={styles.indicatorContent}>
                  <Text style={styles.indicatorText}>EVET</Text>
                </View>
              </Animated.View>

              <Animated.View style={[styles.noIndicator, noIndicatorStyle]}>
                <View style={styles.indicatorContent}>
                  <Text style={styles.indicatorText}>HAYIR</Text>
                </View>
              </Animated.View>

              <Animated.View style={[styles.passIndicator, passIndicatorStyle]}>
                <View style={styles.passIndicatorContent}>
                  <Text style={styles.passIndicatorText}>GEÇ</Text>
                </View>
              </Animated.View>

              {/* Card Content */}
              <Image source={{ uri: currentCard.image }} style={styles.cardImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.cardOverlay}
              />

              {/* Card Badges - Top */}
              <View style={styles.cardBadges}>
                <View style={styles.leftBadges}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{currentCard.category.toUpperCase()}</Text>
                  </View>
                  {currentCard.trending && (
                    <View style={styles.trendingBadge}>
                      <Text style={styles.trendingText}>🔥 TREND</Text>
                    </View>
                  )}
                </View>
                <View style={styles.timeBadge}>
                  <Text style={styles.timeText}>{currentCard.timeLeft}</Text>
                </View>
              </View>

              {/* Question Title - Center */}
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>{currentCard.title}</Text>
              </View>

              {/* Odds - Bottom */}
              <View style={styles.oddsContainer}>
                <View style={styles.yesOdds}>
                  <Text style={styles.oddsLabel}>EVET</Text>
                  <Text style={styles.oddsValue}>{currentCard.yesOdds}x</Text>
                </View>
                <View style={styles.noOdds}>
                  <Text style={styles.oddsLabel}>HAYIR</Text>
                  <Text style={styles.oddsValue}>{currentCard.noOdds}x</Text>
                </View>
              </View>

              {/* Participants Count */}
              <View style={styles.participantsContainer}>
                <View style={styles.participantsBadge}>
                  <Text style={styles.participantsIcon}>👥</Text>
                  <Text style={styles.participantsText}>{currentCard.participants.toLocaleString()}</Text>
                </View>
              </View>
            </Animated.View>
          </PanGestureHandler>
        </View>

        {/* Action Buttons */}
        <View style={styles.controlsContainer}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => handleManualSwipe('no')}
              style={styles.noButton}
            >
              <LinearGradient
                colors={['#FF3B30', '#DC3545']}
                style={styles.actionButtonGradient}
              >
                <Text style={styles.actionButtonIcon}>✗</Text>
              </LinearGradient>
            </TouchableOpacity>

            {passTokens > 0 && (
              <TouchableOpacity
                onPress={() => handleManualSwipe('pass')}
                style={styles.passButton}
              >
                <LinearGradient
                  colors={['#C9F158', '#B29EFD']}
                  style={styles.passButtonGradient}
                >
                  <Text style={styles.passButtonIcon}>↑</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => handleManualSwipe('yes')}
              style={styles.yesButton}
            >
              <LinearGradient
                colors={['#34C759', '#28A745']}
                style={styles.actionButtonGradient}
              >
                <Text style={styles.actionButtonIcon}>✓</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
              </LinearGradient>
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C9F158',
    marginTop: 4,
  },
  passTokenContainer: {
    alignItems: 'flex-end',
  },
  passTokenNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#C9F158',
  },
  passTokenLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  progressBackground: {
    height: 12,
    flexDirection: 'row',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#C9F158',
    borderRadius: 6,
  },
  progressSegment: {
    flex: 1,
    height: '100%',
    marginHorizontal: 2,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  progressSegmentFill: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
  },
  progressSegmentActive: {
    backgroundColor: '#C9F158',
  },
  cardStack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  nextCard: {
    position: 'absolute',
    width: width - 20,
    height: (width - 20) * 1.25,
    borderRadius: 24,
    backgroundColor: '#2A2A2A',
    transform: [{ scale: 0.95 }],
    opacity: 0.4,
    overflow: 'hidden',
  },
  currentCard: {
    width: width - 20,
    height: (width - 20) * 1.25,
    borderRadius: 24,
    backgroundColor: '#2A2A2A',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardBadges: {
    position: 'absolute',
    top: 24,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  leftBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: '#C9F158',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#432870',
  },
  trendingBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  trendingText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  timeBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardTitleContainer: {
    position: 'absolute',
    top: '50%',
    left: 24,
    right: 24,
    transform: [{ translateY: -30 }],
    zIndex: 10,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  oddsContainer: {
    position: 'absolute',
    bottom: 80,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  yesOdds: {
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  noOdds: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  oddsLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  oddsValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  participantsContainer: {
    position: 'absolute',
    bottom: 24,
    left: '50%',
    transform: [{ translateX: -50 }],
    zIndex: 10,
  },
  participantsBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  participantsIcon: {
    fontSize: 16,
  },
  participantsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Swipe Indicators
  yesIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    borderWidth: 4,
    borderColor: '#34C759',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  noIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    borderWidth: 4,
    borderColor: '#FF3B30',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  passIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(201, 241, 88, 0.2)',
    borderWidth: 4,
    borderColor: '#C9F158',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  indicatorContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  indicatorText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  passIndicatorContent: {
    backgroundColor: '#C9F158',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  passIndicatorText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#432870',
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  noButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: '#FF3B30',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  yesButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: '#34C759',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  passButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#C9F158',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  actionButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonIcon: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  passButtonIcon: {
    fontSize: 28,
    color: '#432870',
    fontWeight: 'bold',
  },
  // Error Screen
  errorContainer: {
    flex: 1,
  },
  errorGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorContent: {
    alignItems: 'center',
  },
  errorIcon: {
    width: 96,
    height: 96,
    backgroundColor: '#FF3B30',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorIconText: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  errorDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  errorButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
