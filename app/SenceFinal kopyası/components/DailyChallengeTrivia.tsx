import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withSequence
} from 'react-native-reanimated';
import { triviaQuestions, multiplierLevels } from '../constants/dailyChallengeData';

const { width } = Dimensions.get('window');

interface DailyChallengeTriviaProps {
  onComplete: (score: number, multiplier: number) => void;
  onBack: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function DailyChallengeTrivia({ onComplete, onBack }: DailyChallengeTriviaProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<boolean | null>(null);

  // Animation values
  const questionScale = useSharedValue(1);
  const questionOpacity = useSharedValue(1);
  const questionX = useSharedValue(0);
  const trueButtonScale = useSharedValue(1);
  const falseButtonScale = useSharedValue(1);
  const scoreScale = useSharedValue(1);
  const multiplierScale = useSharedValue(1);
  const progressWidth = useSharedValue(0);

  // Initialize questions
  useEffect(() => {
    const shuffled = [...triviaQuestions].sort(() => Math.random() - 0.5);
    setSelectedQuestions(shuffled.slice(0, 20));
    setIsActive(true);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsActive(false);
          setShowResult(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // Update progress animation
  useEffect(() => {
    if (selectedQuestions.length > 0) {
      const progress = ((currentQuestionIndex + 1) / selectedQuestions.length) * 100;
      progressWidth.value = withTiming(progress, { duration: 300 });
    }
  }, [currentQuestionIndex, selectedQuestions.length]);

  const handleAnswer = (selectedAnswer: boolean) => {
    if (!isActive || selectedQuestions.length === 0 || isProcessing) return;

    setIsProcessing(true);
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.answer;

    setUserAnswer(selectedAnswer);
    setCorrectAnswer(currentQuestion.answer);
    setShowFeedback(isCorrect ? 'correct' : 'incorrect');

    // Animate feedback
    if (selectedAnswer) {
      trueButtonScale.value = withSequence(
        withSpring(1.1, { duration: 200 }),
        withSpring(1, { duration: 200 })
      );
    } else {
      falseButtonScale.value = withSequence(
        withSpring(1.1, { duration: 200 }),
        withSpring(1, { duration: 200 })
      );
    }

    if (isCorrect) {
      setCorrectAnswers(prev => {
        const newScore = prev + 1;
        scoreScale.value = withSequence(
          withSpring(1.3, { duration: 300 }),
          withSpring(1, { duration: 300 })
        );
        return newScore;
      });
      multiplierScale.value = withSequence(
        withSpring(1.2, { duration: 300 }),
        withSpring(1, { duration: 300 })
      );
    }

    // Show feedback then proceed
    const timer = setTimeout(() => {
      setShowFeedback(null);
      setUserAnswer(null);
      setCorrectAnswer(null);
      
      if (currentQuestionIndex < selectedQuestions.length - 1) {
        // Move to next question
        setCurrentQuestionIndex(prev => prev + 1);
        setIsProcessing(false);
      } else {
        // All questions answered
        setIsActive(false);
        setShowResult(true);
        setIsProcessing(false);
      }
    }, 1200);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  };

  const getMultiplier = () => {
    const validLevels = multiplierLevels.filter((l: any) => l.correctAnswers <= correctAnswers);
    return validLevels[validLevels.length - 1]?.multiplier || 1.0;
  };

  const getMultiplierLabel = () => {
    const validLevels = multiplierLevels.filter((l: any) => l.correctAnswers <= correctAnswers);
    return validLevels[validLevels.length - 1]?.label || 'Başlangıç';
  };

  const handleContinue = () => {
    const finalMultiplier = getMultiplier();
    onComplete(correctAnswers, finalMultiplier);
  };

  const questionAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: questionScale.value },
      { translateX: questionX.value }
    ],
    opacity: questionOpacity.value,
  }));

  const trueButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trueButtonScale.value }],
  }));

  const falseButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: falseButtonScale.value }],
  }));

  const scoreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
  }));

  const multiplierAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: multiplierScale.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  if (showResult) {
    return (
      <View style={styles.resultContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#432870" translucent />
        
        <LinearGradient
          colors={['#432870', '#5A3A8B', '#B29EFD']}
          style={styles.resultGradient}
        >
          <View style={styles.resultContent}>
            {/* Result Icon */}
            <View style={styles.resultIconContainer}>
              <LinearGradient
                colors={['#C9F158', '#B29EFD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.resultIconGradient}
              >
                <Text style={styles.resultIcon}>🧠</Text>
              </LinearGradient>
            </View>

            <Text style={styles.resultTitle}>Trivia Tamamlandı!</Text>
            <Text style={styles.resultScore}>
              {correctAnswers}/{selectedQuestions.length} doğru cevap
            </Text>

            {/* Score Breakdown */}
            <View style={styles.scoreBreakdown}>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Çarpan Seviyesi</Text>
                <Text style={styles.scoreValue}>{getMultiplierLabel()}</Text>
              </View>

              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Ödül Çarpanı</Text>
                <Text style={styles.multiplierText}>{getMultiplier()}x</Text>
              </View>

              {/* Progress Bar */}
              <View style={styles.resultProgressContainer}>
                <View style={styles.resultProgressBackground}>
                  <Animated.View style={[styles.resultProgressFill, progressAnimatedStyle]} />
                </View>
              </View>
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              onPress={handleContinue}
              style={styles.continueButton}
            >
              <LinearGradient
                colors={['#432870', '#5A3A8B', '#B29EFD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueButtonGradient}
              >
                <View style={styles.continueButtonContent}>
                  <Text style={styles.continueButtonIcon}>🔥</Text>
                  <Text style={styles.continueButtonText}>Swipe Aşamasına Geç!</Text>
                  <View style={styles.continueButtonBadge}>
                    <Text style={styles.continueButtonBadgeText}>{getMultiplier()}x</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (selectedQuestions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#432870" translucent />
        <LinearGradient
          colors={['#432870', '#5A3A8B', '#B29EFD']}
          style={styles.loadingGradient}
        >
          <View style={styles.loadingContent}>
            <View style={styles.loadingSpinner} />
            <Text style={styles.loadingText}>Sorular yükleniyor...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  const currentQuestion = selectedQuestions[currentQuestionIndex];
  const circumference = 2 * Math.PI * 28;
  const strokeDashoffset = circumference * (1 - timeLeft / 30);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#432870" translucent />
      
      <LinearGradient
        colors={['#432870', '#5A3A8B', '#B29EFD']}
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

          {/* Timer */}
          <View style={styles.timerContainer}>
            <Svg width={64} height={64} style={styles.timerSvg}>
              <Circle
                cx="32"
                cy="32"
                r="28"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="4"
                fill="none"
              />
              <Circle
                cx="32"
                cy="32"
                r="28"
                stroke="#C9F158"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 32 32)"
              />
            </Svg>
            <View style={styles.timerText}>
              <Text style={styles.timerNumber}>{timeLeft}</Text>
            </View>
          </View>

          <Animated.View style={[styles.scoreContainer, scoreAnimatedStyle]}>
            <Text style={styles.scoreNumber}>{correctAnswers}</Text>
            <Text style={styles.scoreLabel}>doğru</Text>
          </Animated.View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
          </View>
          <Text style={styles.progressText}>
            Soru {currentQuestionIndex + 1} / {selectedQuestions.length}
          </Text>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Animated.View style={[styles.questionContent, questionAnimatedStyle]}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            <Text style={styles.categoryText}>{currentQuestion.category.toUpperCase()}</Text>
          </Animated.View>
        </View>

        {/* Answer Buttons */}
        <View style={styles.answerButtons}>
          {/* TRUE Button */}
          <AnimatedTouchableOpacity
            onPress={() => handleAnswer(true)}
            style={[styles.answerButton, trueButtonAnimatedStyle]}
            disabled={!isActive || isProcessing}
          >
            <LinearGradient
              colors={['#34C759', '#28A745']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.answerButtonGradient,
                showFeedback && userAnswer === true && showFeedback === 'correct' && styles.correctAnswer,
                showFeedback && correctAnswer === true && userAnswer === false && styles.showCorrect
              ]}
            >
              <Text style={styles.answerIcon}>✓</Text>
              <Text style={styles.answerText}>DOĞRU</Text>
            </LinearGradient>
          </AnimatedTouchableOpacity>

          {/* FALSE Button */}
          <AnimatedTouchableOpacity
            onPress={() => handleAnswer(false)}
            style={[styles.answerButton, falseButtonAnimatedStyle]}
            disabled={!isActive || isProcessing}
          >
            <LinearGradient
              colors={['#FF3B30', '#DC3545']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.answerButtonGradient,
                showFeedback && userAnswer === false && showFeedback === 'correct' && styles.correctAnswer,
                showFeedback && correctAnswer === false && userAnswer === true && styles.showCorrect
              ]}
            >
              <Text style={styles.answerIcon}>✗</Text>
              <Text style={styles.answerText}>YANLIŞ</Text>
            </LinearGradient>
          </AnimatedTouchableOpacity>
        </View>

        {/* Multiplier Preview */}
        <Animated.View style={[styles.multiplierPreview, multiplierAnimatedStyle]}>
          <View style={styles.multiplierContent}>
            <Text style={styles.multiplierLabel}>Mevcut Çarpan</Text>
            <Text style={styles.multiplierValue}>{getMultiplier()}x</Text>
            {showFeedback === 'correct' && (
              <Text style={styles.bonusText}>+0.1x bonus! 🎯</Text>
            )}
          </View>
        </Animated.View>
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
  timerContainer: {
    position: 'relative',
    width: 64,
    height: 64,
  },
  timerSvg: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
  },
  timerText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#C9F158',
  },
  scoreLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  progressBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#C9F158',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  questionContent: {
    alignItems: 'center',
  },
  questionText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#C9F158',
  },
  answerButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 24,
  },
  answerButton: {
    flex: 1,
    borderRadius: 24,
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
  answerButtonGradient: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  correctAnswer: {
    shadowColor: '#C9F158',
    shadowOpacity: 0.5,
  },
  showCorrect: {
    borderWidth: 4,
    borderColor: '#C9F158',
  },
  answerIcon: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  answerText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  multiplierPreview: {
    marginHorizontal: 20,
    marginBottom: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  multiplierContent: {
    alignItems: 'center',
  },
  multiplierLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  multiplierValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#C9F158',
  },
  bonusText: {
    fontSize: 12,
    color: '#C9F158',
    marginTop: 4,
  },
  // Result Screen Styles
  resultContainer: {
    flex: 1,
  },
  resultGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  resultContent: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  resultIconContainer: {
    width: 96,
    height: 96,
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
  resultIconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultIcon: {
    fontSize: 40,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  resultScore: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 24,
  },
  scoreBreakdown: {
    backgroundColor: 'rgba(242, 243, 245, 0.1)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    marginBottom: 24,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  multiplierText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  resultProgressContainer: {
    marginTop: 16,
  },
  resultProgressBackground: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  resultProgressFill: {
    height: '100%',
    backgroundColor: '#C9F158',
    borderRadius: 6,
  },
  continueButton: {
    borderRadius: 24,
    overflow: 'hidden',
    width: '100%',
    shadowColor: '#432870',
    shadowOffset: {
      width: 0,
      height: 25,
    },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 25,
  },
  continueButtonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  continueButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  continueButtonIcon: {
    fontSize: 24,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  continueButtonBadge: {
    backgroundColor: '#C9F158',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  continueButtonBadgeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#432870',
  },
  // Loading Screen Styles
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: '#FFFFFF',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
