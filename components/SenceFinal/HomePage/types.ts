export interface FeaturedQuestion {
  id: string; // UUID
  title: string;
  image: string;
  votes: number;
  timeLeft: string;
  category: string;
  yesOdds: number;
  noOdds: number;
  dominantColor: string;
  endDate: string;
}

export interface ActiveCoupon {
  id: number | string; // display_id veya id
  name: string;
  questionCount: number;
  totalOdds: number;
  potentialWinnings: number;
  endsIn: string;
  colors: [string, string];
  // CouponDetailModal için gerekli alanlar
  predictions?: Array<{
    id: number;
    questionId: number;
    question: string;
    choice: 'yes' | 'no';
    odds: number;
    category: string;
    result?: 'won' | 'lost' | 'pending';
  }>;
  potentialEarnings?: number;
  status?: 'live' | 'won' | 'lost';
  createdAt?: Date;
  username?: string;
  investmentAmount?: number;
}

export interface TrendQuestion {
  id: string; // UUID
  title: string;
  category: string;
  categoryId: string | null; // Filtreleme için
  image: string;
  votes: number;
  timeLeft: string;
  yesOdds: number;
  noOdds: number;
  yesPercentage: number;
  publishDate: string; // Sıralama için (ISO string)
  endDate: string; // Yakında Bitecek sıralaması için (ISO string)
  end_date?: string; // UI Component compatibility
  status?: string;
  result?: string | null;
}




