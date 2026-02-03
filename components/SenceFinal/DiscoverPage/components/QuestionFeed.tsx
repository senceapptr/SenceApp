import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { QuestionCard } from './QuestionCard';
import type { DiscoverQuestion } from '../types';

interface QuestionFeedProps {
  questions: DiscoverQuestion[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onQuestionPress: (id: string, category?: any) => void;
  onVote: (questionId: string, vote: 'yes' | 'no', odds: number) => void;
}

export function QuestionFeed({
  questions,
  loading,
  refreshing,
  hasMore,
  loadingMore,
  onRefresh,
  onLoadMore,
  onQuestionPress,
  onVote,
}: QuestionFeedProps) {
  const { theme } = useTheme();

  if (loading && questions.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
        <Text style={[styles.loadingText, { color: theme.textMuted }]}>
          Sorular yükleniyor...
        </Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
        <Text style={styles.emptyEmoji}>🔍</Text>
        <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
          Henüz soru yok
        </Text>
        <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
          Bu filtrede veya aramada soru bulunamadı
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={questions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <QuestionCard
          question={item}
          onPress={onQuestionPress}
          onVote={onVote}
        />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.accent}
        />
      }
      onEndReached={() => {
        if (hasMore && !loadingMore) onLoadMore();
      }}
      onEndReachedThreshold={0.3}
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.footer}>
            <ActivityIndicator size="small" color={theme.accent} />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
