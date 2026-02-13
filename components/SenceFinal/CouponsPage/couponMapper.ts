/**
 * Coupon Mapper
 * Backend'den gelen ham veriyi frontend tipine dönüştürür
 */

import { Coupon, CouponPrediction, PredictionResult } from './types';

interface BackendSelection {
  id: string;
  odds: number;
  vote: 'yes' | 'no';
  question_id: string;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  questions?: {
    id: string;
    title: string;
    image_url?: string | null;
    category_id?: string;
    status?: string;
    result?: string;
    end_date?: string;
    categories?: { name: string } | null;
  } | null;
}

interface BackendCoupon {
  id: string;
  user_id: string;
  username?: string;
  total_odds: number;
  created_at: string;
  display_id?: number;
  coupon_code?: string;
  stake_amount: number;
  is_claimed?: boolean;
  potential_win: number;
  selections_count?: number;
  correct_selections?: number;
  resolved_at?: string | null;
  selections?: BackendSelection[];
  couponSelections?: BackendSelection[];
  coupon_selections?: BackendSelection[];
  status: 'pending' | 'won' | 'lost' | 'partially_won' | 'cancelled';
}

/**
 * Tahmin sonucunu hesaplar
 * ÖNEMLİ: Soru süresi bitmeden sonuç gösterilmez
 */
function computePredictionResult(selectionStatus: string, questionEndDate: Date | null): PredictionResult {
  const now = new Date();

  // Süre henüz bitmemişse her zaman "pending"
  if (questionEndDate && questionEndDate > now) {
    return 'pending';
  }

  // Süre bitti, backend'den gelen status'a bak
  if (selectionStatus === 'won') return 'won';
  if (selectionStatus === 'lost') return 'lost';
  if (selectionStatus === 'cancelled') return 'cancelled';
  return 'pending';
}

/**
 * Tahmin sonuçlarına göre kupon statusunu hesapla
 * Frontend'de görsel amaçlı kullanılır
 */
export function computeCouponDisplayStatus(
  predictions: { result?: PredictionResult }[],
): 'pending' | 'won' | 'lost' | 'cancelled' {
  if (!predictions || predictions.length === 0) return 'pending';

  const results = predictions.map(p => p.result ?? 'pending');

  // Hepsi pending ise kupon pending
  if (results.every(r => r === 'pending')) return 'pending';

  // Bir tane bile lost varsa kupon lost
  if (results.some(r => r === 'lost')) return 'lost';

  // Hepsi cancelled ise kupon cancelled
  if (results.every(r => r === 'cancelled')) return 'cancelled';

  // Hepsi won veya cancelled ise kupon won (cancelled olanlar say tutmaz)
  if (results.every(r => r === 'won' || r === 'cancelled')) return 'won';

  // Diğer durumlar (bir kısmı pending) - kupon pending
  return 'pending';
}

/**
 * Backend kuponunu frontend formatına dönüştürür
 */
export function mapBackendCouponToFrontend(coupon: BackendCoupon): Coupon {
  // coupon_selections bazen farklı key ile gelebilir
  const rawSelections =
    coupon.coupon_selections ?? coupon.couponSelections ?? (Array.isArray(coupon.selections) ? coupon.selections : []);

  const selections = Array.isArray(rawSelections) ? rawSelections : [];

  const predictions: CouponPrediction[] = selections.map((selection, index) => {
    const questionRow = selection.questions;
    const predictionId = String(selection.id || '').trim();
    const questionId = String(selection.question_id || questionRow?.id || '').trim();

    const categoryName = questionRow?.categories?.name ?? 'Genel';

    const endDate = questionRow?.end_date ? new Date(questionRow.end_date) : null;

    const result = computePredictionResult(selection.status, endDate);

    return {
      category: categoryName,
      choice: selection.vote ?? 'yes',
      endDate,
      id: predictionId || `selection-${index}`,
      odds: Number(selection.odds) || 1,
      question: questionRow?.title ?? 'Soru bulunamadı',
      questionId,
      questionImage: questionRow?.image_url ?? null,
      result,
    };
  });

  // Frontend'de görüntülenecek status (süre mantığını dikkate alır)
  const displayStatus = computeCouponDisplayStatus(predictions);

  return {
    claimedReward: coupon.is_claimed || false,
    createdAt: new Date(coupon.created_at),
    id: coupon.display_id ?? parseInt(coupon.id) ?? 0,
    investmentAmount: coupon.stake_amount || 0,
    potentialEarnings: coupon.potential_win || 0,
    predictions,
    rawId: coupon.id, // Gerçek UUID - claim için kullanılacak
    status: displayStatus,
    totalOdds: coupon.total_odds || 1,
    username: coupon.username || '@kullanici',
  };
}

/**
 * Backend kupon listesini frontend formatına dönüştürür
 */
export function mapBackendCouponsToFrontend(coupons: BackendCoupon[]): Coupon[] {
  return coupons.map(mapBackendCouponToFrontend);
}
