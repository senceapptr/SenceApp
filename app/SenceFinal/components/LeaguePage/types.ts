export interface League {
  id: string;
  name: string;
  description: string;
  category: string;
  categories: string[];
  icon: string;
  participants: number;
  maxParticipants: number;
  prize: string;
  endDate: string;
  isJoined: boolean;
  position?: number;
  creator: string;
  joinCost: number;
  isFeatured?: boolean;
  status?: 'active' | 'completed';
  isPrivate?: boolean;
  pointSystem: string;
}

export interface ChatMessage {
  id: number;
  username: string;
  message: string;
  timestamp: Date;
  avatar: string;
}

export interface LeaderboardUser {
  rank: number;
  username: string;
  points: number;
  streak: number;
  correctPredictions: number;
  totalPredictions: number;
  avatar: string;
  isCurrentUser: boolean;
}

export interface Question {
  id: string;
  text: string;
  category: string;
  categoryEmoji: string;
  endDate: string;
  yesOdds: number;
  noOdds: number;
  totalVotes: number;
  yesPercentage: number;
  noPercentage: number;
  userVote?: 'yes' | 'no' | null;
  isTrending?: boolean;
}

export interface User {
  username: string;
  avatar: string;
  joinedLeagues: number;
  maxLeagues: number;
  credits: number;
  tickets: number;
}

export interface LeagueConfig {
  name: string;
  description: string;
  icon: string;
  maxParticipants: number;
  endDate: Date;
  isPrivate: boolean;
  categories: string[];
  joinCost: number;
}

export type TabType = 'discover' | 'my-leagues' | 'create';

