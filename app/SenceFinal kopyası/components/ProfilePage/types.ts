export interface ProfileData {
  name: string;
  username: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  predictions: number;
  followers: number;
  following: number;
  credits: number;
  isFollowing: boolean;
}

export interface Prediction {
  id: number;
  image: string;
  question: string;
  selectedOption: 'EVET' | 'HAYIR';
  odds: number;
  status: 'won' | 'lost' | 'pending';
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface CreditHistoryItem {
  day: string;
  credits: number;
}

export type TabType = 'predictions' | 'statistics';

export interface ProfilePageProps {
  onBack: () => void;
  onMenuToggle: () => void;
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
  followButtonScale: any;
  profileImageScale: any;
  handleScroll: any;
  animateButtonPress: (animValue: any) => void;
  animateButtonHover: (animValue: any, pressed: boolean) => void;
}

