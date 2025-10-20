import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { TrendQuestion } from '../types';
import { TrendQuestionCard } from './TrendQuestionCard';

interface TrendQuestionsSectionProps {
  questions: TrendQuestion[];
  isDarkMode: boolean;
  theme: any;
  onQuestionPress: (id: number) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

export function TrendQuestionsSection({ 
  questions, 
  isDarkMode, 
  theme,
  onQuestionPress,
  onVote
}: TrendQuestionsSectionProps) {
  return (
    <View style={[styles.section, { backgroundColor: isDarkMode ? theme.surface : '#FFFFFF' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Trend Sorular</Text>
        <TouchableOpacity>
          <Text style={[styles.seeAll, { color: theme.primary }]}>Tümünü görüntüle</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={questions}
        renderItem={({ item }) => (
          <TrendQuestionCard
            question={item}
            onQuestionPress={onQuestionPress}
            onVote={onVote}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        contentContainerStyle={styles.list}
        removeClippedSubviews={false}
        maxToRenderPerBatch={1}
        windowSize={2}
        initialNumToRender={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    marginVertical: 8,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#432870',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#432870',
  },
  list: {
    paddingHorizontal: 16,
    gap: 8,
  },
});



