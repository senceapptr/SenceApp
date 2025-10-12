export interface Question {
  id: number;
  title: string;
  image: string;
  gradient?: string;
  yesPercentage: number;
  votes: string;
  timeLeft: string;
  category: string;
  description?: string;
  yesOdds: number;
  noOdds: number;
  boostedYesOdds?: number;
  boostedNoOdds?: number;
}

export interface CouponSelection {
  id: number;
  title: string;
  vote: 'yes' | 'no';
  odds: number;
}

export interface UserStats {
  gameCredits: number;
  userCoins: number;
  dailyStreak: number;
  userLevel: number;
  dailyPredictions: number;
  yesterdayResults: {
    correct: number;
    total: number;
  };
}

export type AuthScreen = 'welcome' | 'login' | 'signup';
export type AppPage = 'home' | 'predict' | 'search' | 'my-bets' | 'league' | 'edit-profile' | 'settings' | 'notifications' | 'trivia';

export interface AppState {
  // Authentication
  isAuthenticated: boolean;
  authScreen: AuthScreen;
  
  // Navigation
  currentPage: AppPage;
  
  // UI State
  profileDrawerOpen: boolean;
  questionDetailOpen: boolean;
  couponDrawerOpen: boolean;
  notificationsOpen: boolean;
  
  // Data
  selectedQuestion: Question | null;
  couponSelections: CouponSelection[];
  selectedCategory: string;
  
  // User Stats
  hasNotifications: boolean;
  userStats: UserStats;
} 