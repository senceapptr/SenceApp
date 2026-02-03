import { FeaturedQuestion, ActiveCoupon, TrendQuestion } from './types';

export const formatVotes = (count: number) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}k`;
  return count.toString();
};

export const mockFeaturedQuestions: FeaturedQuestion[] = [
  {
    id: 1,
    title: "ChatGPT-5 bu yıl içinde çıkacak mı?",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    votes: 127000,
    timeLeft: "2 gün 14 saat",
    category: "Teknoloji",
    yesOdds: 2.4,
    noOdds: 1.6,
    dominantColor: "#4F46E5"
  },
  {
    id: 2,
    title: "Türkiye Milli Takımı Euro 2024'te finale kalacak mı?",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
    votes: 89000,
    timeLeft: "3 gün 12 saat",
    category: "Spor",
    yesOdds: 3.2,
    noOdds: 1.8,
    dominantColor: "#059669"
  },
  {
    id: 3,
    title: "Bitcoin 2024 sonunda 100.000 doları aşacak mı?",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop",
    votes: 234000,
    timeLeft: "5 gün 8 saat",
    category: "Ekonomi",
    yesOdds: 2.1,
    noOdds: 2.0,
    dominantColor: "#F59E0B"
  },
  {
    id: 4,
    title: "Apple Vision Pro 2024'te Türkiye'ye gelecek mi?",
    image: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&h=600&fit=crop",
    votes: 156000,
    timeLeft: "1 gün 8 saat",
    category: "Teknoloji",
    yesOdds: 1.9,
    noOdds: 2.1,
    dominantColor: "#6366F1"
  },
  {
    id: 5,
    title: "İstanbul'da emlak fiyatları bu yıl %30 daha artacak mı?",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
    votes: 445000,
    timeLeft: "4 gün 6 saat",
    category: "Ekonomi",
    yesOdds: 2.8,
    noOdds: 1.6,
    dominantColor: "#DC2626"
  }
];

export const mockActiveCoupons: ActiveCoupon[] = [
  {
    id: 1,
    name: "Kupon #100",
    questionCount: 5,
    totalOdds: 12.8,
    potentialWinnings: 2560,
    endsIn: "2g 14s",
    colors: ["#432870", "#5A3A8B"],
    predictions: [
      { id: 1, questionId: 1, question: "Bitcoin bu yıl 100.000 doları aşacak mı?", choice: 'yes', odds: 2.4, category: 'Kripto', result: 'pending' },
      { id: 2, questionId: 2, question: "ChatGPT-5 2024'te çıkacak mı?", choice: 'yes', odds: 1.8, category: 'Teknoloji', result: 'pending' },
      { id: 3, questionId: 3, question: "Türkiye Milli Takımı Avrupa Şampiyonası'nda finale kalacak mı?", choice: 'no', odds: 3.2, category: 'Spor', result: 'pending' }
    ],
    username: '@mustafa_92',
    investmentAmount: 500,
    status: 'live'
  },
  {
    id: 2,
    name: "Kupon #101",
    questionCount: 3,
    totalOdds: 6.4,
    potentialWinnings: 1280,
    endsIn: "5s 8d",
    colors: ["#134E4A", "#0F766E"],
    predictions: [
      { id: 4, questionId: 4, question: "Apple Vision Pro Türkiye'ye bu yıl gelecek mi?", choice: 'yes', odds: 1.9, category: 'Teknoloji', result: 'won' },
      { id: 5, questionId: 5, question: "Netflix abonelik fiyatları %50 artacak mı?", choice: 'yes', odds: 2.2, category: 'Teknoloji', result: 'won' }
    ],
    username: '@mustafa_92',
    investmentAmount: 500,
    status: 'won'
  },
  {
    id: 3,
    name: "Kupon #102",
    questionCount: 8,
    totalOdds: 24.6,
    potentialWinnings: 4920,
    endsIn: "1g 12s",
    colors: ["#DC2626", "#B91C1C"],
    predictions: [
      { id: 6, questionId: 6, question: "Tesla Model Y fiyatı düşecek mi?", choice: 'no', odds: 1.5, category: 'Finans', result: 'lost' },
      { id: 7, questionId: 7, question: "Instagram Reels özelliği kaldırılacak mı?", choice: 'yes', odds: 4.2, category: 'Sosyal-Medya', result: 'lost' }
    ],
    username: '@mustafa_92',
    investmentAmount: 500,
    status: 'lost'
  }
];

export const mockTrendQuestions: TrendQuestion[] = [
  {
    id: 6,
    title: "Netflix Türkiye'de abonelik fiyatları %50 artacak mı?",
    category: "Teknoloji",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
    votes: 89400,
    timeLeft: "3 gün 12 saat",
    yesOdds: 2.8,
    noOdds: 1.6,
    yesPercentage: 68
  },
  {
    id: 7,
    title: "Yapay zeka 2024 sonuna kadar %25 işsizlik artışına sebep olacak mı?",
    category: "Teknoloji",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop",
    votes: 156000,
    timeLeft: "1 gün 8 saat",
    yesOdds: 3.2,
    noOdds: 1.4,
    yesPercentage: 78
  },
  {
    id: 8,
    title: "Türkiye'de enflasyon 2024 sonunda %20'nin altına düşecek mi?",
    category: "Ekonomi",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
    votes: 234000,
    timeLeft: "5 gün 2 saat",
    yesOdds: 2.1,
    noOdds: 1.9,
    yesPercentage: 45
  },
  {
    id: 9,
    title: "Galatasaray bu sezon şampiyon olacak mı?",
    category: "Spor",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop",
    votes: 445000,
    timeLeft: "2 gün 18 saat",
    yesOdds: 1.8,
    noOdds: 2.2,
    yesPercentage: 55
  }
];








