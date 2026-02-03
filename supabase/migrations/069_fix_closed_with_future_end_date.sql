-- ================================================
-- DÜZELTME: Süresi henüz dolmamış ama yanlışlıkla closed olan soruları active yap
-- Migration: 069_fix_closed_with_future_end_date.sql
-- ================================================
-- Eski edge function 15dk penceresindeki soruları closed yapıyordu; süre bitmeden
-- closed kalan sorular listede görünmüyordu. end_date > NOW() olan closed soruları
-- tekrar active yapıyoruz.
-- ================================================

UPDATE public.questions
SET status = 'active', updated_at = NOW()
WHERE status = 'closed'
  AND end_date > NOW();
