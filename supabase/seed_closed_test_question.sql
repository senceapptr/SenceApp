-- ================================================
-- MANUEL: Admin panele düşecek tek bir "süresi dolmuş" test sorusu ekle
-- ================================================
-- Supabase Dashboard -> SQL Editor'da bu dosyayı çalıştırın.
-- Bu soru status=closed, result=null olduğu için "Sonuç Onayı" listesinde görünür.
-- Edge function çağrısı gerekmez; soru zaten closed olarak eklenir.
-- ================================================

DROP TRIGGER IF EXISTS validate_question_end_date_trigger ON public.questions;

INSERT INTO public.questions (
  title, description, category_id, status, result, end_date,
  yes_odds, no_odds, total_votes, yes_votes, no_votes, yes_percentage, no_percentage, total_amount,
  is_trending, is_featured
)
SELECT
  '[Test] Süre doldu - Admin onayı bekleniyor',
  'Süre testi: bu soru süresi dolmuş. Admin panel -> Sonuç Onayı sekmesinde görünür.',
  (SELECT id FROM public.categories LIMIT 1),
  'closed',
  NULL,
  NOW() - interval '1 hour',
  2.0, 2.0, 0, 0, 0, 50, 50, 0,
  true, true
WHERE EXISTS (SELECT 1 FROM public.categories LIMIT 1);

CREATE TRIGGER validate_question_end_date_trigger
  BEFORE INSERT OR UPDATE ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION validate_question_end_date();
