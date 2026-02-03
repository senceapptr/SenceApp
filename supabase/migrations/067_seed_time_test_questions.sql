-- ================================================
-- TEST SORULARI: Süre testi (18 dk, 4 dk, süresi dolmuş)
-- Migration: 067_seed_time_test_questions.sql
-- ================================================
-- 1) Active, süresi 18 dk sonra dolacak (15dk penceresine henüz girmiyor)
-- 2) Active, süresi 4 dk sonra dolacak (edge function tetiklenince admin panele düşer)
-- 3) Süresi dolmuş (closed, result null) — Sonuç Onayı listesinde
-- Açıklamalar orijinal; önceki test setiyle karışmasın diye "Süre test seti 2025" ile başlıyor.
-- ================================================

DROP TRIGGER IF EXISTS validate_question_end_date_trigger ON public.questions;

DO $$
DECLARE
  cid UUID;
BEGIN
  SELECT id INTO cid FROM public.categories LIMIT 1;
  IF cid IS NULL THEN
    RAISE NOTICE 'No category found, skipping seed.';
    RETURN;
  END IF;

  -- Önceki ve bu setteki süre testi sorularını sil (tekrar çalıştırınca güncel sürelerle eklenir)
  DELETE FROM public.questions
  WHERE title IN (
    '[Test] 17 dakika sonra bitecek soru',
    '[Test] 5 dakika sonra bitecek soru',
    '[Test] Süresi dolmuş soru',
    '[Test] Bitişe 17 dakika kala',
    '[Test] Bitişe 5 dakika kala',
    '[Test] Süre doldu - Admin onayı bekleniyor',
    '[Test] 18 dakika kala',
    '[Test] 4 dakika kala',
    '[Test] Süre doldu (test)'
  );

  -- 1) Active, süresi 18 dakika sonra dolacak (15dk penceresinin dışında)
  INSERT INTO public.questions (
    title, description, category_id, status, end_date,
    yes_odds, no_odds, total_votes, yes_votes, no_votes, yes_percentage, no_percentage, total_amount,
    is_trending, is_featured
  ) VALUES (
    '[Test] 18 dakika kala',
    'Süre test seti 2025: Bu soru 18 dakika içinde kapanacak. Edge function 15dk penceresine girmeden önce listede kalır.',
    cid,
    'active',
    NOW() + interval '18 minutes',
    2.0, 2.0, 0, 0, 0, 50, 50, 0,
    true, true
  );

  -- 2) Active, süresi 4 dakika sonra dolacak (edge function tetiklenince admin panele düşer)
  INSERT INTO public.questions (
    title, description, category_id, status, end_date,
    yes_odds, no_odds, total_votes, yes_votes, no_votes, yes_percentage, no_percentage, total_amount,
    is_trending, is_featured
  ) VALUES (
    '[Test] 4 dakika kala',
    'Süre test seti 2025: Bitişe 4 dakika. Edge function tetiklenince Sonuç Onayı listesine düşmeli.',
    cid,
    'active',
    NOW() + interval '4 minutes',
    2.0, 2.0, 0, 0, 0, 50, 50, 0,
    true, true
  );

  -- 3) Süresi dolmuş (closed, admin onayı bekleniyor)
  INSERT INTO public.questions (
    title, description, category_id, status, result, end_date,
    yes_odds, no_odds, total_votes, yes_votes, no_votes, yes_percentage, no_percentage, total_amount,
    is_trending, is_featured
  ) VALUES (
    '[Test] Süre doldu (test)',
    'Süre test seti 2025: Zaten kapanmış test sorusu. Admin panel Sonuç Onayı sekmesinde ve Keşfet → Süresi bitmiş soruları da göster ile listelenir.',
    cid,
    'closed',
    NULL,
    NOW() - interval '1 hour',
    2.0, 2.0, 0, 0, 0, 50, 50, 0,
    true, true
  );

  RAISE NOTICE 'Time test questions inserted: 18min, 4min, expired (closed).';
END;
$$;

CREATE TRIGGER validate_question_end_date_trigger
  BEFORE INSERT OR UPDATE ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION validate_question_end_date();
