import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TrendQuestion } from '../types';
import CategoryQuestionCard from '../../CategoryQuestionCard';
import { categoriesService } from '@/services/categories.service';
import type { Category } from '@/services/categories.service';

export type TrendSortBy = 'popular' | 'odds' | 'date' | 'ending';

const SORT_OPTIONS: { key: TrendSortBy; label: string }[] = [
  { key: 'date', label: 'Son Eklenenler' },
  { key: 'odds', label: 'Yüksek Oranlar' },
  { key: 'popular', label: 'Popüler Sorular' },
  { key: 'ending', label: 'Yakında Bitecek' },
];

const getSortLabel = (sortBy: TrendSortBy) =>
  SORT_OPTIONS.find((o) => o.key === sortBy)?.label ?? 'Sırala';

interface TrendQuestionsSectionProps {
  questions: TrendQuestion[];
  isDarkMode: boolean;
  theme: any;
  sortBy: TrendSortBy;
  onSortChange: (key: TrendSortBy) => void;
  onOpenSortSheet: () => void;
  onQuestionPress: (id: string) => void;
  onVote: (questionId: string, vote: 'yes' | 'no', odds: number) => void;
  onSeeAllPress?: () => void;
  onSearchPress?: () => void;
}

export function TrendQuestionsSection({
  questions,
  isDarkMode,
  theme,
  sortBy,
  onSortChange,
  onOpenSortSheet,
  onQuestionPress,
  onVote,
  onSeeAllPress,
  onSearchPress,
}: TrendQuestionsSectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    categoriesService.getActiveCategories().then(({ data }) => {
      if (mounted && data) setCategories(data);
    });
    return () => { mounted = false; };
  }, []);

  const selectedCategoryName = selectedCategoryId
    ? categories.find((c) => c.id === selectedCategoryId)?.name ?? null
    : null;

  const sectionTitle = selectedCategoryName
    ? `${selectedCategoryName} Soruları`
    : 'Tüm Sorular';

  const filteredAndSortedQuestions = useMemo(() => {
    let list = selectedCategoryId
      ? questions.filter((q) => q.categoryId === selectedCategoryId)
      : [...questions];

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter((q) => q.title.toLowerCase().includes(query));
    }

    return [...list].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      }
      if (sortBy === 'odds') {
        return b.yesPercentage - a.yesPercentage;
      }
      if (sortBy === 'ending') {
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      }
      return b.votes - a.votes;
    });
  }, [questions, selectedCategoryId, sortBy, searchQuery]);

  return (
    <View style={[styles.section, { backgroundColor: 'transparent' }]}>
      {/* iOS tarzı arama çubuğu */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Soru ara"
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.clearSearch}
            >
              <Ionicons name="close-circle" size={18} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Kategori butonları – emoji yok, daha büyük, az boşluk */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
        style={styles.categoriesScrollView}
      >
        <TouchableOpacity
          style={[styles.categoryChip, selectedCategoryId === null && styles.categoryChipActive]}
          onPress={() => setSelectedCategoryId(null)}
        >
          <Text
            style={[
              styles.categoryChipText,
              selectedCategoryId === null && styles.categoryChipTextActive,
            ]}
          >
            Tümü
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryChip, selectedCategoryId === cat.id && styles.categoryChipActive]}
            onPress={() => setSelectedCategoryId(cat.id)}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategoryId === cat.id && styles.categoryChipTextActive,
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Başlık + Sırala butonu – tek satır, binme yok */}
      <View style={styles.titleBlock}>
        <Text style={styles.sectionTitle} numberOfLines={1}>
          {sectionTitle}
        </Text>
        <TouchableOpacity style={styles.sortButton} onPress={onOpenSortSheet} activeOpacity={0.7}>
          <Text style={styles.sortButtonText} numberOfLines={1}>
            {getSortLabel(sortBy)}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#0A84FF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAndSortedQuestions}
        renderItem={({ item }) => (
          <CategoryQuestionCard
            question={item}
            onDetail={onQuestionPress}
            onVote={onVote}
            theme={theme}
            dynamicStyles={{
              yesLabel: { color: theme.success || '#34C759' },
              noLabel: { color: theme.error || '#FF3B30' },
              yesBar: { backgroundColor: theme.success || '#34C759' },
              noBar: { backgroundColor: theme.error || '#FF3B30' },
              yesButton: { borderColor: theme.success || '#34C759' },
              noButton: { borderColor: theme.error || '#FF3B30' },
            }}
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
    marginHorizontal: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 10,
    minHeight: 36,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: '#F5F5F7',
    paddingVertical: 0,
  },
  clearSearch: {
    padding: 2,
  },
  categoriesScrollView: {
    marginBottom: 18,
    maxHeight: 44,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(118, 118, 128, 0.18)',
    marginRight: 0,
  },
  categoryChipActive: {
    backgroundColor: 'rgba(10, 132, 255, 0.25)',
  },
  categoryChipText: {
    fontSize: 15,
    color: 'rgba(235, 235, 245, 0.8)',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#0A84FF',
  },
  titleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 14,
    gap: 12,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: '#F5F5F7',
    letterSpacing: 0.2,
    marginRight: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(10, 132, 255, 0.15)',
    flexShrink: 0,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A84FF',
    maxWidth: 120,
  },
  list: {
    paddingHorizontal: 16,
    gap: 8,
  },
});
