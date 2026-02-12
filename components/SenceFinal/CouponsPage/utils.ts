import { Coupon, CouponStatus, PredictionResult } from './types';

const LIVE_BLUE = '#256EFF';

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

export const getStatusColor = (status: CouponStatus | 'live'): [string, string] => {
  switch (status) {
    case 'pending':
    case 'live':
      return ['#1A2D52', '#14233F'];
    case 'won':
      return ['#0D1A12', '#132016'];
    case 'lost':
      return ['#190D0D', '#221212'];
    case 'cancelled':
      return ['#1F2937', '#111827'];
    default:
      return ['#1A2D52', '#14233F'];
  }
};

export const getStatusBorderColor = (status: CouponStatus | 'live'): string => {
  switch (status) {
    case 'pending':
    case 'live':
      return LIVE_BLUE;
    case 'won':
      return '#086347';
    case 'lost':
      return '#7D1F1F';
    case 'cancelled':
      return '#6B7280';
    default:
      return LIVE_BLUE;
  }
};

/**
 * Kalan süreyi her zaman 2 birimli formatta döndür
 * - Gün varsa: "X gün Y saat"
 * - Gün yoksa saat varsa: "X saat Y dakika"
 * - Saat yoksa: "X dakika Y saniye"
 */
export const calculateTimeRemaining = (endDate: Date): string => {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();

  if (diff <= 0) return 'Yakında Açıklanacak';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Her zaman 2 birim göster
  if (days > 0) return `${days} gün ${hours} saat`;
  if (hours > 0) return `${hours} saat ${minutes} dakika`;
  return `${minutes} dakika ${seconds} saniye`;
};

/** Henüz sonuçlanmamış (pending) tahminlerden en geç bitiş tarihini bul */
export const getLatestPendingEndDate = (
  predictions: { result?: PredictionResult; endDate?: Date | null }[],
): Date | null => {
  if (!predictions || predictions.length === 0) return null;
  const pending = predictions.filter(p => (p.result ?? 'pending') === 'pending');
  const validEndDates = pending
    .map(p => p.endDate)
    .filter((endDate): endDate is Date => endDate instanceof Date && !isNaN(endDate.getTime()));
  if (validEndDates.length === 0) return null;
  return new Date(Math.max(...validEndDates.map(d => d.getTime())));
};

/**
 * Status badge metni ve rengi
 * Emoji'ler kaldırıldı
 */
export const getStatusBadge = (
  status: CouponStatus | 'live',
  predictions?: { result?: PredictionResult; endDate?: Date | null }[],
) => {
  switch (status) {
    case 'pending':
    case 'live':
      if (predictions && predictions.length > 0) {
        const latestEndDate = getLatestPendingEndDate(predictions);
        if (latestEndDate) {
          const timeRemaining = calculateTimeRemaining(latestEndDate);
          return { text: timeRemaining, color: LIVE_BLUE };
        }
      }
      return { text: 'Bekliyor', color: LIVE_BLUE };
    case 'won':
      return { text: 'Kazandı', color: '#086347' };
    case 'lost':
      return { text: 'Kaybetti', color: '#7D1F1F' };
    case 'cancelled':
      return { text: 'İptal', color: '#6B7280' };
    default:
      return { text: 'Bekliyor', color: LIVE_BLUE };
  }
};

export const getModalGradientColors = (status: CouponStatus | 'live'): [string, string] => {
  switch (status) {
    case 'pending':
    case 'live':
      return [LIVE_BLUE, '#1D5EDB'];
    case 'won':
      return ['#03412F', '#033527'];
    case 'lost':
      return ['#681818', '#531313'];
    case 'cancelled':
      return ['#4B5563', '#374151'];
    default:
      return [LIVE_BLUE, '#1D5EDB'];
  }
};
