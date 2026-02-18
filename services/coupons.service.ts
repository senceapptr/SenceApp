import { supabase } from '@/lib/supabase';

export interface Coupon {
  id: string;
  user_id: string;
  display_id: number;
  total_odds: number;
  created_at: string;
  coupon_code: string;
  stake_amount: number;
  potential_win: number;
  selections_count: number;
  correct_selections: number;
  resolved_at: string | null;
  status: 'pending' | 'won' | 'lost' | 'partially_won' | 'cancelled';
}

export interface CouponSelection {
  id: string;
  odds: number;
  coupon_id: string;
  vote: 'yes' | 'no';
  created_at: string;
  question_id: string;
  is_boosted: boolean;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
}

export interface CreateCouponData {
  stake_amount: number;
  selections: {
    question_id: string;
    vote: 'yes' | 'no';
    odds: number;
    is_boosted?: boolean;
  }[];
}

/**
 * Coupons Service
 * Kupon işlemleri
 */
export const couponsService = {
  async getCouponsFallback(userId: string, activeOnly: boolean) {
    let query = supabase
      .from('coupons')
      .select(
        `
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
        `,
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (activeOnly) {
      query = query.eq('status', 'pending');
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Kullanıcının kuponlarını getir
   */
  async getUserCoupons(userId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('coupon-service', {
        body: {
          action: 'get_user_coupons',
          userId,
        },
      });

      if (error) {
        const fallbackData = await this.getCouponsFallback(userId, false);
        return { data: fallbackData, error: null };
      }

      return { data: data?.data || [], error: null };
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
      const { data, error } = await supabase.functions.invoke('coupon-service', {
        body: {
          action: 'get_active_coupons',
          userId,
        },
      });

      if (error) {
        const fallbackData = await this.getCouponsFallback(userId, true);
        return { data: fallbackData, error: null };
      }

      return { data: data?.data || [], error: null };
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
        .select(
          `
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
        `,
        )
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
      const { data, error } = await supabase.functions.invoke('coupon-service', {
        body: {
          action: 'create_coupon',
          selections,
          stake_amount,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return { data: data?.data || null, error: null };
    } catch (error) {
      console.error('Create coupon error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kupon sonuçlandır ve kazanma durumunda kredi artır
   * + Bildirim oluştur
   */
  async resolveCoupon(couponId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('coupon-service', {
        body: {
          action: 'resolve_coupon',
          couponId,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return { data: true, error: null };
    } catch (error) {
      console.error('Resolve coupon error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kupon durumunu kontrol et (1 maç kaldı bildirimi için)
   * Bu fonksiyon periyodik olarak veya soru sonuçlandığında çağrılabilir.
   */
  async checkCouponStatus(couponId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('coupon-service', {
        body: {
          action: 'check_coupon_status',
          couponId,
        },
      });

      if (error) throw error;
      return { data: data?.data || null, error: null };
    } catch (err) {
      console.error('Check coupon status error:', err);
      return { data: null, error: err as Error };
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

  /**
   * Kazanan kuponun ödülünü al
   * Tek seferlik - is_claimed flag'i ile kontrol edilir
   */
  async claimCouponReward(couponId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('coupon-service', {
        body: {
          action: 'claim_coupon_reward',
          couponId,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return { data: data?.data, error: null };
    } catch (error) {
      console.error('Claim coupon reward error:', error);
      return { data: null, error: error as Error };
    }
  },
};
