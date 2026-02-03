export interface FeaturedQuestion {
  id: string;
  title: string;
  image: string;
  votes: number;
  timeLeft: string;
  category: string;
  yesOdds: number;
  noOdds: number;
  dominantColor: string;
}

export interface TrendQuestion {
  id: string;
  title: string;
  category: string;
  categoryId: string | null;
  image: string;
  votes: number;
  timeLeft: string;
  yesOdds: number;
  noOdds: number;
  yesPercentage: number;
  publishDate: string;
  endDate: string;
}
