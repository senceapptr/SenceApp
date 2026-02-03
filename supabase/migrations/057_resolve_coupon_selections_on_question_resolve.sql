-- ================================================
-- Soru sonuçlandığında coupon_selections ve coupons güncelle
-- Migration: 057_resolve_coupon_selections_on_question_resolve.sql
-- ================================================

CREATE OR REPLACE FUNCTION update_coupon_selections_on_question_resolve()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  q_result TEXT := NEW.result;
  affected_coupon_ids UUID[];
BEGIN
  IF q_result IS NULL THEN RETURN NEW; END IF;

  IF q_result = 'cancelled' THEN
    UPDATE public.coupon_selections SET status = 'cancelled'
    WHERE question_id = NEW.id AND status = 'pending';
  ELSE
    UPDATE public.coupon_selections
    SET status = CASE WHEN vote = q_result THEN 'won' ELSE 'lost' END
    WHERE question_id = NEW.id AND status = 'pending';
  END IF;

  SELECT ARRAY_AGG(DISTINCT coupon_id) INTO affected_coupon_ids
  FROM public.coupon_selections WHERE question_id = NEW.id;

  IF affected_coupon_ids IS NOT NULL AND array_length(affected_coupon_ids, 1) > 0 THEN
    PERFORM update_coupon_status_if_resolved(cid) FROM unnest(affected_coupon_ids) AS cid;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION update_coupon_status_if_resolved(coupon_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  has_pending BOOLEAN;
  has_lost BOOLEAN;
  all_cancelled BOOLEAN;
  all_won BOOLEAN;
  new_status TEXT;
BEGIN
  SELECT
    COALESCE(bool_or(status = 'pending'), false),
    COALESCE(bool_or(status = 'lost'), false),
    count(*) > 0 AND count(*) FILTER (WHERE status = 'cancelled') = count(*),
    count(*) > 0 AND count(*) FILTER (WHERE status = 'won') = count(*)
  FROM public.coupon_selections WHERE coupon_id = coupon_id_param
  INTO has_pending, has_lost, all_cancelled, all_won;

  IF has_pending THEN RETURN; END IF;

  IF has_lost THEN new_status := 'lost';
  ELSIF all_cancelled THEN new_status := 'cancelled';
  ELSIF all_won THEN new_status := 'won';
  ELSE new_status := 'pending';
  END IF;

  UPDATE public.coupons
  SET status = new_status, resolved_at = CASE WHEN new_status != 'pending' THEN NOW() ELSE resolved_at END
  WHERE id = coupon_id_param;
END;
$$;

DROP TRIGGER IF EXISTS trigger_question_resolve_update_coupon_selections ON public.questions;
CREATE TRIGGER trigger_question_resolve_update_coupon_selections
  AFTER UPDATE ON public.questions
  FOR EACH ROW
  WHEN (NEW.result IS NOT NULL AND (OLD.result IS DISTINCT FROM NEW.result))
  EXECUTE FUNCTION update_coupon_selections_on_question_resolve();

COMMENT ON FUNCTION update_coupon_selections_on_question_resolve() IS 'Soru result set edildiğinde ilgili coupon_selections ve coupons status günceller';
COMMENT ON FUNCTION update_coupon_status_if_resolved(UUID) IS 'Kuponun tüm seçimleri sonuçlandıysa kupon statusunu won/lost/cancelled yapar';

DO $$
DECLARE q RECORD;
BEGIN
  FOR q IN SELECT id, result FROM public.questions WHERE result IS NOT NULL
  LOOP
    IF q.result = 'cancelled' THEN
      UPDATE public.coupon_selections SET status = 'cancelled' WHERE question_id = q.id AND status = 'pending';
    ELSE
      UPDATE public.coupon_selections SET status = CASE WHEN vote = q.result THEN 'won' ELSE 'lost' END
      WHERE question_id = q.id AND status = 'pending';
    END IF;
  END LOOP;
END;
$$;

DO $$
DECLARE c RECORD;
BEGIN
  FOR c IN SELECT id FROM public.coupons WHERE status = 'pending'
  LOOP
    PERFORM update_coupon_status_if_resolved(c.id);
  END LOOP;
END;
$$;
