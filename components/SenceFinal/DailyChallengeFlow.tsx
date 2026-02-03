import React, { useState } from 'react';
import { View, StyleSheet, Modal, AsyncStorage } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
  withSequence
} from 'react-native-reanimated';
import { DailyChallengeOnboarding } from './DailyChallengeOnboarding';
import { DailyChallengeLanding } from './DailyChallengeLanding';
import { DailyChallengeTrivia } from './DailyChallengeTrivia';
import { DailyChallengeSwipeDeck } from './DailyChallengeSwipeDeck';
import { DailyChallengeCouponConfirm } from './DailyChallengeCouponConfirm';
import { DailyChallengeResults } from './DailyChallengeResults';

interface DailyChallengeFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

type FlowStep = 
  | 'onboarding'
  | 'landing'
  | 'trivia'
  | 'swipe'
  | 'confirm'
  | 'success'
  | 'results';

interface ChallengeState {
  triviaScore: number;
  triviaMultiplier: number;
  selections: any[];
  stake: number;
  isFirstTime: boolean;
}

export function DailyChallengeFlow({ isOpen, onClose, onComplete }: DailyChallengeFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('onboarding');
  const [challengeState, setChallengeState] = useState<ChallengeState>({
    triviaScore: 0,
    triviaMultiplier: 1.0,
    selections: [],
    stake: 50,
    isFirstTime: true
  });
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Animation values
  const successScale = useSharedValue(0.9);
  const successOpacity = useSharedValue(0);
  const confettiOpacity = useSharedValue(0.3);

  React.useEffect(() => {
    // Check if user has seen onboarding before
    checkOnboardingStatus();
  }, []);

  React.useEffect(() => {
    if (isOpen && hasSeenOnboarding) {
      setCurrentStep('landing');
    } else if (isOpen && !hasSeenOnboarding) {
      setCurrentStep('onboarding');
    }
  }, [isOpen, hasSeenOnboarding]);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingSeen = await AsyncStorage.getItem('daily_challenge_onboarding');
      setHasSeenOnboarding(onboardingSeen === 'true');
    } catch (error) {
      console.log('Error checking onboarding status:', error);
      setHasSeenOnboarding(false);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('daily_challenge_onboarding', 'true');
      setHasSeenOnboarding(true);
      setCurrentStep('landing');
    } catch (error) {
      console.log('Error saving onboarding status:', error);
      setCurrentStep('landing');
    }
  };

  const handleStartTrivia = () => {
    setCurrentStep('trivia');
  };

  const handleSkipTrivia = () => {
    setChallengeState(prev => ({ ...prev, triviaMultiplier: 1.0, triviaScore: 0 }));
    setCurrentStep('swipe');
  };

  const handleTriviaComplete = (score: number, multiplier: number) => {
    setChallengeState(prev => ({ ...prev, triviaScore: score, triviaMultiplier: multiplier }));
    setCurrentStep('swipe');
  };

  const handleSwipeComplete = (selections: any[]) => {
    setChallengeState(prev => ({ ...prev, selections }));
    setCurrentStep('confirm');
  };

  const handleCouponConfirm = (stake: number) => {
    setChallengeState(prev => ({ ...prev, stake }));
    setCurrentStep('success');

    // Animate success screen
    successScale.value = withSpring(1, { damping: 25, stiffness: 300 });
    successOpacity.value = withTiming(1, { duration: 400 });
    
    // Animate confetti
    confettiOpacity.value = withSequence(
      withTiming(1, { duration: 500 }),
      withTiming(0.3, { duration: 500 })
    );

    // Auto-navigate to results after celebration
    setTimeout(() => {
      setCurrentStep('results');
    }, 3000);
  };

  const handleResultsClose = () => {
    onClose();
    if (onComplete) {
      onComplete();
    }
  };

  const handleBackToStep = (step: FlowStep) => {
    setCurrentStep(step);
  };

  const successAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
    opacity: successOpacity.value,
  }));

  const confettiAnimatedStyle = useAnimatedStyle(() => ({
    opacity: confettiOpacity.value,
  }));

  if (!isOpen) return null;

  // Mock results data for demo
  const mockResults = {
    selections: challengeState.selections,
    triviaScore: challengeState.triviaScore,
    triviaMultiplier: challengeState.triviaMultiplier,
    stake: challengeState.stake,
    finalWinnings: Math.round(challengeState.stake * 1.8 * challengeState.triviaMultiplier),
    correctPredictions: Math.floor(Math.random() * challengeState.selections.length) + 1,
    totalPredictions: challengeState.selections.length,
    completedDate: new Date().toISOString()
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'onboarding':
        return (
          <DailyChallengeOnboarding
            isOpen={true}
            onClose={onClose}
            onComplete={handleOnboardingComplete}
          />
        );

      case 'landing':
        return (
          <DailyChallengeLanding
            onStartTrivia={handleStartTrivia}
            onSkipTrivia={handleSkipTrivia}
            onBack={onClose}
          />
        );

      case 'trivia':
        return (
          <DailyChallengeTrivia
            onComplete={handleTriviaComplete}
            onBack={() => handleBackToStep('landing')}
          />
        );

      case 'swipe':
        return (
          <DailyChallengeSwipeDeck
            onComplete={handleSwipeComplete}
            onBack={() => handleBackToStep(challengeState.triviaScore > 0 ? 'trivia' : 'landing')}
            triviaMultiplier={challengeState.triviaMultiplier}
          />
        );

      case 'confirm':
        return (
          <DailyChallengeCouponConfirm
            selections={challengeState.selections}
            triviaMultiplier={challengeState.triviaMultiplier}
            onConfirm={handleCouponConfirm}
            onBack={() => handleBackToStep('swipe')}
          />
        );

      case 'success':
        return (
          <View style={styles.successContainer}>
            <LinearGradient
              colors={['#432870', '#5A3A8B', '#B29EFD']}
              style={styles.successGradient}
            >
              <Animated.View style={[styles.successContent, successAnimatedStyle]}>
                {/* Success Icon */}
                <View style={styles.successIcon}>
                  <LinearGradient
                    colors={['#C9F158', '#B29EFD', '#432870']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.successIconGradient}
                  >
                    <Animated.Text 
                      style={[
                        styles.successIconText,
                        {
                          transform: [
                            { 
                              rotate: withSequence(
                                withTiming('10deg', { duration: 1000 }),
                                withTiming('-10deg', { duration: 1000 }),
                                withTiming('0deg', { duration: 1000 })
                              )
                            },
                            { 
                              scale: withSequence(
                                withTiming(1.1, { duration: 1000 }),
                                withTiming(1, { duration: 1000 })
                              )
                            }
                          ]
                        }
                      ]}
                    >
                      🎉
                    </Animated.Text>
                  </LinearGradient>
                </View>
                
                <Animated.Text style={styles.successTitle}>
                  Challenge Tamamlandı!
                </Animated.Text>
                
                <Animated.Text style={styles.successDescription}>
                  Kuponun oluşturuldu! Trivia bonusun ile ekstra ödüller kazanabilirsin. 🚀
                </Animated.Text>

                <View style={styles.successStats}>
                  <View style={styles.successStatRow}>
                    <Animated.Text style={styles.successStatLabel}>Trivia Çarpanı:</Animated.Text>
                    <Animated.Text style={styles.successStatValue}>{challengeState.triviaMultiplier}x</Animated.Text>
                  </View>
                  <View style={styles.successStatRow}>
                    <Animated.Text style={styles.successStatLabel}>Tahmin Sayısı:</Animated.Text>
                    <Animated.Text style={styles.successStatValue}>{challengeState.selections.length}</Animated.Text>
                  </View>
                  <View style={styles.successStatRow}>
                    <Animated.Text style={styles.successStatLabel}>Bahis Tutarı:</Animated.Text>
                    <Animated.Text style={styles.successStatValue}>{challengeState.stake} kredi</Animated.Text>
                  </View>
                </View>
              </Animated.View>

              {/* Confetti Particles */}
              <Animated.View style={[styles.confettiContainer, confettiAnimatedStyle]}>
                {Array.from({ length: 20 }, (_, i) => (
                  <Animated.View
                    key={i}
                    style={[
                      styles.confettiParticle,
                      {
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        transform: [
                          {
                            translateY: withSequence(
                              withTiming(-20, { duration: 1500 }),
                              withTiming(-60, { duration: 1500 })
                            )
                          },
                          {
                            rotate: withSequence(
                              withTiming('0deg', { duration: 1000 }),
                              withTiming('360deg', { duration: 1000 }),
                              withTiming('720deg', { duration: 1000 })
                            )
                          },
                          {
                            scale: withSequence(
                              withTiming(0, { duration: 0 }),
                              withTiming(1, { duration: 500 }),
                              withTiming(0, { duration: 2500 })
                            )
                          }
                        ]
                      }
                    ]}
                  />
                ))}
              </Animated.View>
            </LinearGradient>
          </View>
        );

      case 'results':
        return (
          <DailyChallengeResults
            results={mockResults}
            onClose={handleResultsClose}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
    >
      <View style={styles.container}>
        {renderCurrentStep()}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  successContainer: {
    flex: 1,
  },
  successGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  successContent: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  successIcon: {
    width: 128,
    height: 128,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  successIconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconText: {
    fontSize: 64,
  },
  successTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  successDescription: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 24,
  },
  successStats: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  successStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  successStatLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  successStatValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#C9F158',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  confettiParticle: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#C9F158',
    borderRadius: 4,
  },
});


