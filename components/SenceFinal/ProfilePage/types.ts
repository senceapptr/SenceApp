export interface ProfileData {
  bio: string;
  name: string;
  credits: number;
  username: string;
  followers: number;
  following: number;
  coverImage: string;
  predictions: number;
  profileImage: string;
  isFollowing: boolean;
}

export interface Prediction {
  id: number;
  odds: number;
  image: string;
  question: string;
  selectedOption: 'EVET' | 'HAYIR';
  status: 'won' | 'lost' | 'pending';
}

export interface ProfileStats {
  wonCoupons: number;
  accuracyRate: number;
  maxWinAmount: number;
  totalCoupons: number;
  totalEarnings: number;
  highestOddsWon: number;
  totalPredictions: number;
  correctPredictions: number;
  couponAccuracyRate: number;
  couponTotalEarnings: number;
}

export interface Badge {
  id: number;
  name: string;
  icon: string;
  earned: boolean;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface CreditHistoryItem {
  date: string; // ISO Date string
  value: number;
}

export type TabType = 'tickets' | 'statistics';

export interface UserProfile {
  bio: string;
  email: string;
  username: string;
  fullName: string;
  coverImage: string;
  profileImage: string;
}

export interface ProfilePageProps {
  onBack: () => void;
  onMenuToggle: () => void;
  userProfile: UserProfile;
  onOpenQuestionDetail?: (questionId: string) => void;
}

// Animation constants
export interface AnimationConstants {
  HEADER_MAX_HEIGHT: number;
  HEADER_MIN_HEIGHT: number;
  PROFILE_IMAGE_SIZE: number;
  PROFILE_IMAGE_SIZE_SMALL: number;
}

export interface ProfileAnimations {
  scrollY: any;
  handleScroll: any;
  followButtonScale: any;
  profileImageScale: any;
  animateButtonPress: (animValue: any) => void;
  animateButtonHover: (animValue: any, pressed: boolean) => void;
}
