-- ================================================
-- TEK SONUÇ ALANI: approved_result kaldır, sadece result kullan
-- Migration: 070_remove_approved_result_use_result_only.sql
-- ================================================
-- Admin artık doğrudan result yazıyor; süre bitene kadar kullanıcıya gösterilmez (UI kuralı).
-- Ön onaylı verileri kaybetmemek için approved_result → result backfill, sonra kolon kaldırılır.
-- ================================================

-- 1) approved_result dolu ama result boş olan satırlarda result = approved_result yap
UPDATE public.questions
SET result = approved_result
WHERE approved_result IS NOT NULL AND (result IS NULL OR result = '');

-- 2) approved_result kolonunu kaldır
ALTER TABLE public.questions
  DROP COLUMN IF EXISTS approved_result;
