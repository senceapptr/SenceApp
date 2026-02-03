-- ================================================
-- ADMIN ÖN ONAY: approved_result (süre bitene kadar sonuç yayınlanmaz)
-- Migration: 068_approved_result_pre_approval.sql
-- ================================================
-- Admin süre bitmeden Evet/Hayır seçerse bu alana yazılır; süre bitince edge function
-- result = approved_result, status = resolved yapar. Böylece uygulamada süre bitene
-- kadar sonuç gösterilmez.
-- ================================================

ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS approved_result TEXT CHECK (approved_result IN ('yes', 'no'));

COMMENT ON COLUMN public.questions.approved_result IS 'Admin ön onayı: süre bitene kadar uygulamada gösterilmez; süre bitince result olarak uygulanır.';
