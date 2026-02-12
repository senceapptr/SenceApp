/**
 * Coupon Mapper
 * Backend'den gelen ham veriyi frontend tipine dönüştürür
 */

import { Coupon, CouponPrediction, PredictionResult } from './types';

interface BackendSelection {
    id: string;
    question_id: string;
    vote: 'yes' | 'no';
    odds: number;
    status: 'pending' | 'won' | 'lost' | 'cancelled';
    questions?: {
        id: string;
        title: string;
        category_id?: string;
        status?: string;
        result?: string;
        end_date?: string;
        categories?: { name: string } | null;
    } | null;
}

interface BackendCoupon {
    id: string;
    display_id?: number;
    user_id: string;
    coupon_code?: string;
    total_odds: number;
    stake_amount: number;
    potential_win: number;
    status: 'pending' | 'won' | 'lost' | 'partially_won' | 'cancelled';
    selections_count?: number;
    correct_selections?: number;
    created_at: string;
    resolved_at?: string | null;
    is_claimed?: boolean;
    coupon_selections?: BackendSelection[];
    couponSelections?: BackendSelection[];
    selections?: BackendSelection[];
    username?: string;
}

/**
 * Tahmin sonucunu hesaplar
 * ÖNEMLİ: Soru süresi bitmeden sonuç gösterilmez
 */
function computePredictionResult(
    selectionStatus: string,
    questionEndDate: Date | null
): PredictionResult {
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
export function computeCouponDisplayStatus(predictions: { result?: PredictionResult }[]): 'pending' | 'won' | 'lost' | 'cancelled' {
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
        coupon.coupon_selections ??
        coupon.couponSelections ??
        (Array.isArray(coupon.selections) ? coupon.selections : []);

    const selections = Array.isArray(rawSelections) ? rawSelections : [];

    const predictions: CouponPrediction[] = selections.map((selection, index) => {
        const questionRow = selection.questions;
        const predictionId = String(selection.id || '').trim();
        const questionId = String(selection.question_id || questionRow?.id || '').trim();

        const categoryName =
            questionRow?.categories?.name ??
            'Genel';

        const endDate = questionRow?.end_date
            ? new Date(questionRow.end_date)
            : null;

        const result = computePredictionResult(selection.status, endDate);

        return {
            id: predictionId || `selection-${index}`,
            questionId,
            question: questionRow?.title ?? 'Soru bulunamadı',
            choice: selection.vote ?? 'yes',
            odds: Number(selection.odds) || 1,
            category: categoryName,
            result,
            endDate
        };
    });

    // Frontend'de görüntülenecek status (süre mantığını dikkate alır)
    const displayStatus = computeCouponDisplayStatus(predictions);

    return {
        id: coupon.display_id ?? parseInt(coupon.id) ?? 0,
        rawId: coupon.id, // Gerçek UUID - claim için kullanılacak
        predictions,
        totalOdds: coupon.total_odds || 1,
        potentialEarnings: coupon.potential_win || 0,
        status: displayStatus,
        createdAt: new Date(coupon.created_at),
        claimedReward: coupon.is_claimed || false,
        username: coupon.username || '@kullanici',
        investmentAmount: coupon.stake_amount || 0,
    };
}

/**
 * Backend kupon listesini frontend formatına dönüştürür
 */
export function mapBackendCouponsToFrontend(coupons: BackendCoupon[]): Coupon[] {
    return coupons.map(mapBackendCouponToFrontend);
}
