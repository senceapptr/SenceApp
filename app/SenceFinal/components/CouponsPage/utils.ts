import { Coupon } from './types';

export const calculateStatistics = (coupons: Coupon[]) => {
  const totalCoupons = coupons.length;
  const liveCoupons = coupons.filter(c => c.status === 'live').length;
  const wonCoupons = coupons.filter(c => c.status === 'won').length;
  const lostCoupons = coupons.filter(c => c.status === 'lost').length;
  const totalEarnings = coupons.filter(c => c.status === 'won').reduce((sum, c) => sum + c.potentialEarnings, 0);
  const totalLost = coupons.filter(c => c.status === 'lost').reduce((sum, c) => sum + (c.investmentAmount || 0), 0);

  return {
    totalCoupons,
    liveCoupons,
    wonCoupons,
    lostCoupons,
    totalEarnings,
    totalLost,
  };
};

export const getStatusColor = (status: 'live' | 'won' | 'lost'): [string, string] => {
  switch (status) {
    case 'live': return ['#21262D', '#1A1F2A']; // Koyu - Bekleyen
    case 'won': return ['#1A2E1A', '#243524']; // Koyu yeşil - Kazanan
    case 'lost': return ['#2E1A1A', '#352424']; // Koyu kırmızı - Kaybeden
    default: return ['#21262D', '#1A1F2A']; // Varsayılan olarak koyu (bekleyen)
  }
};

export const getStatusBorderColor = (status: 'live' | 'won' | 'lost'): string => {
  switch (status) {
    case 'live': return '#30363D'; // Koyu border
    case 'won': return '#10B981'; // Yeşil border
    case 'lost': return '#DC2626'; // Kırmızı border
    default: return '#30363D'; // Varsayılan olarak koyu
  }
};

// Kalan süreyi hesapla
export const calculateTimeRemaining = (endDate: Date): string => {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  
  if (diff <= 0) {
    return 'Sona Erdi';
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  if (days > 0) {
    return `${days}g ${hours}s`;
  } else if (hours > 0) {
    return `${hours}s ${minutes}d`;
  } else if (minutes > 0) {
    return `${minutes}d ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

// Ticket içerisindeki en son sonuçlanacak sorunun tarihini bul
export const getLatestEndDate = (predictions: any[]): Date | null => {
  if (!predictions || predictions.length === 0) return null;
  
  // Gerçek end_date'leri kullan
  const validEndDates = predictions
    .map(prediction => prediction.endDate)
    .filter(endDate => endDate instanceof Date && !isNaN(endDate.getTime()));
  
  if (validEndDates.length === 0) {
    // Eğer hiç end_date yoksa mock data oluştur
    const now = new Date();
    const randomDays = Math.floor(Math.random() * 3) + 2; // 2-4 gün
    return new Date(now.getTime() + (randomDays * 24 * 60 * 60 * 1000));
  }
  
  // En son sonuçlanacak sorunun tarihini bul
  return new Date(Math.max(...validEndDates.map(date => date.getTime())));
};

export const getStatusBadge = (status: 'live' | 'won' | 'lost', predictions?: any[]) => {
  switch (status) {
    case 'live': 
      if (predictions && predictions.length > 0) {
        const latestEndDate = getLatestEndDate(predictions);
        if (latestEndDate) {
          const timeRemaining = calculateTimeRemaining(latestEndDate);
          return { text: `⏰ ${timeRemaining}`, color: '#8B5CF6' };
        }
      }
      return { text: '⏰ Bekliyor', color: '#10B981' };
    case 'won': return { text: '🎉 Kazandı', color: '#10B981' };
    case 'lost': return { text: '😞 Kaybetti', color: '#DC2626' };
    default: return { text: '⏰ Bekliyor', color: '#10B981' };
  }
};

export const getModalGradientColors = (status: 'live' | 'won' | 'lost'): [string, string] => {
  switch (status) {
    case 'live': return ['#8B5CF6', '#A855F7']; // Mor gradient
    case 'won': return ['#047857', '#065f46']; // Yeşil gradient
    case 'lost': return ['#B91C1C', '#991B1B']; // Kırmızı gradient
    default: return ['#8B5CF6', '#A855F7']; // Varsayılan olarak mor
  }
};



