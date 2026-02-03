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

// Mock data kaldırıldı - artık backend'den geliyor

// Mock chat messages kaldırıldı - artık backend'den geliyor

// Mock leaderboard data kaldırıldı - artık backend'den geliyor

export const mockCurrentUser = {
  username: 'mustafa_92',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face',
  joinedLeagues: 3,
  maxLeagues: 5,
  credits: 8500,
  tickets: 2
};

