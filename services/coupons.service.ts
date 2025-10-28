import { supabase, supabaseService } from '@/lib/supabase';

export interface Coupon {
  id: string;
  display_id: number;
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
      console.log('=== STARTING COUPON FETCH ===');
      console.log('User ID:', userId);

      // Önce kuponları çek
      const { data: couponsData, error: couponsError } = await supabase
        .from('coupons')
        .select(`
          *,
          display_id
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (couponsError) throw couponsError;

      // Direkt SQL query ile veri çek (RLS bypass)
      const { data: sqlData, error: sqlError } = await supabaseService
        .from('coupons')
        .select(`
          *,
          display_id,
          coupon_selections!left (
            id,
            question_id,
            vote,
            odds,
            status,
            questions (
              id,
              title,
              category_id,
              status,
              result,
              end_date,
              categories!questions_category_id_fkey (
                id,
                name
              )
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (sqlError) {
        console.error('SQL Query Error:', sqlError);
        // Fallback: Normal query ile dene
        const couponsWithSelections = await Promise.all(
          couponsData.map(async (coupon) => {
            console.log(`Checking selections for coupon: ${coupon.id}`);
            
            const { data: selectionsData, error: selectionsError } = await supabaseService
              .from('coupon_selections')
              .select(`
                id,
                question_id,
                vote,
                odds,
                status,
                questions (
                  id,
                  title,
                  category_id,
                  status,
                  result,
                  end_date,
                  categories!questions_category_id_fkey (
                    id,
                    name
                  )
                )
              `)
              .eq('coupon_id', coupon.id);

            console.log(`Selections for ${coupon.id}:`, selectionsData);
            console.log(`Selection count: ${selectionsData?.length || 0}`);

            return { 
              ...coupon, 
              coupon_selections: selectionsData || [] 
            };
          })
        );
        return { data: couponsWithSelections, error: null };
      }

      console.log('SQL Query Result:', sqlData);
      return { data: sqlData || [], error: null };
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
      console.log('=== GETTING ACTIVE COUPONS ===');
      console.log('User ID:', userId);

      // Service role ile RLS bypass
      const { data, error } = await supabaseService
        .from('coupons')
        .select(`
          *,
          display_id,
          coupon_selections!left (
            id,
            question_id,
            vote,
            odds,
            status,
            questions (
              id,
              title,
              category_id,
              status,
              result,
              end_date,
              categories!questions_category_id_fkey (
                id,
                name
              )
            )
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Active coupons query error:', error);
        throw error;
      }

      console.log('Active coupons result:', data);
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

      // Kuponu oluştur (Service role ile RLS bypass)
      const { data: coupon, error: couponError } = await supabaseService
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

      // Seçimleri ekle (Service role ile RLS bypass)
      const selectionsData = selections.map((sel) => ({
        coupon_id: coupon.id,
        question_id: sel.question_id,
        vote: sel.vote,
        odds: sel.odds,
        is_boosted: sel.is_boosted || false,
        status: 'pending' as const,
      }));

      const { error: selectionsError } = await supabaseService
        .from('coupon_selections')
        .insert(selectionsData);

      if (selectionsError) throw selectionsError;

      // Her selection için predictions tablosuna da ekle (vote counts için)
      // Her soru için kullanıcının payını hesapla (stake_amount / selections.length)
      const amountPerQuestion = Math.floor(stake_amount / selections.length);
      
      // Her soruyu tek tek kontrol et ve ekle
      for (const sel of selections) {
        try {
          // Önce bu kullanıcının bu soruya daha önce prediction yapıp yapmadığını kontrol et
          const { data: existingPrediction, error: checkError } = await supabaseService
            .from('predictions')
            .select('id')
            .eq('user_id', user.id)
            .eq('question_id', sel.question_id)
            .maybeSingle();

          if (checkError) {
            console.error('Check prediction error:', checkError);
            continue;
          }

          // Eğer prediction yoksa ekle
          if (!existingPrediction) {
            const { error: insertError } = await supabaseService
              .from('predictions')
              .insert({
                user_id: user.id,
                question_id: sel.question_id,
                vote: sel.vote,
                odds: sel.odds,
                amount: amountPerQuestion,
                potential_win: Math.floor(amountPerQuestion * sel.odds),
                status: 'pending' as const,
              });

            if (insertError) {
              console.error('Prediction insert error for question:', sel.question_id, insertError);
            } else {
              console.log('Prediction created for question:', sel.question_id);
            }
          } else {
            console.log('Prediction already exists for question:', sel.question_id, '- skipping');
          }
        } catch (error) {
          console.error('Error processing prediction:', error);
          // Hata olsa bile devam et
        }
      }

      // Kullanıcının kredisini düş (Service role ile RLS bypass)
      console.log('=== CREDIT DECREASE ATTEMPT ===');
      console.log('User ID:', user.id);
      console.log('Stake Amount:', stake_amount);
      
      const { error: creditError } = await supabaseService.rpc('decrease_user_credits', {
        user_id_param: user.id,
        amount_param: stake_amount,
      });
      
      if (creditError) {
        console.error('Credit decrease error:', creditError);
        throw creditError;
      }
      
      console.log('Credit decrease successful');

      return { data: coupon, error: null };
    } catch (error) {
      console.error('Create coupon error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kupon sonuçlandır ve kazanma durumunda kredi artır
   */
  async resolveCoupon(couponId: string) {
    try {
      const { error } = await supabaseService.rpc('resolve_coupon', {
        coupon_id_param: couponId
      });

      if (error) throw error;
      return { data: true, error: null };
    } catch (error) {
      console.error('Resolve coupon error:', error);
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





