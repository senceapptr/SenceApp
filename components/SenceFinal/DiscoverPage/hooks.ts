import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { questionsService } from '@/services/questions.service';
import { categoriesService } from '@/services/categories.service';
import type { DiscoverQuestion, DiscoverCategory, FilterType } from './types';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1574477942438-5db6de70fd34?w=600';

const calculateTimeLeft = (endDate: string): string => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) return 'Bitti';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}g ${hours}s`;
  if (hours > 0) return `${hours}s ${minutes}d`;
  return `${minutes}d`;
};

const transformQuestion = (q: any, categoryId?: string): DiscoverQuestion => {
  let displayCategory = q.categories;
  if (categoryId && q.category_id !== categoryId) {
    if (q.secondary_category_id === categoryId) displayCategory = q.secondary_category;
    else if (q.third_category_id === categoryId) displayCategory = q.third_category;
  }
  return {
    id: q.id,
    title: q.title,
    description: q.description,
    category: displayCategory || { id: '', name: 'Genel', slug: '', icon: '🌍', color: '#6B7280' },
    votes: q.total_votes || 0,
    timeLeft: calculateTimeLeft(q.end_date),
    yesOdds: q.yes_odds || 2.0,
    noOdds: q.no_odds || 2.0,
    yesPercentage: q.yes_percentage || 50,
    image: q.image_url && String(q.image_url).trim() !== '' ? q.image_url : DEFAULT_IMAGE,
    end_date: q.end_date,
    total_amount: q.total_amount || 0,
    is_trending: q.is_trending || false,
    is_featured: q.is_featured || false,
  };
};

export function useDiscoverData(
  filter: FilterType,
  categoryId: string | null,
  searchQuery: string
) {
  const [categories, setCategories] = useState<DiscoverCategory[]>([]);
  const [trendingQuestions, setTrendingQuestions] = useState<DiscoverQuestion[]>([]);
  const [questions, setQuestions] = useState<DiscoverQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadCategories = useCallback(async () => {
    const { data, error } = await categoriesService.getActiveCategories();
    if (error) {
      console.error('Load categories error:', error);
      return;
    }
    setCategories(data || []);
  }, []);

  const loadTrending = useCallback(async () => {
    const { data, error } = await questionsService.getTrendingQuestions();
    if (error) return;
    const mapped = (data || []).map((q: any) => transformQuestion(q));
    setTrendingQuestions(mapped.slice(0, 5));
  }, []);

  const loadQuestions = useCallback(
    async (reset = false) => {
      try {
        if (reset) {
          setOffset(0);
          setQuestions([]);
          setHasMore(true);
        }
        const currentOffset = reset ? 0 : offset;

        let result;
        if (searchQuery.trim()) {
          result = await questionsService.searchQuestions(searchQuery, 20, currentOffset);
        } else if (categoryId) {
          result = await questionsService.getQuestionsByCategory(categoryId, 20, currentOffset);
        } else {
          const filters: Record<string, unknown> = { limit: 20, offset: currentOffset };
          if (filter === 'trending') filters.trending = true;
          else if (filter === 'high-odds') filters.highOdds = true;
          else if (filter === 'ending-soon') filters.endingSoon = true;
          result = await questionsService.getAllQuestions(filters);
        }

        if (result.error) {
          Alert.alert('Hata', 'Sorular yüklenirken bir hata oluştu.');
          return;
        }

        const newQuestions = (result.data || []).map((q: any) => transformQuestion(q, categoryId || undefined));
        if (reset) {
          setQuestions(newQuestions);
        } else {
          setQuestions((prev) => [...prev, ...newQuestions]);
        }
        setOffset(currentOffset + 20);
        setHasMore(newQuestions.length === 20);
      } catch (err) {
        console.error('Load questions error:', err);
      }
    },
    [filter, categoryId, searchQuery, offset]
  );

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadCategories(), loadTrending(), loadQuestions(true)]);
    setRefreshing(false);
  }, [loadCategories, loadTrending, loadQuestions]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || searchQuery.trim()) return;
    setLoadingMore(true);
    await loadQuestions(false);
    setLoadingMore(false);
  }, [loadQuestions, loadingMore, hasMore, searchQuery]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadCategories();
      await loadTrending();
      setLoading(false);
    };
    init();
  }, [loadCategories, loadTrending]);

  useEffect(() => {
    setLoading(true);
    loadQuestions(true).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, categoryId, searchQuery]);

  return {
    categories,
    trendingQuestions,
    questions,
    loading,
    refreshing,
    hasMore,
    loadingMore,
    refresh,
    loadMore,
  };
}
