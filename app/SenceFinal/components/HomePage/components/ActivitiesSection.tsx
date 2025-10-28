import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActivitiesSectionProps {
  isDarkMode: boolean;
  theme: any;
  onChallengePress: () => void;
  onTasksPress: () => void;
  onWriteQuestionPress: () => void;
}

export function ActivitiesSection({ 
  isDarkMode, 
  theme, 
  onChallengePress, 
  onTasksPress,
  onWriteQuestionPress
}: ActivitiesSectionProps) {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // Button animation refs
  const button1Anim = useRef(new Animated.Value(1)).current;
  const button2Anim = useRef(new Animated.Value(1)).current;
  const button3Anim = useRef(new Animated.Value(1)).current;
  
  // Icon animation refs
  const icon1Anim = useRef(new Animated.Value(1)).current;
  const icon2Anim = useRef(new Animated.Value(1)).current;
  const icon3Anim = useRef(new Animated.Value(1)).current;
  
  // Additional micro animation refs
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation (fade + scale only)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous micro animations
    const createPulseAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1.1,
            duration: 2000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start smooth pulse animations for icons
    setTimeout(() => {
      createPulseAnimation(icon1Anim, 0).start();
      createPulseAnimation(icon2Anim, 1000).start();
      createPulseAnimation(icon3Anim, 2000).start();
    }, 1000);

    // Shimmer effect
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();

    // Smooth rotation animation for icons
    const createRotationAnimation = (iconAnim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(iconAnim, {
            toValue: 1.15,
            duration: 3000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(iconAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      );
    };
    
    setTimeout(() => {
      createRotationAnimation(icon1Anim, 0).start();
      createRotationAnimation(icon2Anim, 1000).start();
      createRotationAnimation(icon3Anim, 2000).start();
    }, 2000);

    // Smooth rotation animation - biraz dönüp geri dönüp diğer tarafa dönüp tekrar başlasın
    const createSmoothRotation = () => {
      return Animated.loop(
        Animated.sequence([
          // Sağa dön (15 derece)
          Animated.timing(rotateAnim, {
            toValue: 0.25,
            duration: 2000,
            useNativeDriver: true,
          }),
          // Geri dön (0 derece)
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
          // Sola dön (-15 derece)
          Animated.timing(rotateAnim, {
            toValue: -0.25,
            duration: 2000,
            useNativeDriver: true,
          }),
          // Geri dön (0 derece)
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
          // Bekle
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
    };
    
    setTimeout(() => createSmoothRotation().start(), 3000);

    // Glow animation
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    setTimeout(() => glowAnimation.start(), 4000);
  }, []);

  const handleButtonPress = (buttonAnim: Animated.Value, callback: () => void) => {
    Animated.sequence([
      Animated.timing(buttonAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    callback();
  };

  return (
    <Animated.View 
      style={[
        styles.section, 
        { 
          backgroundColor: isDarkMode ? theme.surface : '#FFFFFF',
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Günlük Aktiviteler</Text>
      </View>
      <View style={styles.buttons}>
        <Animated.View style={[
          styles.buttonContainer, 
          { 
            transform: [{ scale: button1Anim }],
            opacity: shimmerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.8]
            })
          }
        ]}>
          <TouchableOpacity 
            style={[
              styles.button,
              { 
                backgroundColor: isDarkMode ? theme.surfaceCard : '#F1F3F4', 
                borderColor: '#7C3AED', 
                borderWidth: 2,
                shadowColor: isDarkMode ? 'transparent' : '#000',
                shadowOpacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.04, 0.12]
                })
              }
            ]}
            onPress={() => handleButtonPress(button1Anim, onChallengePress)}
            activeOpacity={0.7}
          >
            <Animated.View style={[
              styles.iconWrapper, 
              { 
                transform: [
                  { scale: icon1Anim },
                  { 
                    rotate: rotateAnim.interpolate({
                      inputRange: [-0.25, 0, 0.25],
                      outputRange: ['-15deg', '0deg', '15deg']
                    })
                  }
                ]
              }
            ]}>
              <Ionicons name="flash" size={30} color="#7C3AED" />
            </Animated.View>
            <Text style={[styles.buttonTitle, styles.challengeTitle]}>Zip</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={[
          styles.buttonContainer, 
          { 
            transform: [{ scale: button2Anim }],
            opacity: shimmerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.8]
            })
          }
        ]}>
          <TouchableOpacity 
            style={[
              styles.button,
              { 
                backgroundColor: isDarkMode ? theme.surfaceCard : '#F1F3F4', 
                borderColor: '#F97316', 
                borderWidth: 2,
                shadowColor: isDarkMode ? 'transparent' : '#000',
                shadowOpacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.04, 0.12]
                })
              }
            ]}
            onPress={() => handleButtonPress(button2Anim, onTasksPress)}
            activeOpacity={0.7}
          >
            <Animated.View style={[
              styles.iconWrapper, 
              { 
                transform: [
                  { scale: icon2Anim },
                  { 
                    rotate: rotateAnim.interpolate({
                      inputRange: [-0.25, 0, 0.25],
                      outputRange: ['-15deg', '0deg', '15deg']
                    })
                  }
                ]
              }
            ]}>
              <Ionicons name="checkmark-done" size={30} color="#F97316" />
            </Animated.View>
            <Text style={[styles.buttonTitle, styles.tasksTitle]}>Görevler</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={[
          styles.buttonContainer, 
          { 
            transform: [{ scale: button3Anim }],
            opacity: shimmerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.8]
            })
          }
        ]}>
          <TouchableOpacity 
            style={[
              styles.button,
              { 
                backgroundColor: isDarkMode ? theme.surfaceCard : '#F1F3F4', 
                borderColor: '#059669', 
                borderWidth: 2,
                shadowColor: isDarkMode ? 'transparent' : '#000',
                shadowOpacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.04, 0.12]
                })
              }
            ]}
            onPress={() => handleButtonPress(button3Anim, onWriteQuestionPress)}
            activeOpacity={0.7}
          >
            <Animated.View style={[
              styles.iconWrapper, 
              { 
                transform: [
                  { scale: icon3Anim },
                  { 
                    rotate: rotateAnim.interpolate({
                      inputRange: [-0.25, 0, 0.25],
                      outputRange: ['-15deg', '0deg', '15deg']
                    })
                  }
                ]
              }
            ]}>
              <Ionicons name="color-wand" size={30} color="#059669" />
            </Animated.View>
            <Text style={[styles.buttonTitle, styles.writeTitle]}>Soru Yaz</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    marginVertical: 8,
    borderRadius: 12,
    marginHorizontal: 8,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#432870',
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    flex: 1,
    minHeight: 60,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F3F4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrapper: {
    marginBottom: 6,
  },
  buttonTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  challengeTitle: { color: '#7C3AED' },
  tasksTitle: { color: '#F97316' },
  writeTitle: { color: '#059669' },
});








