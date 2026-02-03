-- ================================================
-- ALWAYS ALLOW active -> closed (Edge Function garantisi)
-- Migration: 063_allow_active_to_closed_unconditionally.sql
-- ================================================
-- auth.uid() / session variable Edge Function ortamında tutarlı çalışmıyor.
-- active -> closed geçişini trigger'da koşulsuz izin veriyoruz.
-- RLS zaten kullanıcıların active soruları güncellemesini engelliyor (048: sadece draft veya admin).
-- ================================================

CREATE OR REPLACE FUNCTION validate_question_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  -- active -> closed: her zaman izin (süresi dolan sorular; Edge Function veya admin)
  IF OLD.status = 'active' AND NEW.status = 'closed' THEN
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
  
  -- Diğer active/closed/resolved değişiklikleri: admin veya auth.uid() NULL
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

COMMENT ON FUNCTION validate_question_status_transition() IS 
'active->closed her zaman; draft->active sadece admin; diğer geçişler admin veya auth.uid() NULL';
