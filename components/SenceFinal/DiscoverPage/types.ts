export type FilterType = 'all' | 'trending' | 'high-odds' | 'ending-soon';

export interface DiscoverCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
}

export interface DiscoverQuestion {
  id: string;
  title: string;
  description?: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    color: string;
  };
  votes: number;
  timeLeft: string;
  yesOdds: number;
  noOdds: number;
  yesPercentage: number;
  image: string;
  end_date: string;
  total_amount: number;
  is_trending: boolean;
  is_featured: boolean;
}

export interface DiscoverPageProps {
  onBack: () => void;
  onMenuToggle: () => void;
  handleQuestionDetail: (questionId: string, sourceCategory?: any) => void;
  handleVote: (questionId: string, vote: 'yes' | 'no', odds: number) => void;
}
