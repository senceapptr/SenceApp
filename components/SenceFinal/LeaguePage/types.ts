import type { LeagueIconName } from './shared/leagueIcons';

export interface League {
  id: string;
  name: string;
  icon: string;
  prize: string;
  endDate: string;
  creator: string;
  category: string;
  joinCost: number;
  isJoined: boolean;
  creatorId?: string;
  description: string;
  isPrivate?: boolean;
  pointSystem: string;
  categories: string[];
  participants: number;
  isFeatured?: boolean;
  maxParticipants: number;
  position?: number | null;
  leagueIconColor?: string;
  endDateISO?: string | null;
  status?: 'active' | 'completed';
  leagueIconName?: LeagueIconName;
}

export interface ChatMessage {
  id: number;
  avatar: string;
  message: string;
  timestamp: Date;
  username: string;
}

export interface LeaderboardUser {
  rank: number;
  points: number;
  streak: number;
  avatar: string;
  username: string;
  isCurrentUser: boolean;
  isPlaceholder?: boolean;
  totalPredictions: number;
  correctPredictions: number;
}

export interface Question {
  id: string;
  text: string;
  noOdds: number;
  endDate: string;
  yesOdds: number;
  category: string;
  totalVotes: number;
  noPercentage: number;
  isTrending?: boolean;
  categoryEmoji: string;
  yesPercentage: number;
  userVote?: 'yes' | 'no' | null;
}

export interface User {
  avatar: string;
  credits: number;
  tickets: number;
  username: string;
  maxLeagues: number;
  joinedLeagues: number;
}

export interface LeagueConfig {
  name: string;
  icon: string;
  endDate: Date;
  joinCost: number;
  isPrivate: boolean;
  description: string;
  categories: string[];
  maxParticipants: number;
}

export type TabType = 'discover' | 'my-leagues' | 'create';

export interface LeagueVote {
  id: string;
  odds: number;
  createdAt: string;
  questionId: string;
  pointsEarned: number;
  vote: 'yes' | 'no' | 'skip';
  status: 'pending' | 'won' | 'lost' | 'skipped';
}
