import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SubmittedQuestion } from '../../types';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../../utils';

interface QuestionStatusCardProps {
  question: SubmittedQuestion;
  onOpenQuestionDetail?: (questionId: string) => void;
}

export const QuestionStatusCard: React.FC<QuestionStatusCardProps> = ({
  question,
  onOpenQuestionDetail,
}) => {
  const canOpenDetail = question.isApprovedAndPublished && !!onOpenQuestionDetail;

  return (
    <TouchableOpacity
      activeOpacity={canOpenDetail ? 0.8 : 1}
      disabled={!canOpenDetail}
      onPress={() => {
        if (!canOpenDetail) return;
        onOpenQuestionDetail?.(question.id);
      }}
      style={[styles.questionCard, canOpenDetail && styles.questionCardClickable]}
    >
      <View style={styles.questionHeader}>
        <View style={styles.questionContent}>
          <Text style={styles.questionTitle}>{question.title}</Text>
          <Text style={styles.questionDescription}>{question.description}</Text>
        </View>
        <View style={styles.questionStatus}>
          <StatusBadge status={question.status} />
        </View>
      </View>
      
      <View style={styles.questionFooter}>
        <Text style={styles.questionDate}>Gönderilme: {formatDate(question.submittedAt)}</Text>
        <Text style={styles.questionDate}>Bitiş: {formatDate(question.endDate)}</Text>
      </View>

      {canOpenDetail && <Text style={styles.detailHint}>Detay için dokun</Text>}
      
      {question.status === 'rejected' && question.rejectionReason && (
        <View style={styles.rejectionContainer}>
          <Text style={styles.rejectionTitle}>Red Sebebi:</Text>
          <Text style={styles.rejectionText}>{question.rejectionReason}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  questionCard: {
    backgroundColor: '#161B22',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  questionCardClickable: {
    borderColor: '#2F4F8C',
  },
  detailHint: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 10,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  questionContent: {
    flex: 1,
    marginRight: 12,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F0F6FC',
    marginBottom: 4,
    lineHeight: 22,
  },
  questionDescription: {
    fontSize: 14,
    color: '#8B949E',
    lineHeight: 20,
  },
  questionStatus: {
    alignItems: 'flex-end',
  },
  questionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionDate: {
    fontSize: 12,
    color: '#8B949E',
  },
  rejectionContainer: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  rejectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F87171',
    marginBottom: 4,
  },
  rejectionText: {
    fontSize: 14,
    color: '#FCA5A5',
    lineHeight: 20,
  },
});
