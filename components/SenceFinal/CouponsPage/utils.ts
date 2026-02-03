import { Coupon, CouponStatus, PredictionResult } from './types';

export const calculateStatistics = (coupons: Coupon[]) => {
  const totalCoupons = coupons.length;
  const pendingCoupons = coupons.filter(c => c.status === 'pending').length;
  const wonCoupons = coupons.filter(c => c.status === 'won').length;
  const lostCoupons = coupons.filter(c => c.status === 'lost').length;
  const cancelledCoupons = coupons.filter(c => c.status === 'cancelled').length;
  const totalEarnings = coupons.filter(c => c.status === 'won').reduce((sum, c) => sum + c.potentialEarnings, 0);
  const totalLost = coupons.filter(c => c.status === 'lost').reduce((sum, c) => sum + (c.investmentAmount || 0), 0);

  return {
    totalCoupons,
    pendingCoupons,
    wonCoupons,
    lostCoupons,
    cancelledCoupons,
    totalEarnings,
    totalLost,
  };
};

/** Tahmin sonuçlarına göre kupon statusunu hesapla */
export function computeCouponStatus(predictions: { result?: PredictionResult }[]): CouponStatus {
  if (!predictions || predictions.length === 0) return 'pending';
  const results = predictions.map(p => p.result ?? 'pending');
  if (results.some(r => r === 'lost')) return 'lost';
  if (results.every(r => r === 'cancelled')) return 'cancelled';
  if (results.every(r => r === 'won')) return 'won';
  return 'pending';
}

export const getStatusColor = (status: CouponStatus | 'live'): [string, string] => {
  switch (status) {
    case 'pending': case 'live': return ['#21262D', '#1A1F2A'];
    case 'won': return ['#1A2E1A', '#243524'];
    case 'lost': return ['#2E1A1A', '#352424'];
    case 'cancelled': return ['#1F2937', '#111827'];
    default: return ['#21262D', '#1A1F2A'];
  }
};

export const getStatusBorderColor = (status: CouponStatus | 'live'): string => {
  switch (status) {
    case 'pending': case 'live': return '#30363D';
    case 'won': return '#10B981';
    case 'lost': return '#DC2626';
    case 'cancelled': return '#6B7280';
    default: return '#30363D';
  }
};

/** Kalan süreyi "X gün Y saat Z dakika" formatında döndür */
export const calculateTimeRemaining = (endDate: Date): string => {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();

  if (diff <= 0) return 'Sona Erdi';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} gün`);
  if (hours > 0) parts.push(`${hours} saat`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes} dakika`);
  return parts.join(' ');
};

/** Henüz sonuçlanmamış (pending) tahminlerden en geç bitiş tarihini bul */
export const getLatestPendingEndDate = (predictions: { result?: PredictionResult; endDate?: Date | null }[]): Date | null => {
  if (!predictions || predictions.length === 0) return null;
  const pending = predictions.filter(p => (p.result ?? 'pending') === 'pending');
  const validEndDates = pending
    .map(p => p.endDate)
    .filter((endDate): endDate is Date => endDate instanceof Date && !isNaN(endDate.getTime()));
  if (validEndDates.length === 0) return null;
  return new Date(Math.max(...validEndDates.map(d => d.getTime())));
};

export const getStatusBadge = (status: CouponStatus | 'live', predictions?: { result?: PredictionResult; endDate?: Date | null }[]) => {
  switch (status) {
    case 'pending': case 'live':
      if (predictions && predictions.length > 0) {
        const latestEndDate = getLatestPendingEndDate(predictions);
        if (latestEndDate) {
          const timeRemaining = calculateTimeRemaining(latestEndDate);
          return { text: `⏰ ${timeRemaining}`, color: '#8B5CF6' };
        }
      }
      return { text: '⏰ Bekliyor', color: '#8B5CF6' };
    case 'won': return { text: '🎉 Kazandı', color: '#10B981' };
    case 'lost': return { text: '😞 Kaybetti', color: '#DC2626' };
    case 'cancelled': return { text: '🚫 İptal', color: '#6B7280' };
    default: return { text: '⏰ Bekliyor', color: '#8B5CF6' };
  }
};

export const getModalGradientColors = (status: CouponStatus | 'live'): [string, string] => {
  switch (status) {
    case 'pending': case 'live': return ['#8B5CF6', '#A855F7'];
    case 'won': return ['#047857', '#065f46'];
    case 'lost': return ['#B91C1C', '#991B1B'];
    case 'cancelled': return ['#4B5563', '#374151'];
    default: return ['#8B5CF6', '#A855F7'];
  }
};



