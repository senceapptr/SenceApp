import { supabase, supabaseService } from '@/lib/supabase';

import { notificationsService } from './notifications.service'; // Import notification service

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
  /**
   * Kullanıcının kuponlarını getir
   */
  async getUserCoupons(userId: string) {
    try {
      // Service role ile RLS bypass - kupon ve seçimler kesin gelsin
      const client = supabaseService;

      // 1) Kuponları çek
      const { data: couponsData, error: couponsError } = await client
        .from('coupons')
        .select('*, display_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (couponsError) throw couponsError;
      if (!couponsData || couponsData.length === 0) {
        return { data: [], error: null };
      }

      // 2) Her kupon için coupon_selections (düz kolonlar)
      const couponsWithSelections = await Promise.all(
        couponsData.map(async coupon => {
          const { data: selectionsData, error: selectionsError } = await client
            .from('coupon_selections')
            .select('id, question_id, vote, odds, status')
            .eq('coupon_id', coupon.id);

          if (selectionsError) {
            console.warn('Coupon selections fetch error for coupon', coupon.id, selectionsError);
            return { ...coupon, coupon_selections: [] };
          }

          const rawSelections: { id: string; question_id: string; vote: string; odds: number; status: string }[] =
            Array.isArray(selectionsData) ? selectionsData : [];

          // 3) Her selection için question bilgisini ayrı çek
          const selectionsWithQuestions = await Promise.all(
            rawSelections.map(async sel => {
              const { data: questionData, error: qError } = await client
                .from('questions')
                .select('id, title, image_url, category_id, status, result, end_date')
                .eq('id', sel.question_id)
                .maybeSingle();

              if (qError || !questionData) {
                return {
                  id: sel.id,
                  odds: sel.odds,
                  question_id: sel.question_id,
                  questions: null,
                  status: sel.status,
                  vote: sel.vote,
                };
              }

              let categoryName = 'Genel';
              if (questionData.category_id) {
                const { data: catData } = await client
                  .from('categories')
                  .select('name')
                  .eq('id', questionData.category_id)
                  .maybeSingle();
                if (catData?.name) categoryName = catData.name;
              }

              return {
                id: sel.id,
                odds: sel.odds,
                question_id: sel.question_id,
                questions: { ...questionData, categories: { name: categoryName } },
                status: sel.status,
                vote: sel.vote,
              };
            }),
          );

          return {
            ...coupon,
            coupon_selections: selectionsWithQuestions,
          };
        }),
      );

      return { data: couponsWithSelections, error: null };
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
      // Service role ile RLS bypass
      const { data, error } = await supabaseService
        .from('coupons')
        .select(
          `
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
              image_url,
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
        `,
        )
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Active coupons query error:', error);
        throw error;
      }

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
          coupon_code,
          potential_win,
          selections_count: selections.length,
          stake_amount,
          status: 'pending',
          total_odds: Number(total_odds.toFixed(2)),
          user_id: user.id,
        })
        .select()
        .single();

      if (couponError) throw couponError;

      // Seçimleri ekle (Service role ile RLS bypass)
      const selectionsData = selections.map(sel => ({
        coupon_id: coupon.id,
        is_boosted: sel.is_boosted || false,
        odds: sel.odds,
        question_id: sel.question_id,
        status: 'pending' as const,
        vote: sel.vote,
      }));

      const { error: selectionsError } = await supabaseService.from('coupon_selections').insert(selectionsData);

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
            const { error: insertError } = await supabaseService.from('predictions').insert({
              amount: amountPerQuestion,
              odds: sel.odds,
              potential_win: Math.floor(amountPerQuestion * sel.odds),
              question_id: sel.question_id,
              status: 'pending' as const,
              user_id: user.id,
              vote: sel.vote,
            });

            if (insertError) {
              console.error('Prediction insert error for question:', sel.question_id, insertError);
            }
          }
        } catch (error) {
          console.error('Error processing prediction:', error);
          // Hata olsa bile devam et
        }
      }

      // Kullanıcının kredisini düş (Service role ile RLS bypass)
      const { error: creditError } = await supabaseService.rpc('decrease_user_credits', {
        amount_param: stake_amount,
        user_id_param: user.id,
      });

      if (creditError) {
        console.error('Credit decrease error:', creditError);
        throw creditError;
      }

      return { data: coupon, error: null };
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
      // 1. Durumu güncelle
      const { error } = await supabaseService.rpc('resolve_coupon', {
        coupon_id_param: couponId,
      });

      if (error) throw error;

      // 2. Kuponu tekrar çek
      const { data: coupon, error: fetchError } = await supabaseService
        .from('coupons')
        .select('*')
        .eq('id', couponId)
        .single();

      if (fetchError || !coupon) {
        console.warn('Could not fetch resolved coupon for notification', couponId);
        return { data: true, error: null };
      }

      // 3. Duruma göre bildirim at
      // Coupon Won
      if (coupon.status === 'won') {
        await notificationsService.createCouponWonNotification(coupon.user_id, {
          couponId: coupon.id,
          matchCount: coupon.selections_count,
          reward: coupon.potential_win,
        });
        console.log('Coupon won notification sent for', coupon.id);
      }
      // Partially Won (Future feature?)
      else if (coupon.status === 'partially_won') {
        // ...
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
      const { data: coupon, error } = await supabaseService
        .from('coupons')
        .select('*, coupon_selections(status)')
        .eq('id', couponId)
        .single();

      if (error || !coupon) return;

      if (coupon.status !== 'pending') return;

      const selections = coupon.coupon_selections || [];
      const pendingCount = selections.filter((s: any) => s.status === 'pending').length;

      // Sadece 1 maç kaldıysa bildirim at
      if (pendingCount === 1) {
        // Daha önce bildirim atılmış mı kontrol etmek gerekebilir (Redis cache vs. ile)
        // Şimdilik doğrudan atıyoruz (basit logic)
        await notificationsService.createCouponStatusNotification(coupon.user_id, {
          couponId: coupon.id,
          remainingQuestions: 1,
        });
      }
    } catch (err) {
      console.error('Check coupon status error:', err);
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
      const { data, error } = await supabaseService.rpc('claim_coupon_reward', {
        coupon_id_param: couponId,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Claim coupon reward error:', error);
      return { data: null, error: error as Error };
    }
  },
};
