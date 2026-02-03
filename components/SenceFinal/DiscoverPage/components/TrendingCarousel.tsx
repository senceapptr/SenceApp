import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { DiscoverQuestion } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 280;
const CARD_MARGIN = 12;

const formatVotes = (votes: number) => {
  if (votes >= 1000) return `${(votes / 1000).toFixed(1)}K`;
  return votes.toString();
};

interface TrendingCarouselProps {
  questions: DiscoverQuestion[];
  onQuestionPress: (id: string, category?: any) => void;
  onVote: (questionId: string, vote: 'yes' | 'no', odds: number) => void;
}

function TrendingCard({
  question,
  onPress,
  onVote,
}: {
  question: DiscoverQuestion;
  onPress: () => void;
  onVote: (vote: 'yes' | 'no', odds: number) => void;
}) {
  const cardScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(cardScale, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(cardScale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={styles.cardWrapper}
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
              <Ionicons name="people" size={12} color="rgba(255,255,255,0.9)" />
              <Text style={styles.statText}>{formatVotes(question.votes)}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={12} color="rgba(255,255,255,0.9)" />
              <Text style={styles.statText}>{question.timeLeft}</Text>
            </View>
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {question.title}
          </Text>
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.yesBtn}
              onPress={(e) => {
                e.stopPropagation();
                onVote('yes', question.yesOdds);
              }}
            >
              <Text style={styles.btnText}>Yes {question.yesOdds}x</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.noBtn}
              onPress={(e) => {
                e.stopPropagation();
                onVote('no', question.noOdds);
              }}
            >
              <Text style={styles.btnText}>No {question.noOdds}x</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

export function TrendingCarousel({
  questions,
  onQuestionPress,
  onVote,
}: TrendingCarouselProps) {
  const { theme } = useTheme();
  if (questions.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Bugün popüler</Text>
      <FlatList
        data={questions}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrendingCard
            question={item}
            onPress={() => onQuestionPress(item.id, item.category)}
            onVote={(vote, odds) => onVote(item.id, vote, odds)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingRight: 16,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: CARD_MARGIN,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  yesBtn: {
    flex: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  noBtn: {
    flex: 1,
    backgroundColor: 'rgba(220, 38, 38, 0.9)',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
});
