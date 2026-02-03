import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { DiscoverHeader } from './components/DiscoverHeader';
import { SearchBar } from './components/SearchBar';
import { FilterPills } from './components/FilterPills';
import { TrendingCarousel } from './components/TrendingCarousel';
import { CategoryChips } from './components/CategoryChips';
import { QuestionCard } from './components/QuestionCard';
import { useDiscoverData } from './hooks';
import type { DiscoverPageProps, FilterType } from './types';

export function DiscoverPage({
  onBack,
  onMenuToggle,
  handleQuestionDetail,
  handleVote,
}: DiscoverPageProps) {
  const { theme, isDarkMode } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    categories,
    trendingQuestions,
    questions,
    loading,
    refreshing,
    hasMore,
    loadingMore,
    refresh,
    loadMore,
  } = useDiscoverData(selectedFilter, selectedCategory, searchQuery);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const ListHeader = (
    <View style={styles.headerContent}>
      <SearchBar value={searchQuery} onChangeText={handleSearchChange} />
      <FilterPills selected={selectedFilter} onSelect={setSelectedFilter} />
      <TrendingCarousel
        questions={trendingQuestions}
        onQuestionPress={handleQuestionDetail}
        onVote={handleVote}
      />
      <CategoryChips
        categories={categories}
        selectedId={selectedCategory}
        onSelect={setSelectedCategory}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <DiscoverHeader onBack={onBack} onMenuToggle={onMenuToggle} />
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <QuestionCard
            question={item}
            onPress={handleQuestionDetail}
            onVote={handleVote}
          />
        )}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={[
          styles.listContent,
          questions.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={theme.accent}
          />
        }
        onEndReached={() => {
          if (hasMore && !loadingMore && !searchQuery.trim()) loadMore();
        }}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          loading && questions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color={theme.accent} />
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                Sorular yükleniyor...
              </Text>
            </View>
          ) : questions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                Henüz soru yok
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
                Bu filtrede veya aramada soru bulunamadı
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContent: {
    paddingBottom: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
  },
});
