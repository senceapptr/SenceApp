import { ProfileData, Prediction, Badge, CreditHistoryItem, AnimationConstants } from './types';

// Animation constants
export const ANIMATION_CONSTANTS: AnimationConstants = {
  HEADER_MAX_HEIGHT: 280,
  HEADER_MIN_HEIGHT: 100,
  PROFILE_IMAGE_SIZE: 80,
  PROFILE_IMAGE_SIZE_SMALL: 32,
};

// Color utilities
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'won': return '#34C759';
    case 'lost': return '#FF3B30';
    case 'pending': return '#C9F158';
    default: return '#F2F3F5';
  }
};

export const getBadgeColors = (rarity: string, earned: boolean): [string, string] => {
  if (!earned) return ['rgba(53,56,49,0.2)', 'rgba(53,56,49,0.3)'];
  
  switch (rarity) {
    case 'common': return ['#F2F3F5', '#F2F3F5'];
    case 'rare': return ['#C9F158', '#C9F158'];
    case 'epic': return ['#432870', '#B29EFD'];
    case 'legendary': return ['#B29EFD', '#432870'];
    default: return ['#F2F3F5', '#F2F3F5'];
  }
};

// Mock data
export const profileData: ProfileData = {
  name: "Ahmet Kaya",
  username: "@ahmetkaya",
  bio: "Spor tahminlerinde uzmanım. Futbol, basketbol ve tenis maçlarından kazanç sağlıyorum. Takip et ve birlikte kazanalım! 🎯",
  profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  predictions: 124,
  followers: 892,
  following: 156,
  credits: 2850,
  isFollowing: false
};

export const mockPredictions: Prediction[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=150&h=150&fit=crop",
    question: "Galatasaray maçı kazanır mı?",
    selectedOption: "EVET",
    odds: 1.85,
    status: "won"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=150&fit=crop",
    question: "Lakers maçında toplam sayı 210+ olur mu?",
    selectedOption: "HAYIR",
    odds: 2.10,
    status: "lost"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=150&h=150&fit=crop",
    question: "Bitcoin bugün 50k$ üzerine çıkar mı?",
    selectedOption: "EVET",
    odds: 3.25,
    status: "pending"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=150&h=150&fit=crop",
    question: "Fenerbahçe ilk yarıda gol atar mı?",
    selectedOption: "EVET",
    odds: 1.75,
    status: "won"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=150&h=150&fit=crop",
    question: "Hava yarın yağmurlu olacak mı?",
    selectedOption: "HAYIR",
    odds: 1.90,
    status: "pending"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=150&h=150&fit=crop",
    question: "Real Madrid Şampiyonlar Ligi kazanır mı?",
    selectedOption: "EVET",
    odds: 2.75,
    status: "won"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=150&fit=crop",
    question: "Barcelona La Liga'da şampiyon olur mu?",
    selectedOption: "EVET",
    odds: 2.15,
    status: "pending"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=150&h=150&fit=crop",
    question: "Ethereum bu hafta 3000$ üzerine çıkar mı?",
    selectedOption: "HAYIR",
    odds: 1.95,
    status: "pending"
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=150&h=150&fit=crop",
    question: "Beşiktaş deplasmanda gol atar mı?",
    selectedOption: "EVET",
    odds: 1.65,
    status: "pending"
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=150&h=150&fit=crop",
    question: "Yarın güneşli olacak mı?",
    selectedOption: "EVET",
    odds: 1.45,
    status: "pending"
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=150&fit=crop",
    question: "Golden State Warriors playoff'a kalır mı?",
    selectedOption: "HAYIR",
    odds: 2.8,
    status: "pending"
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=150&h=150&fit=crop",
    question: "Tesla hissesi 200$ altına düşer mi?",
    selectedOption: "EVET",
    odds: 3.1,
    status: "pending"
  },
  {
    id: 13,
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=150&h=150&fit=crop",
    question: "Trabzonspor kupayı kazanır mı?",
    selectedOption: "HAYIR",
    odds: 2.25,
    status: "pending"
  },
  {
    id: 14,
    image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=150&h=150&fit=crop",
    question: "Bu hafta kar yağacak mı?",
    selectedOption: "EVET",
    odds: 1.75,
    status: "pending"
  },
  {
    id: 15,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=150&fit=crop",
    question: "Miami Heat final oynar mı?",
    selectedOption: "HAYIR",
    odds: 2.9,
    status: "pending"
  },
  {
    id: 16,
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=150&h=150&fit=crop",
    question: "Apple hissesi 150$ üzerine çıkar mı?",
    selectedOption: "EVET",
    odds: 2.4,
    status: "pending"
  },
  {
    id: 17,
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=150&h=150&fit=crop",
    question: "Konyaspor ligde kalır mı?",
    selectedOption: "EVET",
    odds: 1.55,
    status: "pending"
  },
  {
    id: 18,
    image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=150&h=150&fit=crop",
    question: "Gece yağmur yağacak mı?",
    selectedOption: "HAYIR",
    odds: 1.85,
    status: "pending"
  },
  {
    id: 19,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=150&fit=crop",
    question: "Boston Celtics şampiyon olur mu?",
    selectedOption: "EVET",
    odds: 3.2,
    status: "pending"
  },
  {
    id: 20,
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=150&h=150&fit=crop",
    question: "Netflix hissesi 400$ üzerine çıkar mı?",
    selectedOption: "HAYIR",
    odds: 2.7,
    status: "pending"
  }
];

export const creditHistory: CreditHistoryItem[] = [
  { day: 'Pzt', credits: 2200 },
  { day: 'Sal', credits: 2350 },
  { day: 'Çar', credits: 2100 },
  { day: 'Per', credits: 2600 },
  { day: 'Cum', credits: 2850 },
  { day: 'Cmt', credits: 2750 },
  { day: 'Paz', credits: 2850 }
];

export const badges: Badge[] = [
  {
    id: 1,
    name: "İlk Tahmin",
    description: "İlk tahminini yaptın!",
    icon: "🎯",
    earned: true,
    rarity: "common"
  },
  {
    id: 2,
    name: "Seri Kazanan",
    description: "5 tahmin üst üste kazandın!",
    icon: "🔥",
    earned: true,
    rarity: "rare"
  },
  {
    id: 3,
    name: "Yüksek Oran",
    description: "3.0+ oranı tutturdun!",
    icon: "💎",
    earned: true,
    rarity: "epic"
  },
  {
    id: 4,
    name: "Sosyal Kelebek",
    description: "50+ kişiyi takip ettin!",
    icon: "🦋",
    earned: true,
    rarity: "rare"
  },
  {
    id: 5,
    name: "Milyoner",
    description: "1000+ kredi kazandın!",
    icon: "💰",
    earned: false,
    rarity: "legendary"
  },
  {
    id: 6,
    name: "Guru",
    description: "100+ tahmin yaptın!",
    icon: "🧠",
    earned: true,
    rarity: "epic"
  }
];


