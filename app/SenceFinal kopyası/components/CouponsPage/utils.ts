import { Coupon } from './types';

export const mockCoupons: Coupon[] = [
  {
    id: 1,
    predictions: [
      { id: 1, question: "Bitcoin bu yıl 100.000 doları aşacak mı?", choice: 'yes', odds: 2.4, category: 'Kripto', result: 'pending' },
      { id: 2, question: "ChatGPT-5 2024'te çıkacak mı?", choice: 'yes', odds: 1.8, category: 'Teknoloji', result: 'pending' },
      { id: 3, question: "Türkiye Milli Takımı Avrupa Şampiyonası'nda finale kalacak mı?", choice: 'no', odds: 3.2, category: 'Spor', result: 'pending' }
    ],
    totalOdds: 13.82,
    potentialEarnings: 6910,
    status: 'live',
    createdAt: new Date(),
    claimedReward: false,
    username: '@mustafa_92',
    investmentAmount: 500
  },
  {
    id: 2,
    predictions: [
      { id: 4, question: "Apple Vision Pro Türkiye'ye bu yıl gelecek mi?", choice: 'yes', odds: 1.9, category: 'Teknoloji', result: 'won' },
      { id: 5, question: "Netflix abonelik fiyatları %50 artacak mı?", choice: 'yes', odds: 2.2, category: 'Teknoloji', result: 'won' }
    ],
    totalOdds: 4.18,
    potentialEarnings: 2090,
    status: 'won',
    createdAt: new Date(Date.now() - 86400000),
    claimedReward: false,
    username: '@mustafa_92',
    investmentAmount: 500
  },
  {
    id: 3,
    predictions: [
      { id: 6, question: "Tesla Model Y fiyatı düşecek mi?", choice: 'no', odds: 1.5, category: 'Finans', result: 'lost' },
      { id: 7, question: "Instagram Reels özelliği kaldırılacak mı?", choice: 'yes', odds: 4.2, category: 'Sosyal-Medya', result: 'lost' }
    ],
    totalOdds: 6.30,
    potentialEarnings: 3150,
    status: 'lost',
    createdAt: new Date(Date.now() - 172800000),
    claimedReward: false,
    username: '@mustafa_92',
    investmentAmount: 500
  }
];

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
    case 'live': return ['#E0E7FF', '#C7D2FE'];
    case 'won': return ['#D1FAE5', '#A7F3D0'];
    case 'lost': return ['#FEE2E2', '#FECACA'];
    default: return ['#F3F4F6', '#E5E7EB'];
  }
};

export const getStatusBorderColor = (status: 'live' | 'won' | 'lost'): string => {
  switch (status) {
    case 'live': return '#3B82F6';
    case 'won': return '#10B981';
    case 'lost': return '#EF4444';
    default: return '#E5E7EB';
  }
};

export const getStatusBadge = (status: 'live' | 'won' | 'lost') => {
  switch (status) {
    case 'live': return { text: '⏰ 7 gün 0 saat', color: '#3B82F6' };
    case 'won': return { text: '🎉 Kazandı', color: '#10B981' };
    case 'lost': return { text: '😞 Kaybetti', color: '#EF4444' };
    default: return { text: '', color: '#6B7280' };
  }
};

export const getModalGradientColors = (status: 'live' | 'won' | 'lost'): [string, string] => {
  switch (status) {
    case 'live': return ['#3B82F6', '#8B5CF6'];
    case 'won': return ['#10B981', '#059669'];
    case 'lost': return ['#EF4444', '#DC2626'];
    default: return ['#6B7280', '#4B5563'];
  }
};



