-- ================================================
-- Süresi bitmiş ama result atanmamış soruları cancelled yap
-- Böylece 057'deki trigger coupon_selections ve coupons'ı günceller
-- Migration: 059_backfill_ended_questions_and_coupons.sql
-- ================================================
-- Problem: end_date < NOW() olan sorularda result NULL kaldığı için
-- coupon_selections ve coupons hâlâ pending kalıyordu.
-- Çözüm: Bu soruları result = 'cancelled' yapıyoruz; 057 trigger'ı
-- coupon_selections status'unu güncelleyip kupon status'unu won/lost/cancelled yapacak.
-- ================================================
-- Not: 049'deki validate_question_end_date_trigger, end_date geçmiş olan satırda
-- UPDATE'e izin vermiyor (sadece admin). Migration sırasında auth.uid() yok olduğu
-- için trigger'ı geçici kaldırıp UPDATE sonrası tekrar oluşturuyoruz.
-- ================================================

DROP TRIGGER IF EXISTS validate_question_end_date_trigger ON public.questions;

UPDATE public.questions
SET result = 'cancelled'
WHERE end_date < NOW()
  AND result IS NULL;

CREATE TRIGGER validate_question_end_date_trigger
  BEFORE INSERT OR UPDATE ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION validate_question_end_date();

-- Yukarıdaki UPDATE, 057'deki trigger (update_coupon_selections_on_question_resolve)
-- sayesinde her satır için:
-- 1. İlgili coupon_selections.status -> 'cancelled' güncellenir
-- 2. update_coupon_status_if_resolved(coupon_id) çağrılır, kupon won/lost/cancelled olur
-- Ek bir backfill gerekmez.
