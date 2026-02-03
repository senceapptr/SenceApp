-- ================================================
-- TEST SORULARI: Sonuçlanma akışı UI testi
-- Migration: 064_seed_resolution_test_questions.sql
-- ================================================
-- Edge Function'dan bağımsız UI testi için:
-- 1) Active, süresi 16 dk sonra dolacak
-- 2) Active, süresi 14 dk sonra dolacak
-- 3) Süresi dolmuş, admin onayı bekliyor (closed, result null)
-- 3. soru geçmiş end_date ile ekleneceği için end_date trigger geçici kaldırılır.
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

  -- 1) Active, bitişe 16 dakika (trending + featured = listede görünsün)
  INSERT INTO public.questions (
    title, description, category_id, status, end_date,
    yes_odds, no_odds, total_votes, yes_votes, no_votes, yes_percentage, no_percentage, total_amount,
    is_trending, is_featured
  ) VALUES (
    '[Test] 16 dakika sonra bitecek soru',
    'Sonuçlanma akışı testi: bu soru 16 dakika sonra süresi dolacak.',
    cid,
    'active',
    NOW() + interval '16 minutes',
    2.0, 2.0, 0, 0, 0, 50, 50, 0,
    true, true
  );

  -- 2) Active, bitişe 14 dakika
  INSERT INTO public.questions (
    title, description, category_id, status, end_date,
    yes_odds, no_odds, total_votes, yes_votes, no_votes, yes_percentage, no_percentage, total_amount,
    is_trending, is_featured
  ) VALUES (
    '[Test] 14 dakika sonra bitecek soru',
    'Sonuçlanma akışı testi: bu soru 14 dakika sonra süresi dolacak.',
    cid,
    'active',
    NOW() + interval '14 minutes',
    2.0, 2.0, 0, 0, 0, 50, 50, 0,
    true, true
  );

  -- 3) Süresi dolmuş, admin onayı bekliyor (closed, result null)
  INSERT INTO public.questions (
    title, description, category_id, status, result, end_date,
    yes_odds, no_odds, total_votes, yes_votes, no_votes, yes_percentage, no_percentage, total_amount,
    is_trending, is_featured
  ) VALUES (
    '[Test] Süresi dolmuş - Admin onayı bekleniyor',
    'Bu soru süresi dolmuş ve closed. Detay sayfada "Admin onayı bekleniyor", Admin panelde Sonuç Onayı listesinde görünmeli.',
    cid,
    'closed',
    NULL,
    NOW() - interval '1 day',
    2.0, 2.0, 0, 0, 0, 50, 50, 0,
    true, true
  );

  RAISE NOTICE 'Resolution test questions inserted: 16min, 14min, expired (closed).';
END;
$$;

CREATE TRIGGER validate_question_end_date_trigger
  BEFORE INSERT OR UPDATE ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION validate_question_end_date();
