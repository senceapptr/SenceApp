import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SubmittedQuestion } from '../../types';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../../utils';

interface QuestionStatusCardProps {
  question: SubmittedQuestion;
}

export const QuestionStatusCard: React.FC<QuestionStatusCardProps> = ({ question }) => {
  return (
    <View style={styles.questionCard}>
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
      
      {question.status === 'rejected' && question.rejectionReason && (
        <View style={styles.rejectionContainer}>
          <Text style={styles.rejectionTitle}>Red Sebebi:</Text>
          <Text style={styles.rejectionText}>{question.rejectionReason}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  questionCard: {
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'white',
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
    color: '#202020',
    marginBottom: 4,
    lineHeight: 22,
  },
  questionDescription: {
    fontSize: 14,
    color: 'rgba(32,32,32,0.7)',
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
    color: 'rgba(32,32,32,0.5)',
  },
  rejectionContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  rejectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 4,
  },
  rejectionText: {
    fontSize: 14,
    color: '#DC2626',
    lineHeight: 20,
  },
});


