import { supabase } from '@/lib/supabase';

export interface Prediction {
  id: string;
  user_id: string;
  question_id: string;
  vote: 'yes' | 'no';
  odds: number;
  amount: number;
  potential_win: number;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  created_at: string;
  resolved_at: string | null;
}

export interface CreatePredictionData {
  question_id: string;
  vote: 'yes' | 'no';
  odds: number;
  amount: number;
  potential_win?: number;
}

/**
 * Predictions Service
 * Tahmin işlemleri
 */
export const predictionsService = {
  /**
   * Kullanıcının tahminlerini getir
   */
  async getUserPredictions(userId: string) {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          *,
          questions (
            id,
            title,
            image_url,
            end_date,
            status,
            result
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get user predictions error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Aktif tahminleri getir
   */
  async getActivePredictions(userId: string) {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          *,
          questions (
            id,
            title,
            image_url,
            end_date,
            status
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get active predictions error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Yeni tahmin oluştur
   */
  async createPrediction({ question_id, vote, odds, amount }: CreatePredictionData) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Potansiyel kazancı hesapla
      const potential_win = Math.floor(amount * odds);

      const { data, error } = await supabase
        .from('predictions')
        .insert({
          user_id: user.id,
          question_id,
          vote,
          odds,
          amount,
          potential_win,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // Kullanıcının kredisini düş
      await supabase.rpc('decrease_user_credits', {
        user_id: user.id,
        amount: amount,
      });

      return { data, error: null };
    } catch (error) {
      console.error('Create prediction error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Tahmin istatistiklerini getir
   */
  async getPredictionStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get prediction stats error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kullanıcının bir soruya tahmin yapıp yapmadığını kontrol et
   */
  async checkUserPrediction(userId: string, questionId: string) {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .maybeSingle();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Check user prediction error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kullanıcının belirli bir soru için tahminini getir
   */
  async getUserPredictionForQuestion(userId: string, questionId: string) {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
      return { data: data || null, error: null };
    } catch (error) {
      console.error('getUserPredictionForQuestion error:', error);
      return { data: null, error: error as Error };
    }
  }
};

