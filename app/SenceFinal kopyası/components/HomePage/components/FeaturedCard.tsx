import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FeaturedQuestion } from '../types';
import { formatVotes } from '../utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FeaturedCardProps {
  question: FeaturedQuestion;
  onQuestionPress: (id: number) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number, questionTitle?: string) => void;
}

const FeaturedVoteButton = ({
  label,
  odds,
  color,
  onPress,
}: { label: string; odds: number; color: string; onPress: () => void }) => {
  const fillAnim = useRef(new Animated.Value(0)).current;
  const isNo = label === 'HAYIR';

  const handlePressIn = () => {
    Animated.timing(fillAnim, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(fillAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.in(Easing.quad),
      useNativeDriver: false,
    }).start();
    onPress();
  };

  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <TouchableOpacity
      style={[styles.voteButton, { borderColor: color }]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={{
          position: 'absolute',
          ...(isNo ? { right: 0 } : { left: 0 }),
          top: 0,
          bottom: 0,
          width: fillWidth,
          backgroundColor: color,
          opacity: 1.00,
          borderRadius: 18,
        }}
      />
      <Text style={styles.voteButtonText}>{label}</Text>
      <Text style={styles.voteOdds}>{odds}x</Text>
    </TouchableOpacity>
  );
};

export function FeaturedCard({ question, onQuestionPress, onVote }: FeaturedCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onQuestionPress(question.id)}
      activeOpacity={0.95}
    >
      <Image source={{ uri: question.image }} style={styles.image} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
      />
      
      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statText}>👥 {formatVotes(question.votes)} Oy</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statText}>⏱️ {question.timeLeft}</Text>
        </View>
      </View>

      {/* Question Title */}
      <Text style={styles.title}>{question.title}</Text>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <FeaturedVoteButton
          label="EVET"
          odds={question.yesOdds}
          color="#34C759"
          onPress={() => onVote(question.id, 'yes', question.yesOdds, question.title)}
        />
        <FeaturedVoteButton
          label="HAYIR"
          odds={question.noOdds}
          color="#FF3B30"
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
    height: '60%',
  },
  statsRow: {
    position: 'absolute',
    bottom: 195,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    position: 'absolute',
    bottom: 115,
    left: 24,
    right: 24,
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
  voteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  voteButtonText: {
    color: '#ffffff',
    fontSize: 16,
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



