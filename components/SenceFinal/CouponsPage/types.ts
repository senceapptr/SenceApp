export type PredictionResult = 'won' | 'lost' | 'pending' | 'cancelled';
export type CouponStatus = 'pending' | 'won' | 'lost' | 'cancelled';

export interface CouponPrediction {
  id: number;
  questionId: number;
  question: string;
  choice: 'yes' | 'no';
  odds: number;
  category: string;
  result?: PredictionResult;
  endDate?: Date | null;
}

export interface Coupon {
  id: number;
  rawId: string; // Backend'den gelen gerçek UUID
  predictions: CouponPrediction[];
  totalOdds: number;
  potentialEarnings: number;
  status: CouponStatus;
  createdAt: Date;
  claimedReward?: boolean;
  username?: string;
  investmentAmount?: number;
  display_id?: number;
}

// Tek seçim için - 'all' geri eklendi
export type CategoryType = 'all' | 'pending' | 'won' | 'lost' | 'cancelled';
