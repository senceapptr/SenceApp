import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FeaturedQuestion } from '../types';
import { formatVotes } from '../utils';
import { useCountdown } from '../../hooks/useCountdown';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FeaturedCardProps {
  question: FeaturedQuestion;
  onQuestionPress: (id: string) => void;
  onVote: (questionId: string, vote: 'yes' | 'no', odds: number, questionTitle?: string) => void;
}

const FeaturedVoteButton = ({
  label,
  odds,
  color,
  onPress,
}: {
  label: string;
  odds: number;
  color: string;
  onPress: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const sheenTranslate = useRef(new Animated.Value(-140)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.92)).current;
  const isNo = label === 'HAYIR';

  const handlePressIn = () => {
    sheenTranslate.setValue(-140);
    ringScale.setValue(0.92);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 260,
        friction: 11,
      }),
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(sheenTranslate, {
        toValue: 160,
        duration: 430,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(ringOpacity, {
          toValue: 0.35,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(ringScale, {
          toValue: 1.1,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 280,
        friction: 14,
      }),
      Animated.timing(glowOpacity, {
        toValue: 0,
        duration: 160,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(ringOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity
      style={styles.voteButtonTapArea}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.voteButton,
          {
            borderColor: color,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.08)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <Animated.View
          style={[
            styles.voteButtonGlow,
            {
              backgroundColor: color,
              opacity: glowOpacity,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.voteButtonRing,
            {
              borderColor: color,
              opacity: ringOpacity,
              transform: [{ scale: ringScale }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.voteSheen,
            {
              transform: [{ translateX: sheenTranslate }, { skewX: isNo ? '-12deg' : '12deg' }],
            },
          ]}
        />
        <View style={styles.voteButtonContent}>
          <Text style={styles.voteButtonText}>{label}</Text>
          <Text style={styles.voteOdds}>{odds}x</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export function FeaturedCard({ question, onQuestionPress, onVote }: FeaturedCardProps) {
  const timeLeft = useCountdown(question.endDate);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onQuestionPress(question.id)}
      activeOpacity={0.98} // Daha az opacity değişimi
    >
      <Image source={{ uri: question.image }} style={styles.image} fadeDuration={0} resizeMode="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.82)', 'rgba(0,0,0,0.95)']}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View style={styles.content}>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="people" size={20} color="#FFFFFF" />
            <Text style={styles.statText}>{formatVotes(question.votes)}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time" size={20} color="#FFFFFF" />
            <Text style={styles.statText}>{timeLeft}</Text>
          </View>
        </View>

        {/* Question Title */}
        <Text style={styles.title}>{question.title}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <FeaturedVoteButton
          label="EVET"
          odds={question.yesOdds}
          color="#10B981"
          onPress={() => onVote(question.id, 'yes', question.yesOdds, question.title)}
        />
        <FeaturedVoteButton
          label="HAYIR"
          odds={question.noOdds}
          color="#DC2626"
          onPress={() => onVote(question.id, 'no', question.noOdds, question.title)}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH,
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  content: {
    position: 'absolute',
    bottom: 115,
    left: 24,
    right: 24,
    gap: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 3 },
    textShadowRadius: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 32,
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 46,
    left: 24,
    right: 24,
    flexDirection: 'row',
    gap: 16,
  },
  voteButtonTapArea: {
    flex: 1,
  },
  voteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(13,17,23,0.55)',
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.24,
    shadowRadius: 10,
    elevation: 4,
  },
  voteButtonGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  voteButtonRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 2,
  },
  voteSheen: {
    position: 'absolute',
    top: -10,
    bottom: -10,
    width: 72,
    backgroundColor: 'rgba(255,255,255,0.24)',
    borderRadius: 20,
  },
  voteButtonContent: {
    zIndex: 4,
    alignItems: 'center',
  },
  voteButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  voteOdds: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    opacity: 1,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
});
