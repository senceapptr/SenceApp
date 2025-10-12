export const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'spor': return '#E0D4F7';
    case 'teknoloji': return '#DBEAFE';
    case 'sponsorlu': return '#D1FAE5';
    case 'kripto': return '#FEF3C7';
    case 'eğlence': return '#FFE4E1';
    default: return '#F3F4F6';
  }
};

export const formatTimeAgo = (timestamp: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'şimdi';
  if (diffInMinutes < 60) return `${diffInMinutes}dk`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}sa`;
  return `${Math.floor(diffInMinutes / 1440)}g`;
};

export const mockLeaguesData = [
  {
    id: 1,
    name: "Haftalık Spor Ligi",
    description: "Her hafta en popüler spor maçları ve olimpiyat etkinlikleri",
    category: "spor",
    categories: ["futbol", "basketbol", "tenis"],
    participants: 1247,
    maxParticipants: 2000,
    prize: "50,000 kredi",
    endDate: "7 gün",
    isJoined: false,
    creator: "sence_official",
    joinCost: 0,
    isFeatured: true,
    status: 'active' as const,
    isPrivate: false,
    pointSystem: "Her doğru tahmin için 100 puan kazanırsın. Yanlış tahminlerde 25 puan kaybedersin. Ardışık doğru tahminlerde bonus çarpanlar devreye girer: 3 doğru = 1.2x, 5 doğru = 1.5x, 10 doğru = 2x çarpan. Haftalık en yüksek puan alan kullanıcı özel rozet kazanır."
  },
  {
    id: 2,
    name: "Coca-Cola Ligi",
    description: "Coca-Cola sponsorluğunda mega turnuva ligi",
    category: "sponsorlu",
    categories: ["spor", "eğlence", "müzik"],
    participants: 3420,
    maxParticipants: 5000,
    prize: "100,000 kredi",
    endDate: "14 gün",
    isJoined: false,
    creator: "coca_cola_tr",
    joinCost: 500,
    isFeatured: true,
    status: 'active' as const,
    isPrivate: false,
    pointSystem: "Weighted scoring sistemi kullanılır. Kategoriye göre farklı puanlar: Spor tahminleri 100 puan, eğlence 80 puan, müzik 60 puan. Doğru tahmin oranınıza göre haftalık multiplier uygulanır."
  },
  {
    id: 3,
    name: "Kripto Klanı",
    description: "Bitcoin, Ethereum ve altcoin tahminleri",
    category: "kripto",
    categories: ["bitcoin", "ethereum", "altcoin"],
    participants: 234,
    maxParticipants: 500,
    prize: "25,000 kredi",
    endDate: "10 gün",
    isJoined: true,
    position: 12,
    creator: "crypto_master",
    joinCost: 1000,
    isFeatured: false,
    status: 'active' as const,
    isPrivate: false,
    pointSystem: "Kripto volatilitesine göre dinamik puanlama sistemi. Bitcoin tahminleri 150 puan, Ethereum 120 puan, altcoin tahminleri 100 puan değerinde. Market hareketlerine göre bonus puanlar hesaplanır."
  },
  {
    id: 4,
    name: "Tech Gurus",
    description: "Teknoloji şirketleri ve startup tahminleri",
    category: "teknoloji",
    categories: ["startups", "AI", "hardware"],
    participants: 567,
    maxParticipants: 1000,
    prize: "30,000 kredi",
    endDate: "5 gün",
    isJoined: true,
    position: 45,
    creator: "tech_insider",
    joinCost: 750,
    isFeatured: false,
    status: 'active' as const,
    isPrivate: false,
    pointSystem: "Teknoloji sektörü odaklı puanlama. Startup tahminleri 120 puan, AI gelişmeleri 100 puan, hardware lansmanları 80 puan. Doğru streak için bonus puanlar: 5+ doğru = +50 bonus."
  },
  {
    id: 5,
    name: "Netflix & Chill Liga",
    description: "Dizi, film ve platformlar hakkında tahminler",
    category: "eğlence",
    categories: ["dizi", "film", "platform"],
    participants: 890,
    maxParticipants: 1500,
    prize: "20,000 kredi",
    endDate: "Tamamlandı",
    isJoined: true,
    position: 8,
    creator: "film_uzmanı",
    joinCost: 500,
    isFeatured: false,
    status: 'completed' as const,
    isPrivate: false,
    pointSystem: "Eğlence sektörü puanlama sistemi. Dizi tahminleri 90 puan, film tahminleri 80 puan, platform gelişmeleri 70 puan değerinde."
  }
];

export const mockChatMessages = [
  {
    id: 1,
    username: "crypto_king",
    message: "Bitcoin bugün 100k'yı geçecek mi sizce?",
    timestamp: new Date(Date.now() - 300000),
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
  },
  {
    id: 2,
    username: "trend_hunter",
    message: "Kesinlikle geçer! Bugün güçlü bir ralliye sahip",
    timestamp: new Date(Date.now() - 240000),
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face"
  },
  {
    id: 3,
    username: "market_wizard",
    message: "Ben tam tersi düşünüyorum, düşüş olacak",
    timestamp: new Date(Date.now() - 180000),
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face"
  }
];

export const mockLeaderboardData = Array.from({ length: 50 }, (_, i) => {
  const isCurrentUser = i === 11;
  return {
    rank: i + 1,
    username: isCurrentUser ? 'mustafa_92' : `user_${i + 1}`,
    points: 3500 - (i * 50),
    streak: Math.max(1, 15 - i),
    correctPredictions: 90 - i,
    totalPredictions: 100,
    avatar: `https://images.unsplash.com/photo-${1472099645785 + i}?w=40&h=40&fit=crop&crop=face`,
    isCurrentUser
  };
});

export const mockCurrentUser = {
  username: 'mustafa_92',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face',
  joinedLeagues: 3,
  maxLeagues: 5,
  credits: 8500,
  tickets: 2
};

