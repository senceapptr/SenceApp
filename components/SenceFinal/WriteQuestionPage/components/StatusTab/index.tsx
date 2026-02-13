import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SubmittedQuestion } from '../../types';
import { QuestionStatusCard } from './QuestionStatusCard';
import { EmptyState } from './EmptyState';

interface StatusTabProps {
  questions: SubmittedQuestion[];
  loading?: boolean;
  onOpenQuestionDetail?: (questionId: string) => void;
}

export const StatusTab: React.FC<StatusTabProps> = ({
  questions,
  loading = false,
  onOpenQuestionDetail,
}) => {
  return (
    <View style={styles.statusTabContent}>
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Gönderdiğin Sorular</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.loadingText}>Sorular yükleniyor...</Text>
          </View>
        ) : questions.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.questionsList}>
            {questions.map((question) => (
              <QuestionStatusCard
                key={question.id}
                question={question}
                onOpenQuestionDetail={onOpenQuestionDetail}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statusTabContent: {
    gap: 16,
  },
  statusCard: {
    backgroundColor: '#161B22',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F0F6FC',
    marginBottom: 16,
  },
  questionsList: {
    gap: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#8B949E',
    fontWeight: '500',
  },
});

