export interface CouponPrediction {
  id: number;
  question: string;
  choice: 'yes' | 'no';
  odds: number;
  category: string;
  result?: 'won' | 'lost' | 'pending';
}

export interface Coupon {
  id: number;
  predictions: CouponPrediction[];
  totalOdds: number;
  potentialEarnings: number;
  status: 'live' | 'won' | 'lost';
  createdAt: Date;
  claimedReward?: boolean;
  username?: string;
  investmentAmount?: number;
}

export type CategoryType = 'all' | 'live' | 'won' | 'lost';




