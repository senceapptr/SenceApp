import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Question } from '../../types';
import { VoteButtons } from './VoteButtons';

interface QuestionCardProps {
  question: Question;
  onVote: (questionId: string, vote: 'yes' | 'no', odds: number) => void;
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
    backgroundColor: '#161B22',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#30363D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
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
    backgroundColor: 'rgba(37, 110, 255, 0.2)',
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#256EFF',
  },
  trendingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#256EFF',
    borderRadius: 12,
  },
  trendingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F0F6FC',
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
    color: '#8B949E',
  },
  separator: {
    fontSize: 14,
    color: '#8B949E',
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
    color: '#256EFF',
  },
  progressLabelNo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#0D1117',
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressYes: {
    height: '100%',
    backgroundColor: '#256EFF',
  },
  progressNo: {
    height: '100%',
    backgroundColor: '#DC2626',
  },
  voteResult: {
    flexDirection: 'row',
    gap: 12,
  },
  resultButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#30363D',
    backgroundColor: '#21262D',
    alignItems: 'center',
  },
  resultButtonYes: {
    backgroundColor: 'rgba(37, 110, 255, 0.1)',
    borderColor: '#256EFF',
  },
  resultButtonNo: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderColor: '#DC2626',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#484F58',
    marginBottom: 4,
  },
  resultTextYes: {
    color: '#256EFF',
  },
  resultTextNo: {
    color: '#DC2626',
  },
  resultOdds: {
    fontSize: 12,
    color: '#8B949E',
  },
});
