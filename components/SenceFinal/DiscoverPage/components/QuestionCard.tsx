import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import type { DiscoverQuestion } from '../types';

const formatVotes = (votes: number) => {
  if (votes >= 1000) return `${(votes / 1000).toFixed(1)}K`;
  return votes.toString();
};

interface QuestionCardProps {
  question: DiscoverQuestion;
  onPress: (id: string, category?: any) => void;
  onVote: (questionId: string, vote: 'yes' | 'no', odds: number) => void;
}

export function QuestionCard({ question, onPress, onVote }: QuestionCardProps) {
  const { theme } = useTheme();
  const noPercentage = 100 - question.yesPercentage;
  const yesBarWidth = useRef(new Animated.Value(0)).current;
  const noBarWidth = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const yesFillAnim = useRef(new Animated.Value(0)).current;
  const noFillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(yesBarWidth, {
        toValue: question.yesPercentage,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(noBarWidth, {
        toValue: noPercentage,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();
  }, [question.yesPercentage, noPercentage]);

  const handleCardPressIn = () => {
    Animated.spring(cardScale, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const handleCardPressOut = () => {
    Animated.spring(cardScale, { toValue: 1, useNativeDriver: true }).start();
  };
  const handleYesPressIn = () => {
    Animated.timing(yesFillAnim, { toValue: 1, duration: 80, useNativeDriver: false }).start();
  };
  const handleYesPressOut = () => {
    onVote(question.id, 'yes', question.yesOdds);
    Animated.timing(yesFillAnim, { toValue: 0, duration: 80, useNativeDriver: false }).start();
  };
  const handleNoPressIn = () => {
    Animated.timing(noFillAnim, { toValue: 1, duration: 80, useNativeDriver: false }).start();
  };
  const handleNoPressOut = () => {
    onVote(question.id, 'no', question.noOdds);
    Animated.timing(noFillAnim, { toValue: 0, duration: 80, useNativeDriver: false }).start();
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
      onPress={() => onPress(question.id, question.category)}
      onPressIn={handleCardPressIn}
      onPressOut={handleCardPressOut}
      activeOpacity={1}
      style={styles.container}
    >
      <Animated.View style={[styles.card, { transform: [{ scale: cardScale }] }]}>
        <Image source={{ uri: question.image }} style={styles.image} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.2)']}
          style={styles.gradient}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        />
        <View style={styles.content}>
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
          <Text style={styles.title} numberOfLines={2}>
            {question.title}
          </Text>
          <View style={styles.percentageContainer}>
            <View style={styles.percentageLabels}>
              <Text style={[styles.percentageLabel, styles.yesLabel]}>
                Yes {question.yesPercentage}%
              </Text>
              <Text style={[styles.percentageLabel, styles.noLabel]}>
                No {noPercentage}%
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBar,
                  styles.yesBar,
                  {
                    width: yesBarWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.progressBar,
                  styles.noBar,
                  {
                    width: noBarWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => onVote(question.id, 'yes', question.yesOdds)}
              onPressIn={handleYesPressIn}
              onPressOut={handleYesPressOut}
              style={[styles.voteButton, styles.yesButton]}
              activeOpacity={1}
            >
              <Animated.View
                style={[
                  styles.fillAnim,
                  { left: 0, width: yesFillWidth, backgroundColor: theme.accent },
                ]}
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
                style={[
                  styles.fillAnim,
                  { right: 0, width: noFillWidth, backgroundColor: theme.error },
                ]}
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
  container: {
    marginBottom: 12,
  },
  card: {
    height: 320,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  percentageContainer: {
    marginBottom: 12,
  },
  percentageLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  percentageLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  yesLabel: {
    color: '#10B981',
  },
  noLabel: {
    color: '#DC2626',
  },
  progressBarContainer: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  yesBar: {
    backgroundColor: '#10B981',
  },
  noBar: {
    backgroundColor: '#DC2626',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  voteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    overflow: 'hidden',
  },
  yesButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
  },
  noButton: {
    backgroundColor: 'rgba(220, 38, 38, 0.9)',
  },
  fillAnim: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 14,
  },
  voteButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginRight: 4,
  },
  voteOdds: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
});
