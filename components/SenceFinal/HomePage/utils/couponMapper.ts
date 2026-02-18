/**
 * Coupon Mapping Utilities
 * Backend coupon verilerini frontend formatına dönüştürür
 */

import { ActiveCoupon } from '../types';
import { calculateTimeLeft } from './questionMapper';

export interface CouponPrediction {
  id: number | string;
  questionId: string; // UUID
  question: string;
  choice: 'yes' | 'no';
  odds: number;
  category: string;
  result?: 'won' | 'lost' | 'pending';
  endDate: Date | null;
}

/**
 * En geç sonuçlanacak sorunun end_date'ini bul
 */
const getLatestEndDate = (predictions: CouponPrediction[]): Date | null => {
  if (!predictions || predictions.length === 0) return null;
  
  const validEndDates = predictions
    .map(prediction => prediction.endDate)
    .filter((endDate): endDate is Date => endDate instanceof Date && !isNaN(endDate.getTime()));
  
  if (validEndDates.length === 0) return null;
  
  return new Date(Math.max(...validEndDates.map(date => date.getTime())));
};

/**
 * Coupon status mapping
 */
const mapCouponStatus = (status: string): 'live' | 'won' | 'lost' => {
  if (status === 'pending') return 'live';
  if (status === 'won') return 'won';
  if (status === 'lost') return 'lost';
  return 'live'; // Default
};

/**
 * Coupon selection'ı prediction'a dönüştür
 */
const mapSelectionToPrediction = (selection: any): CouponPrediction => {
  return {
    id: selection.id || 0,
    questionId: selection.question_id || '',
    question: selection.questions?.title || 'Soru bulunamadı',
    choice: selection.vote || 'yes',
    odds: selection.odds || 1,
    category: selection.questions?.categories?.name || 'Genel',
    result: selection.status === 'won' ? 'won' : selection.status === 'lost' ? 'lost' : 'pending',
    endDate: selection.questions?.end_date ? new Date(selection.questions.end_date) : null,
  };
};

/**
 * Backend coupon'ı ActiveCoupon formatına dönüştür
 */
export const mapCouponToActiveCoupon = (coupon: any): ActiveCoupon => {
  // Predictions'ları backend'den gelen coupon_selections'dan oluştur
  const predictions = (coupon.coupon_selections || []).map(mapSelectionToPrediction);

  // En geç sonuçlanacak sorunun end_date'ini bul
  const latestEndDate = getLatestEndDate(predictions);
  const endsIn = latestEndDate ? calculateTimeLeft(latestEndDate.toISOString()) : 'Bilinmiyor';

  return {
    id: coupon.display_id || coupon.id,
    name: `Ticket #${coupon.display_id || coupon.id}`,
    questionCount: coupon.selections_count || predictions.length || 0,
    totalOdds: coupon.total_odds || 1,
    potentialWinnings: coupon.potential_win || 0,
    endsIn,
    colors: ['#432870', '#5A3A8B'] as [string, string],
    // CouponDetailModal için gerekli alanlar
    predictions: predictions.map((p: CouponPrediction, index: number) => ({
      id: String(p.id || `prediction-${index}`),
      questionId: String(p.questionId || ''),
      question: p.question,
      choice: p.choice,
      odds: p.odds,
      category: p.category,
      result: p.result,
    })),
    potentialEarnings: coupon.potential_win || 0,
    status: mapCouponStatus(coupon.status || 'pending'),
    createdAt: new Date(coupon.created_at),
    username: coupon.username || '@kullanici',
    investmentAmount: coupon.stake_amount || 0,
  };
};
