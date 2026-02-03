-- ================================================
-- Test sorularını trending ve featured yap (listede görünsün)
-- Migration: 065_test_questions_trending.sql
-- ================================================
-- end_date trigger güncellemede de çalışıyor; geçmiş end_date'li test sorusu yüzünden
-- UPDATE engelleniyor. Trigger geçici kaldırılıp sonra tekrar oluşturuluyor.
-- ================================================

DROP TRIGGER IF EXISTS validate_question_end_date_trigger ON public.questions;

UPDATE public.questions
SET is_trending = true, is_featured = true, updated_at = NOW()
WHERE title LIKE '[Test]%';

CREATE TRIGGER validate_question_end_date_trigger
  BEFORE INSERT OR UPDATE ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION validate_question_end_date();
