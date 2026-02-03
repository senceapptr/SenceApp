export interface QuestionDetailPageV2Props {
  onBack: () => void;
  onMenuToggle: () => void;
  question: any;
  onVote: (questionId: string, vote: 'yes' | 'no', odds: number, questionTitle?: string) => void;
  sourceCategory?: any;
}

export interface RelatedQuestion {
  id: number;
  title: string;
  category: string;
  image: string;
  daysLeft: number;
  odds: number;
  rating: number;
  votes: number;
  isFavorite: boolean;
}

export interface Comment {
  id: number;
  username: string;
  avatar: string;
  text: string;
  timestamp: Date;
  likes: number;
}

export interface TopInvestor {
  username: string;
  avatar: string;
  amount: number;
  vote: 'yes' | 'no';
}

export interface MainQuestion {
  title: string;
  category: string;
  categoryIcon: string;
  image: string;
  description: string;
  fullDescription: string;
  rating: number;
  totalVotes: number;
  yesPercentage: number;
  noPercentage: number;
  yesOdds: number;
  noOdds: number;
  publishedAt: Date;
  endDate: string;
  daysLeft: number;
  creator: {
    id: string | null;
    username: string;
    avatar: string;
  };
  totalPool: number;
  yesInvestment: number;
  noInvestment: number;
  result?: 'yes' | 'no' | null;
  status?: string;
}

export type TabType = 'details' | 'comments' | 'stats';
