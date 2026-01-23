import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Question } from '../../types';
import { VoteButtons } from './VoteButtons';

interface QuestionCardProps {
  question: Question;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

export function QuestionCard({ question, onVote }: QuestionCardProps) {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.meta}>
          <Text style={styles.emoji}>{question.categoryEmoji}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{question.category}</Text>
          </View>
          {question.isTrending && (
            <View style={styles.trendingBadge}>
              <Text style={styles.trendingText}>🔥 Trend</Text>
            </View>
          )}
        </View>
        <Text style={styles.questionText}>{question.text}</Text>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <Text style={styles.statText}>👥 {question.totalVotes} oy</Text>
        <Text style={styles.separator}>•</Text>
        <Text style={styles.statText}>⏱️ {question.endDate}</Text>
      </View>

      {/* Progress */}
      <View style={styles.progress}>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabelYes}>EVET {question.yesPercentage}%</Text>
          <Text style={styles.progressLabelNo}>HAYIR {question.noPercentage}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressYes, { width: `${question.yesPercentage}%` }]} />
          <View style={[styles.progressNo, { width: `${question.noPercentage}%` }]} />
        </View>
      </View>

      {/* Buttons */}
      {question.userVote ? (
        <View style={styles.voteResult}>
          <View
            style={[
              styles.resultButton,
              question.userVote === 'yes' && styles.resultButtonYes,
            ]}
          >
            <Text
              style={[
                styles.resultText,
                question.userVote === 'yes' && styles.resultTextYes,
              ]}
            >
              {question.userVote === 'yes' && '✓ '}EVET
            </Text>
            <Text style={styles.resultOdds}>{question.yesOdds}x</Text>
          </View>
          <View
            style={[
              styles.resultButton,
              question.userVote === 'no' && styles.resultButtonNo,
            ]}
          >
            <Text
              style={[
                styles.resultText,
                question.userVote === 'no' && styles.resultTextNo,
              ]}
            >
              {question.userVote === 'no' && '✓ '}HAYIR
            </Text>
            <Text style={styles.resultOdds}>{question.noOdds}x</Text>
          </View>
        </View>
      ) : (
        <VoteButtons
          yesOdds={question.yesOdds}
          noOdds={question.noOdds}
          onYesPress={() => onVote(question.id, 'yes', question.yesOdds)}
          onNoPress={() => onVote(question.id, 'no', question.noOdds)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: '#F2F3F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  emoji: {
    fontSize: 24,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(178, 158, 253, 0.2)',
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#432870',
  },
  trendingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#C9F158',
    borderRadius: 12,
  },
  trendingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#202020',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#202020',
    lineHeight: 22,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  statText: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  separator: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  progress: {
    marginBottom: 16,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabelYes: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  progressLabelNo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#06B6D4',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F2F3F5',
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressYes: {
    height: '100%',
    backgroundColor: '#8B5CF6',
  },
  progressNo: {
    height: '100%',
    backgroundColor: '#06B6D4',
  },
  voteResult: {
    flexDirection: 'row',
    gap: 12,
  },
  resultButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F2F3F5',
    backgroundColor: '#F2F3F5',
    alignItems: 'center',
  },
  resultButtonYes: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: '#8B5CF6',
  },
  resultButtonNo: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderColor: '#06B6D4',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '900',
    color: 'rgba(32, 32, 32, 0.4)',
    marginBottom: 4,
  },
  resultTextYes: {
    color: '#8B5CF6',
  },
  resultTextNo: {
    color: '#06B6D4',
  },
  resultOdds: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.7)',
  },
});

