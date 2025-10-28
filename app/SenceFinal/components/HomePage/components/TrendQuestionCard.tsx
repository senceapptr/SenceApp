import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { TrendQuestion } from '../types';
import { formatVotes } from '../utils';

interface TrendQuestionCardProps {
  question: TrendQuestion;
  onQuestionPress: (id: string) => void;
  onVote: (questionId: string, vote: 'yes' | 'no', odds: number) => void;
}


export function TrendQuestionCard({ question, onQuestionPress, onVote }: TrendQuestionCardProps) {
  const noPercentage = 100 - question.yesPercentage;
  
  // Animation values
  const yesBarWidth = useRef(new Animated.Value(0)).current;
  const noBarWidth = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const yesFillAnim = useRef(new Animated.Value(0)).current;
  const noFillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate progress bars
    Animated.sequence([
      Animated.delay(200),
      Animated.timing(yesBarWidth, {
        toValue: question.yesPercentage,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.delay(200),
      Animated.timing(noBarWidth, {
        toValue: noPercentage,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start();
  }, [question.yesPercentage, noPercentage]);

  const handleCardPressIn = () => {
    Animated.spring(cardScale, {
      toValue: 0.97,
      tension: 300, // Daha hızlı animasyon
      friction: 8,  // Daha hızlı animasyon
      useNativeDriver: true,
    }).start();
  };

  const handleCardPressOut = () => {
    Animated.spring(cardScale, {
      toValue: 1,
      tension: 300, // Daha hızlı animasyon
      friction: 8,  // Daha hızlı animasyon
      useNativeDriver: true,
    }).start();
  };

  const handleYesPressIn = () => {
    Animated.timing(yesFillAnim, {
      toValue: 1,
      duration: 50, // Çok daha hızlı animasyon
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  };

  const handleYesPressOut = () => {
    onVote(question.id, 'yes', question.yesOdds); // Önce onVote'u çağır
    Animated.timing(yesFillAnim, {
      toValue: 0,
      duration: 50, // Çok daha hızlı animasyon
      easing: Easing.in(Easing.quad),
      useNativeDriver: false,
    }).start();
  };

  const handleNoPressIn = () => {
    Animated.timing(noFillAnim, {
      toValue: 1,
      duration: 50, // Çok daha hızlı animasyon
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  };

  const handleNoPressOut = () => {
    onVote(question.id, 'no', question.noOdds); // Önce onVote'u çağır
    Animated.timing(noFillAnim, {
      toValue: 0,
      duration: 50, // Çok daha hızlı animasyon
      easing: Easing.in(Easing.quad),
      useNativeDriver: false,
    }).start();
  };

  const yesFillWidth = yesFillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const noFillWidth = noFillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <TouchableOpacity
      onPress={() => onQuestionPress(question.id)}
      onPressIn={handleCardPressIn}
      onPressOut={handleCardPressOut}
      activeOpacity={0.98} // Daha az opacity değişimi
      style={styles.cardContainer}
    >
      <Animated.View 
        style={[
          styles.card,
          {
            transform: [{ scale: cardScale }],
          }
        ]}
      >
        <Image 
          source={{ uri: question.image }}
          style={styles.image}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.2)']}
          style={styles.gradient}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        />
        
        <View style={styles.content}>
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={14} color="rgba(255,255,255,0.9)" />
              <Text style={styles.statText}>{formatVotes(question.votes)}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={14} color="rgba(255,255,255,0.9)" />
              <Text style={styles.statText}>{question.timeLeft}</Text>
            </View>
          </View>

          {/* Question Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{question.title}</Text>
          </View>

          {/* Combined Percentage Bar */}
          <View style={styles.percentageContainer}>
            {/* Percentage Labels */}
            <View style={styles.percentageLabels}>
              <Text style={[styles.percentageLabel, styles.yesLabel]}>
                Yes {question.yesPercentage}%
              </Text>
              <Text style={[styles.percentageLabel, styles.noLabel]}>
                No {noPercentage}%
              </Text>
            </View>
            
            {/* Single Combined Progress Bar */}
            <View style={styles.progressBarContainer}>
              {/* Yes bar from left */}
              <Animated.View 
                style={[
                  styles.progressBar,
                  styles.yesBar,
                  {
                    width: yesBarWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  }
                ]}
              />
              {/* No bar from right */}
              <Animated.View 
                style={[
                  styles.progressBar,
                  styles.noBar,
                  {
                    width: noBarWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  }
                ]}
              />
            </View>
          </View>

          {/* Vote Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => onVote(question.id, 'yes', question.yesOdds)}
              onPressIn={handleYesPressIn}
              onPressOut={handleYesPressOut}
              style={[styles.voteButton, styles.yesButton]}
              activeOpacity={1}
            >
              <Animated.View
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: yesFillWidth,
                  backgroundColor: '#34C759',
                  borderRadius: 14,
                }}
              />
              <Text style={styles.voteButtonText}>Yes</Text>
              <Text style={styles.voteOdds}>{question.yesOdds}x</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onVote(question.id, 'no', question.noOdds)}
              onPressIn={handleNoPressIn}
              onPressOut={handleNoPressOut}
              style={[styles.voteButton, styles.noButton]}
              activeOpacity={1}
            >
              <Animated.View
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: noFillWidth,
                  backgroundColor: '#FF3B30',
                  borderRadius: 14,
                }}
              />
              <Text style={styles.voteButtonText}>No</Text>
              <Text style={styles.voteOdds}>{question.noOdds}x</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 8,
  },
  card: {
    height: 340,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 16,
    gap: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  titleContainer: {
    marginBottom: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 22,
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  percentageContainer: {
    gap: 6,
  },
  percentageLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  percentageLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  yesLabel: {
    color: '#34C759',
  },
  noLabel: {
    color: '#FF3B30',
  },
  progressBarContainer: {
    position: 'relative',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    height: 10,
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    height: '100%',
    borderRadius: 6,
  },
  yesBar: {
    left: 0,
    backgroundColor: '#34C759',
  },
  noBar: {
    right: 0,
    backgroundColor: '#FF3B30',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 4,
  },
  voteButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  yesButton: {
    borderColor: '#34C759',
  },
  noButton: {
    borderColor: '#FF3B30',
  },
  voteButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  voteOdds: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.9,
  },
});



