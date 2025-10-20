import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SubmittedQuestion } from '../../types';
import { QuestionStatusCard } from './QuestionStatusCard';
import { EmptyState } from './EmptyState';

interface StatusTabProps {
  questions: SubmittedQuestion[];
}

export const StatusTab: React.FC<StatusTabProps> = ({ questions }) => {
  return (
    <View style={styles.statusTabContent}>
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Gönderdiğin Sorular</Text>
        
        {questions.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.questionsList}>
            {questions.map((question) => (
              <QuestionStatusCard key={question.id} question={question} />
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
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F2F3F5',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 16,
  },
  questionsList: {
    gap: 16,
  },
});


