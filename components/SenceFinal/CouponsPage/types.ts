export type PredictionResult = 'won' | 'lost' | 'pending' | 'cancelled';
export type CouponStatus = 'pending' | 'won' | 'lost' | 'cancelled';

export interface CouponPrediction {
  id: string;
  odds: number;
  question: string;
  category: string;
  questionId: string;
  choice: 'yes' | 'no';
  endDate?: Date | null;
  result?: PredictionResult;
  questionImage?: string | null;
}

export interface Coupon {
  id: number;
  rawId: string; // Backend'den gelen gerçek UUID
  createdAt: Date;
  totalOdds: number;
  username?: string;
  display_id?: number;
  status: CouponStatus;
  claimedReward?: boolean;
  potentialEarnings: number;
  investmentAmount?: number;
  predictions: CouponPrediction[];
}

// Tek seçim için - 'all' geri eklendi
export type CategoryType = 'all' | 'pending' | 'won' | 'lost' | 'cancelled';
