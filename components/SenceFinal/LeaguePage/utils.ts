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

