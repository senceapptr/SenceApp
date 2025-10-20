import { supabase } from '@/lib/supabase';

export interface Coupon {
  id: string;
  user_id: string;
  coupon_code: string;
  total_odds: number;
  stake_amount: number;
  potential_win: number;
  status: 'pending' | 'won' | 'lost' | 'partially_won' | 'cancelled';
  selections_count: number;
  correct_selections: number;
  created_at: string;
  resolved_at: string | null;
}

export interface CouponSelection {
  id: string;
  coupon_id: string;
  question_id: string;
  vote: 'yes' | 'no';
  odds: number;
  is_boosted: boolean;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  created_at: string;
}

export interface CreateCouponData {
  selections: {
    question_id: string;
    vote: 'yes' | 'no';
    odds: number;
    is_boosted?: boolean;
  }[];
  stake_amount: number;
}

/**
 * Coupons Service
 * Kupon işlemleri
 */
export const couponsService = {
  /**
   * Kullanıcının kuponlarını getir
   */
  async getUserCoupons(userId: string) {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select(`
          *,
          coupon_selections (
            *,
            questions (
              id,
              title,
              image_url,
              status,
              result
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get user coupons error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Aktif kuponları getir
   */
  async getActiveCoupons(userId: string) {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select(`
          *,
          coupon_selections (
            *,
            questions (
              id,
              title,
              image_url,
              end_date,
              status
            )
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get active coupons error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kupon detayını getir
   */
  async getCouponById(couponId: string) {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select(`
          *,
          coupon_selections (
            *,
            questions (
              id,
              title,
              description,
              image_url,
              status,
              result,
              end_date
            )
          )
        `)
        .eq('id', couponId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get coupon by id error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Yeni kupon oluştur
   */
  async createCoupon({ selections, stake_amount }: CreateCouponData) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Toplam oranı hesapla
      const total_odds = selections.reduce((acc, sel) => acc * sel.odds, 1);
      const potential_win = Math.floor(stake_amount * total_odds);

      // Benzersiz kupon kodu oluştur
      const coupon_code = `CPN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Kuponu oluştur
      const { data: coupon, error: couponError } = await supabase
        .from('coupons')
        .insert({
          user_id: user.id,
          coupon_code,
          total_odds: Number(total_odds.toFixed(2)),
          stake_amount,
          potential_win,
          selections_count: selections.length,
          status: 'pending',
        })
        .select()
        .single();

      if (couponError) throw couponError;

      // Seçimleri ekle
      const selectionsData = selections.map((sel) => ({
        coupon_id: coupon.id,
        question_id: sel.question_id,
        vote: sel.vote,
        odds: sel.odds,
        is_boosted: sel.is_boosted || false,
        status: 'pending' as const,
      }));

      const { error: selectionsError } = await supabase
        .from('coupon_selections')
        .insert(selectionsData);

      if (selectionsError) throw selectionsError;

      // Kullanıcının kredisini düş
      await supabase.rpc('decrease_user_credits', {
        user_id: user.id,
        amount: stake_amount,
      });

      return { data: coupon, error: null };
    } catch (error) {
      console.error('Create coupon error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kupon istatistiklerini getir
   */
  async getCouponStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('total_coupons, won_coupons, total_earnings')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get coupon stats error:', error);
      return { data: null, error: error as Error };
    }
  },
};

