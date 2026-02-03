-- ================================================
-- RPC: close_expired_questions (trigger bypass)
-- Migration: 062_close_expired_questions_rpc.sql
-- ================================================
-- Edge Function bu RPC'yi çağırır. RPC session değişkeni set eder,
-- trigger bu değişkene bakarak active->closed geçişine izin verir.
-- Böylece service role / auth.uid() farkına takılmadan süresi dolan sorular kapanır.
-- ================================================

-- 1) Trigger fonksiyonuna session değişkeni kontrolü ekle
CREATE OR REPLACE FUNCTION validate_question_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  -- Sistem/cron (Edge Function RPC): session değişkeni set edildiyse active->closed izin ver
  IF current_setting('app.allow_system_close', true) = 'true' AND
     OLD.status = 'active' AND NEW.status = 'closed' THEN
    RETURN NEW;
  END IF;

  -- Draft'tan active'e geçiş sadece admin yapabilir
  IF OLD.status = 'draft' AND NEW.status = 'active' THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    ) THEN
      RAISE EXCEPTION 'Only admins can approve questions (draft -> active)';
    END IF;
  END IF;
  
  -- Active/closed/resolved durum değişikliği: admin veya sistem (auth.uid() NULL = Edge Function / cron)
  IF OLD.status IN ('active', 'closed', 'resolved') AND 
     NEW.status != OLD.status THEN
    IF auth.uid() IS NULL THEN
      RETURN NEW;
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    ) THEN
      RAISE EXCEPTION 'Only admins can change status of active/resolved questions';
    END IF;
  END IF;
  
  -- Closed/Resolved sorular geri draft'a dönemez
  IF OLD.status IN ('closed', 'resolved') AND NEW.status = 'draft' THEN
    RAISE EXCEPTION 'Cannot revert closed/resolved questions to draft';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2) RPC: Süresi geçmiş active soruları closed yap
CREATE OR REPLACE FUNCTION public.close_expired_questions()
RETURNS TABLE(closed_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r_count bigint;
BEGIN
  -- Trigger'ın active->closed'a izin vermesi için session değişkeni
  PERFORM set_config('app.allow_system_close', 'true', true);

  WITH updated AS (
    UPDATE public.questions
    SET status = 'closed', updated_at = NOW()
    WHERE status = 'active' AND end_date <= NOW()
    RETURNING id
  )
  SELECT COUNT(*)::bigint INTO r_count FROM updated;

  RETURN QUERY SELECT r_count;
END;
$$;

COMMENT ON FUNCTION public.close_expired_questions() IS 
'Edge Function tarafından çağrılır. Süresi geçmiş active soruları closed yapar.';

-- API rollerinin RPC çağırabilmesi için (Edge Function service role key ile anon/authenticated üzerinden çağırır)
GRANT EXECUTE ON FUNCTION public.close_expired_questions() TO anon;
GRANT EXECUTE ON FUNCTION public.close_expired_questions() TO authenticated;
