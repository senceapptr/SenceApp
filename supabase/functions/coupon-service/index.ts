/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { serve } from '@std/http';
import { createClient } from '@supabase/supabase-js';

type CouponSelectionInput = {
  is_boosted?: boolean;
  odds: number;
  question_id: string;
  vote: 'yes' | 'no';
};

type CouponServiceAction =
  | 'check_coupon_status'
  | 'claim_coupon_reward'
  | 'create_coupon'
  | 'get_active_coupons'
  | 'get_user_coupons'
  | 'resolve_coupon';

function getEnvVar(key: string, defaultValue = ''): string {
  const denoEnv = (Deno as unknown as { env?: { get?: (name: string) => string | undefined } }).env;
  const value = denoEnv?.get?.(key);
  return typeof value === 'string' ? value : defaultValue;
}

const SUPABASE_URL = getEnvVar('SUPABASE_URL', '');
const SUPABASE_SERVICE_ROLE_KEY = getEnvVar('SUPABASE_SERVICE_ROLE_KEY', '');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  });
}

serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse({ error: 'Server configuration error: missing Supabase credentials' }, 500);
  }

  try {
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!token) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const {
      data: { user: requester },
      error: requesterError,
    } = await supabaseAdmin.auth.getUser(token);

    if (requesterError || !requester) {
      return jsonResponse({ error: 'Invalid session' }, 401);
    }

    const body = await req.json().catch(() => ({}));
    const action = body?.action as CouponServiceAction | undefined;

    if (!action) {
      return jsonResponse({ error: 'Action is required' }, 400);
    }

    const requireAdmin = async () => {
      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('is_admin')
        .eq('id', requester.id)
        .single();

      if (error || !profile?.is_admin) {
        return false;
      }

      return true;
    };

    const ensureUserScope = async (requestedUserId?: string) => {
      const targetUserId = requestedUserId || requester.id;
      if (targetUserId === requester.id) {
        return { ok: true, userId: targetUserId };
      }

      const isAdmin = await requireAdmin();
      if (!isAdmin) {
        return { ok: false, userId: targetUserId };
      }

      return { ok: true, userId: targetUserId };
    };

    if (action === 'get_user_coupons') {
      const scope = await ensureUserScope(body?.userId);
      if (!scope.ok) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      const { data: couponsData, error: couponsError } = await supabaseAdmin
        .from('coupons')
        .select('*, display_id')
        .eq('user_id', scope.userId)
        .order('created_at', { ascending: false });

      if (couponsError) {
        return jsonResponse({ error: couponsError.message }, 400);
      }

      if (!couponsData || couponsData.length === 0) {
        return jsonResponse({ data: [] });
      }

      const couponsWithSelections = await Promise.all(
        couponsData.map(async coupon => {
          const { data: selectionsData } = await supabaseAdmin
            .from('coupon_selections')
            .select('id, question_id, vote, odds, status')
            .eq('coupon_id', coupon.id);

          const rawSelections = Array.isArray(selectionsData) ? selectionsData : [];

          const selectionsWithQuestions = await Promise.all(
            rawSelections.map(async selection => {
              const { data: questionData } = await supabaseAdmin
                .from('questions')
                .select('id, title, image_url, category_id, status, result, end_date')
                .eq('id', selection.question_id)
                .maybeSingle();

              if (!questionData) {
                return {
                  id: selection.id,
                  odds: selection.odds,
                  question_id: selection.question_id,
                  questions: null,
                  status: selection.status,
                  vote: selection.vote,
                };
              }

              let categoryName = 'Genel';
              if (questionData.category_id) {
                const { data: categoryData } = await supabaseAdmin
                  .from('categories')
                  .select('name')
                  .eq('id', questionData.category_id)
                  .maybeSingle();

                if (categoryData?.name) {
                  categoryName = categoryData.name;
                }
              }

              return {
                id: selection.id,
                odds: selection.odds,
                question_id: selection.question_id,
                questions: { ...questionData, categories: { name: categoryName } },
                status: selection.status,
                vote: selection.vote,
              };
            }),
          );

          return {
            ...coupon,
            coupon_selections: selectionsWithQuestions,
          };
        }),
      );

      return jsonResponse({ data: couponsWithSelections });
    }

    if (action === 'get_active_coupons') {
      const scope = await ensureUserScope(body?.userId);
      if (!scope.ok) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      const { data, error } = await supabaseAdmin
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
        .eq('user_id', scope.userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        return jsonResponse({ error: error.message }, 400);
      }

      return jsonResponse({ data: data || [] });
    }

    if (action === 'create_coupon') {
      const stakeAmount = Number(body?.stake_amount ?? 0);
      const selections = (body?.selections || []) as CouponSelectionInput[];

      if (!Number.isFinite(stakeAmount) || stakeAmount <= 0) {
        return jsonResponse({ error: 'Geçerli bir kupon tutarı girin.' }, 400);
      }

      if (!Array.isArray(selections) || selections.length === 0) {
        return jsonResponse({ error: 'Kupon için en az bir seçim gerekli.' }, 400);
      }

      const totalOdds = selections.reduce((acc, selection) => acc * Number(selection.odds), 1);
      const potentialWin = Math.floor(stakeAmount * totalOdds);
      const couponCode = `CPN-${Date.now()}-${Math.random().toString(36).slice(2, 11).toUpperCase()}`;

      const { data: coupon, error: couponError } = await supabaseAdmin
        .from('coupons')
        .insert({
          coupon_code: couponCode,
          potential_win: potentialWin,
          selections_count: selections.length,
          stake_amount: stakeAmount,
          status: 'pending',
          total_odds: Number(totalOdds.toFixed(2)),
          user_id: requester.id,
        })
        .select()
        .single();

      if (couponError || !coupon) {
        return jsonResponse({ error: couponError?.message || 'Kupon oluşturulamadı.' }, 400);
      }

      const selectionsPayload = selections.map(selection => ({
        coupon_id: coupon.id,
        is_boosted: Boolean(selection.is_boosted),
        odds: selection.odds,
        question_id: selection.question_id,
        status: 'pending',
        vote: selection.vote,
      }));

      const { error: selectionsError } = await supabaseAdmin.from('coupon_selections').insert(selectionsPayload);
      if (selectionsError) {
        await supabaseAdmin.from('coupons').delete().eq('id', coupon.id);
        return jsonResponse({ error: selectionsError.message }, 400);
      }

      const amountPerQuestion = Math.floor(stakeAmount / selections.length);
      for (const selection of selections) {
        const { data: existingPrediction } = await supabaseAdmin
          .from('predictions')
          .select('id')
          .eq('user_id', requester.id)
          .eq('question_id', selection.question_id)
          .maybeSingle();

        if (!existingPrediction) {
          await supabaseAdmin.from('predictions').insert({
            amount: amountPerQuestion,
            odds: selection.odds,
            potential_win: Math.floor(amountPerQuestion * selection.odds),
            question_id: selection.question_id,
            status: 'pending',
            user_id: requester.id,
            vote: selection.vote,
          });
        }
      }

      const { error: creditError } = await supabaseAdmin.rpc('decrease_user_credits', {
        amount_param: stakeAmount,
        user_id_param: requester.id,
      });

      if (creditError) {
        await supabaseAdmin.from('coupon_selections').delete().eq('coupon_id', coupon.id);
        await supabaseAdmin.from('coupons').delete().eq('id', coupon.id);
        return jsonResponse({ error: creditError.message }, 400);
      }

      return jsonResponse({ data: coupon });
    }

    if (action === 'claim_coupon_reward') {
      const couponId = body?.couponId as string | undefined;
      if (!couponId) {
        return jsonResponse({ error: 'couponId is required' }, 400);
      }

      const { data: coupon, error: couponError } = await supabaseAdmin
        .from('coupons')
        .select('id, user_id')
        .eq('id', couponId)
        .single();

      if (couponError || !coupon) {
        return jsonResponse({ error: 'Kupon bulunamadı.' }, 404);
      }

      if (coupon.user_id !== requester.id) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      const { data, error } = await supabaseAdmin.rpc('claim_coupon_reward', {
        coupon_id_param: couponId,
      });

      if (error) {
        return jsonResponse({ error: error.message }, 400);
      }

      return jsonResponse({ data });
    }

    if (action === 'resolve_coupon') {
      const couponId = body?.couponId as string | undefined;
      if (!couponId) {
        return jsonResponse({ error: 'couponId is required' }, 400);
      }

      const isAdmin = await requireAdmin();
      if (!isAdmin) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      const { error } = await supabaseAdmin.rpc('resolve_coupon', {
        coupon_id_param: couponId,
      });

      if (error) {
        return jsonResponse({ error: error.message }, 400);
      }

      const { data: coupon } = await supabaseAdmin.from('coupons').select('*').eq('id', couponId).single();
      return jsonResponse({ data: coupon });
    }

    if (action === 'check_coupon_status') {
      const couponId = body?.couponId as string | undefined;
      if (!couponId) {
        return jsonResponse({ error: 'couponId is required' }, 400);
      }

      const { data: coupon, error } = await supabaseAdmin
        .from('coupons')
        .select('id, user_id, status, coupon_selections(status)')
        .eq('id', couponId)
        .single();

      if (error || !coupon) {
        return jsonResponse({ error: 'Kupon bulunamadı.' }, 404);
      }

      if (coupon.user_id !== requester.id) {
        const isAdmin = await requireAdmin();
        if (!isAdmin) {
          return jsonResponse({ error: 'Forbidden' }, 403);
        }
      }

      const selections = Array.isArray(coupon.coupon_selections) ? coupon.coupon_selections : [];
      const pendingCount = selections.filter((selection: { status: string | null }) => selection.status === 'pending').length;

      return jsonResponse({
        data: {
          couponId: coupon.id,
          pendingCount,
          status: coupon.status,
        },
      });
    }

    return jsonResponse({ error: 'Unsupported action' }, 400);
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : 'Unexpected error' }, 500);
  }
});
