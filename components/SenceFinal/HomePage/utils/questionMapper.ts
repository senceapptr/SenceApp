/**
 * Question Mapping Utilities
 * Backend verilerini frontend formatına dönüştürür
 */

import { FeaturedQuestion, TrendQuestion } from '../types';

// Default image URLs
const DEFAULT_FEATURED_IMAGE = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop';
const DEFAULT_TREND_IMAGE = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop';

/**
 * Image URL validation ve fallback
 */
export const getQuestionImage = (imageUrl: string | null | undefined, fallback: string): string => {
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl;
  }
  return fallback;
};

/**
 * Kategori seçimi (primary, secondary, third)
 */
export const getDisplayCategory = (question: any) => {
  // Önce primary kategoriyi kontrol et
  if (question.categories) {
    return question.categories;
  }
  // Sonra secondary kategoriyi kontrol et
  if (question.secondary_category) {
    return question.secondary_category;
  }
  // Son olarak third kategoriyi kontrol et
  if (question.third_category) {
    return question.third_category;
  }
  // Hiçbiri yoksa null döndür
  return null;
};

/**
 * Zaman hesaplama fonksiyonu
 */
export const calculateTimeLeft = (endDate: string): string => {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Sona erdi';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days} gün ${hours} saat`;
  return `${hours} saat`;
};

/**
 * Featured question mapping
 */
export const mapToFeaturedQuestion = (q: any): FeaturedQuestion => {
  const displayCategory = getDisplayCategory(q);

  return {
    id: q.id,
    title: q.title,
    image: getQuestionImage(q.image_url, DEFAULT_FEATURED_IMAGE),
    votes: q.total_votes || 0,
    timeLeft: calculateTimeLeft(q.end_date),
    category: displayCategory?.name || 'Genel',
    yesOdds: q.yes_odds || 2.0,
    noOdds: q.no_odds || 2.0,
    dominantColor: displayCategory?.color || '#4F46E5',
    endDate: q.end_date || new Date().toISOString(),
  };
};

/**
 * Trend question mapping
 */
export const mapToTrendQuestion = (q: any): TrendQuestion => {
  const displayCategory = getDisplayCategory(q);

  return {
    id: q.id,
    title: q.title,
    category: displayCategory?.name || 'Genel',
    categoryId: displayCategory?.id ?? null,
    image: getQuestionImage(q.image_url, DEFAULT_TREND_IMAGE),
    votes: q.total_votes || 0,
    timeLeft: calculateTimeLeft(q.end_date),
    yesOdds: q.yes_odds || 2.0,
    noOdds: q.no_odds || 2.0,
    yesPercentage: q.yes_percentage || 0,
    publishDate: q.publish_date || q.created_at || new Date().toISOString(),
    endDate: q.end_date || q.publish_date || new Date().toISOString(),
    // Additional fields for CategoryQuestionCard compatibility
    end_date: q.end_date || q.publish_date || new Date().toISOString(),
    status: q.status || 'active',
    result: q.result || null,
  };
};
