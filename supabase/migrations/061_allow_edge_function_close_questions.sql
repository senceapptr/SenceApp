-- ================================================
-- ALLOW EDGE FUNCTION TO CLOSE EXPIRED QUESTIONS
-- Migration: 061_allow_edge_function_close_questions.sql
-- ================================================
-- Edge Function (service role) auth.uid() = NULL ile çalışır.
-- Trigger active -> closed geçişine sadece admin izin veriyordu; NULL yüzünden
-- güncelleme başarısız oluyordu. auth.uid() IS NULL (sistem/cron) iken
-- active -> closed ve closed -> resolved geçişlerine izin veriyoruz.
-- ================================================

CREATE OR REPLACE FUNCTION validate_question_status_transition()
RETURNS TRIGGER AS $$
BEGIN
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
    -- Service role (Edge Function, cron): auth.uid() NULL -> izin ver
    IF auth.uid() IS NULL THEN
      RETURN NEW;
    END IF;
    -- Kullanıcı context: sadece admin değiştirebilir
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

COMMENT ON FUNCTION validate_question_status_transition() IS 
'Status geçişleri: draft->active sadece admin; active/closed/resolved değişikliği admin veya auth.uid() NULL (Edge Function)';
