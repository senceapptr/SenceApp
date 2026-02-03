-- ================================================
-- QUESTION RESOLUTION WORKFLOW
-- Migration: 060_question_resolution_workflow.sql
-- ================================================
-- Süresi biten sorular için RSS/AI önerisi ve admin onayı akışı.
-- questions tablosuna suggested_result, suggested_result_source,
-- suggested_result_source_detail, resolution_admin_note, resolution_source_display eklenir.
-- ================================================

-- questions tablosuna yeni sütunlar
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS suggested_result TEXT CHECK (suggested_result IN ('yes', 'no')),
  ADD COLUMN IF NOT EXISTS suggested_result_source TEXT CHECK (suggested_result_source IN ('rss', 'ai')),
  ADD COLUMN IF NOT EXISTS suggested_result_source_detail TEXT,
  ADD COLUMN IF NOT EXISTS resolution_admin_note TEXT,
  ADD COLUMN IF NOT EXISTS resolution_source_display TEXT;

COMMENT ON COLUMN public.questions.suggested_result IS 'RSS/AI önerisi: yes veya no';
COMMENT ON COLUMN public.questions.suggested_result_source IS 'Önerinin kaynağı: rss veya ai';
COMMENT ON COLUMN public.questions.suggested_result_source_detail IS 'RSS için URL/link, AI için kısa özet';
COMMENT ON COLUMN public.questions.resolution_admin_note IS 'Admin onaylarken yazdığı not (resolved durumda)';
COMMENT ON COLUMN public.questions.resolution_source_display IS 'Detay sayfada gösterilecek kaynak metni';
