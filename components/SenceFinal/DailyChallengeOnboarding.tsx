import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  runOnJS
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface DailyChallengeOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function DailyChallengeOnboarding({ isOpen, onClose, onComplete }: DailyChallengeOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const modalScale = useSharedValue(0.9);
  const modalOpacity = useSharedValue(0);
  const contentX = useSharedValue(20);
  const contentOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const iconRotation = useSharedValue(-180);

  const steps = [
    {
      title: "Trivia Oyna",
      description: "30 saniyede sorular çöz, çarpanını artır!",
      icon: "🧠",
      gradient: ["#C9F158", "#B29EFD"],
      visual: "brain",
      details: [
        "⚡ Hızlı sorular",
        "🎯 Doğru cevap = +0.1x bonus",
        "🔥 Maksimum 3.0x çarpan"
      ],
      story: "Her doğru cevap sonraki aşamada daha fazla ödül kazanmanı sağlar!"
    },
    {
      title: "Swipe & Predict",
      description: "Kartları kaydır, tahmin yap!",
      icon: "🎯",
      gradient: ["#432870", "#B29EFD"],
      visual: "swipe",
      details: [
        "📱 Sağa: EVET",
        "⬅️ Sola: HAYIR",
        "🎫 5 tahmin = 1 kupon"
      ],
      story: "Trivia çarpanın burada devreye giriyor!"
    },
    {
      title: "Ekstra Ödüller",
      description: "Trivia bonusunla daha fazla kazan!",
      icon: "💎",
      gradient: ["#B29EFD", "#C9F158"],
      visual: "rewards",
      details: [
        "💰 Normal ödül + Trivia bonusu",
        "📈 3.0x'e kadar çarpan",
        "🏆 Günlük yarış"
      ],
      story: "Hem normal ödülün hem de trivia bonusun seni bekliyor!"
    }
  ];

  React.useEffect(() => {
    if (isOpen) {
      modalScale.value = withSpring(1, { damping: 25, stiffness: 300 });
      modalOpacity.value = withTiming(1, { duration: 300 });
      animateStepContent();
    } else {
      modalScale.value = withSpring(0.9);
      modalOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      animateStepContent();
    }
  }, [currentStep]);

  const animateStepContent = () => {
    contentX.value = 20;
    contentOpacity.value = 0;
    iconScale.value = 0;
    iconRotation.value = -180;

    contentX.value = withTiming(0, { duration: 300 });
    contentOpacity.value = withTiming(1, { duration: 300 });
    
    setTimeout(() => {
      iconScale.value = withSpring(1, { damping: 15, stiffness: 200 });
      iconRotation.value = withTiming(0, { duration: 300 });
    }, 200);

    // Continuous icon animation for step 1 (swipe)
    if (currentStep === 1) {
      setTimeout(() => {
        iconRotation.value = withRepeat(
          withSequence(
            withTiming(10, { duration: 1500 }),
            withTiming(-10, { duration: 1500 }),
            withTiming(0, { duration: 1500 })
          ),
          -1,
          false
        );
      }, 500);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modalScale.value }],
    opacity: modalOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: contentX.value }],
    opacity: contentOpacity.value,
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotation.value}deg` }
    ],
  }));

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <TouchableOpacity 
          style={styles.backdropTouchable}
          onPress={onClose}
          activeOpacity={1}
        />
        
        <Animated.View style={[styles.modal, modalAnimatedStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Günün Challenge'ı</Text>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              {steps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressBar,
                    index <= currentStep && styles.progressBarActive
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Content */}
          <Animated.View style={[styles.content, contentAnimatedStyle]}>
            {/* Step Visual */}
            <View style={styles.visualSection}>
              <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
                <LinearGradient
                  colors={steps[currentStep].gradient as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconGradient}
                >
                  <Text style={styles.iconText}>{steps[currentStep].icon}</Text>
                </LinearGradient>
              </Animated.View>
              
              <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
              <Text style={styles.stepDescription}>{steps[currentStep].description}</Text>

              {/* Story Text */}
              <LinearGradient
                colors={['rgba(201, 241, 88, 0.2)', 'rgba(178, 158, 253, 0.2)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.storyContainer}
              >
                <Text style={styles.storyText}>💡 {steps[currentStep].story}</Text>
              </LinearGradient>
            </View>

            {/* Step Details */}
            <LinearGradient
              colors={['#F2F3F5', '#EAEAEC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.detailsContainer}
            >
              {steps[currentStep].details.map((detail, index) => (
                <View key={index} style={styles.detailItem}>
                  <LinearGradient
                    colors={['#432870', '#B29EFD']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.detailIcon}
                  >
                    <Text style={styles.detailIconText}>✓</Text>
                  </LinearGradient>
                  <Text style={styles.detailText}>{detail}</Text>
                </View>
              ))}
            </LinearGradient>

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
              {currentStep > 0 && (
                <TouchableOpacity
                  onPress={handlePrevious}
                  style={styles.backButton}
                >
                  <Text style={styles.backButtonText}>Geri</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                onPress={handleNext}
                style={[styles.nextButton, currentStep === 0 && styles.nextButtonFull]}
              >
                <LinearGradient
                  colors={['#432870', '#B29EFD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.nextButtonGradient}
                >
                  <Text style={styles.nextButtonText}>
                    {currentStep === steps.length - 1 ? 'Başlayalım!' : 'Devam'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Bottom Accent */}
          <LinearGradient
            colors={steps[currentStep].gradient as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bottomAccent}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 25,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#202020',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F3F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#202020',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F2F3F5',
    borderRadius: 3,
  },
  progressBarActive: {
    backgroundColor: '#432870',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  visualSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 128,
    height: 128,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 48,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: 'rgba(32, 32, 32, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  storyContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  storyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#432870',
    lineHeight: 20,
  },
  detailsContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailIconText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.8)',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
  },
  nextButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomAccent: {
    height: 4,
  },
});
