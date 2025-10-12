import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withSequence,
  withRepeat
} from 'react-native-reanimated';

interface DailyChallengeLandingProps {
  onStartTrivia: () => void;
  onSkipTrivia: () => void;
  onBack: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function DailyChallengeLanding({ onStartTrivia, onSkipTrivia, onBack }: DailyChallengeLandingProps) {
  const [multiplierDemo] = useState(1.0);

  const mainIconScale = useSharedValue(1);
  const mainIconRotation = useSharedValue(0);
  const floatingIcon1Y = useSharedValue(-5);
  const floatingIcon2Y = useSharedValue(5);
  const progressWidth = useSharedValue(0);

  React.useEffect(() => {
    // Main icon animation
    mainIconRotation.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 1500 }),
        withTiming(-10, { duration: 1500 }),
        withTiming(0, { duration: 1500 })
      ),
      -1,
      false
    );

    mainIconScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      false
    );

    // Floating icons
    floatingIcon1Y.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 1000 }),
        withTiming(-5, { duration: 1000 })
      ),
      -1,
      false
    );

    floatingIcon2Y.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1000 }),
        withTiming(5, { duration: 1000 })
      ),
      -1,
      false
    );

    // Progress animation
    setTimeout(() => {
      progressWidth.value = withTiming(10, { duration: 1000 });
    }, 1000);
  }, []);

  const mainIconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${mainIconRotation.value}deg` },
      { scale: mainIconScale.value }
    ],
  }));

  const floatingIcon1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatingIcon1Y.value }],
  }));

  const floatingIcon2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatingIcon2Y.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F3F5" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Günün Challenge'ı</Text>
            <Text style={styles.headerSubtitle}>Günlük Görev • Ekstra Ödüller</Text>
          </View>

          <View style={styles.spacer} />
        </View>

        {/* Hero Illustration */}
        <View style={styles.heroSection}>
          <View style={styles.heroContainer}>
            {/* Main Icon */}
            <Animated.View style={[styles.mainIconContainer, mainIconAnimatedStyle]}>
              <LinearGradient
                colors={['#432870', '#5A3A8B', '#B29EFD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mainIconGradient}
              >
                <Text style={styles.mainIconText}>⚡</Text>
              </LinearGradient>
            </Animated.View>
            
            {/* Floating Elements */}
            <Animated.View style={[styles.floatingIcon1, floatingIcon1AnimatedStyle]}>
              <View style={styles.floatingIconContainer}>
                <Text style={styles.floatingIconText}>🧠</Text>
              </View>
            </Animated.View>
            
            <Animated.View style={[styles.floatingIcon2, floatingIcon2AnimatedStyle]}>
              <View style={styles.floatingIconContainer}>
                <Text style={styles.floatingIconText}>🎯</Text>
              </View>
            </Animated.View>

            <Text style={styles.heroTitle}>Günün Challenge'ı</Text>
            <Text style={styles.heroDescription}>
              Trivia ile çarpanını artır, swipe ile tahmin yap, ekstra ödüller kazan!
            </Text>
          </View>
        </View>

        {/* How it Works */}
        <View style={styles.howItWorksSection}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🎮</Text>
              <Text style={styles.cardTitle}>Nasıl Çalışır?</Text>
            </View>
            
            <View style={styles.stepsList}>
              {/* Step 1 */}
              <View style={styles.stepItem}>
                <LinearGradient
                  colors={['#C9F158', '#B29EFD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.stepNumber}
                >
                  <Text style={styles.stepNumberText}>1</Text>
                </LinearGradient>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Trivia Oyna</Text>
                  <Text style={styles.stepDescription}>30 saniyede maksimum soru çöz, çarpanını artır</Text>
                </View>
                <Text style={styles.stepValue}>2.5x</Text>
              </View>

              {/* Step 2 */}
              <View style={styles.stepItem}>
                <LinearGradient
                  colors={['#432870', '#B29EFD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.stepNumber}
                >
                  <Text style={styles.stepNumberText}>2</Text>
                </LinearGradient>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Swipe ile Tahmin</Text>
                  <Text style={styles.stepDescription}>6 karttan 5 tanesini seçerek kuponunu oluştur</Text>
                </View>
                <Text style={styles.stepValue}>5/6</Text>
              </View>

              {/* Step 3 */}
              <View style={styles.stepItem}>
                <LinearGradient
                  colors={['#B29EFD', '#432870']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.stepNumber}
                >
                  <Text style={styles.stepNumberText}>3</Text>
                </LinearGradient>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Ekstra Kazan</Text>
                  <Text style={styles.stepDescription}>Trivia çarpanın ile daha fazla ödül al</Text>
                </View>
                <Text style={styles.stepValue}>🚀</Text>
              </View>
            </View>
          </View>

          {/* Multiplier Preview */}
          <View style={styles.multiplierPreview}>
            <View style={styles.multiplierContent}>
              <View>
                <Text style={styles.multiplierTitle}>Çarpan Önizlemesi</Text>
                <Text style={styles.multiplierSubtitle}>Trivia performansına göre</Text>
              </View>
              <View style={styles.multiplierRight}>
                <Text style={styles.multiplierValue}>{multiplierDemo.toFixed(1)}x</Text>
                <Text style={styles.multiplierLabel}>Başlangıç</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {/* Main CTA - Start Trivia */}
          <AnimatedTouchableOpacity
            onPress={onStartTrivia}
            style={styles.primaryButton}
          >
            <LinearGradient
              colors={['#432870', '#5A3A8B', '#B29EFD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButtonGradient}
            >
              <View style={styles.primaryButtonContent}>
                <Text style={styles.primaryButtonIcon}>🧠</Text>
                <Text style={styles.primaryButtonText}>Trivia ile Başla</Text>
                <View style={styles.primaryButtonBadge}>
                  <Text style={styles.primaryButtonBadgeText}>3.0x'e kadar</Text>
                </View>
              </View>
            </LinearGradient>
          </AnimatedTouchableOpacity>

          {/* Secondary CTA - Skip Trivia */}
          <TouchableOpacity
            onPress={onSkipTrivia}
            style={styles.secondaryButton}
          >
            <View style={styles.secondaryButtonContent}>
              <Text style={styles.secondaryButtonText}>Trivia'yı Geç</Text>
              <View style={styles.secondaryButtonBadge}>
                <Text style={styles.secondaryButtonBadgeText}>1.0x çarpan</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#F2F3F5',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#432870',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#432870',
    fontWeight: 'bold',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#202020',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#432870',
    marginTop: 4,
  },
  spacer: {
    width: 48,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
  },
  heroContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  mainIconContainer: {
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
  mainIconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainIconText: {
    fontSize: 48,
    color: '#FFFFFF',
  },
  floatingIcon1: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  floatingIcon2: {
    position: 'absolute',
    bottom: -8,
    left: -8,
  },
  floatingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#C9F158',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingIconText: {
    fontSize: 18,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 18,
    color: 'rgba(32, 32, 32, 0.7)',
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 280,
  },
  howItWorksSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#432870',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  stepValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#432870',
  },
  multiplierPreview: {
    backgroundColor: 'rgba(67, 40, 112, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  multiplierContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  multiplierTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#432870',
  },
  multiplierSubtitle: {
    fontSize: 14,
    color: 'rgba(67, 40, 112, 0.7)',
  },
  multiplierRight: {
    alignItems: 'flex-end',
  },
  multiplierValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#432870',
  },
  multiplierLabel: {
    fontSize: 12,
    color: 'rgba(67, 40, 112, 0.6)',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#F2F3F5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#432870',
    borderRadius: 4,
  },
  actionButtons: {
    paddingHorizontal: 20,
    gap: 16,
  },
  primaryButton: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#432870',
    shadowOffset: {
      width: 0,
      height: 25,
    },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 25,
  },
  primaryButtonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  primaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  primaryButtonIcon: {
    fontSize: 24,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  primaryButtonBadge: {
    backgroundColor: '#C9F158',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  primaryButtonBadgeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#432870',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: 'rgba(67, 40, 112, 0.2)',
  },
  secondaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#432870',
  },
  secondaryButtonBadge: {
    backgroundColor: '#F2F3F5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  secondaryButtonBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(67, 40, 112, 0.7)',
  },
  bottomSpacing: {
    height: 32,
  },
});
