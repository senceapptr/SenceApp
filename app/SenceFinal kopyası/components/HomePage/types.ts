export interface FeaturedQuestion {
  id: number;
  title: string;
  image: string;
  votes: number;
  timeLeft: string;
  category: string;
  yesOdds: number;
  noOdds: number;
  dominantColor: string;
}

export interface ActiveCoupon {
  id: number;
  name: string;
  questionCount: number;
  totalOdds: number;
  potentialWinnings: number;
  endsIn: string;
  colors: [string, string];
}

export interface TrendQuestion {
  id: number;
  title: string;
  category: string;
  image: string;
  votes: number;
  timeLeft: string;
  yesOdds: number;
  noOdds: number;
  yesPercentage: number;
}



