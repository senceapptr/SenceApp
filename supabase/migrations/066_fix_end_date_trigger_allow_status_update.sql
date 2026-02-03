-- ================================================
-- FIX: end_date trigger sadece end_date değişince engellesin
-- Migration: 066_fix_end_date_trigger_allow_status_update.sql
-- ================================================
-- Şu an: UPDATE'de satırda end_date geçmişse (status closed yaparken) trigger
-- "End date must be in the future" diyerek tüm güncellemeyi engelliyordu.
-- Düzeltme: Sadece end_date sütunu gerçekten geçmişe çekildiyse kontrol et.
-- Status active->closed veya başka sütun güncellemesi end_date'e dokunmuyorsa izin ver.
-- ================================================

CREATE OR REPLACE FUNCTION validate_question_end_date()
RETURNS TRIGGER AS $$
BEGIN
  -- INSERT: end_date gelecekte olmalı
  IF TG_OP = 'INSERT' AND NEW.end_date <= NOW() THEN
    RAISE EXCEPTION 'End date must be in the future';
  END IF;
  
  -- UPDATE: Sadece end_date gerçekten değiştiyse ve geçmişe çekildiyse kontrol et
  -- (Status closed yapmak veya is_trending güncellemek end_date'i değiştirmiyor; engelleme)
  IF TG_OP = 'UPDATE' AND OLD.end_date IS DISTINCT FROM NEW.end_date AND NEW.end_date <= NOW() THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    ) THEN
      RAISE EXCEPTION 'End date must be in the future (only admins can set past dates)';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION validate_question_end_date() IS 
'INSERT: end_date gelecekte olmalı. UPDATE: Sadece end_date değişip geçmişe çekildiyse admin gerekli.';
