-- ================================================
-- QUESTIONS STRUCTURE IMPROVEMENTS
-- Migration: 049_questions_structure_improvements.sql
-- ================================================
-- Bu migration questions tablosu yapısını iyileştirir ve validasyon ekler

-- ================================================
-- 1. STATUS TRANSITION VALIDATION
-- ================================================

-- Status geçişlerini kontrol eden function
CREATE OR REPLACE FUNCTION validate_question_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  -- Draft'tan active'e geçiş sadece admin yapabilir
  IF OLD.status = 'draft' AND NEW.status = 'active' THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    ) THEN
      RAISE EXCEPTION 'Only admins can approve questions (draft -> active)';
    END IF;
  END IF;
  
  -- Active'ten sonraki durumlar değiştirilemez (sadece admin)
  IF OLD.status IN ('active', 'closed', 'resolved') AND 
     NEW.status != OLD.status THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    ) THEN
      RAISE EXCEPTION 'Only admins can change status of active/resolved questions';
    END IF;
  END IF;
  
  -- Closed/Resolved sorular geri draft'a dönemez
  IF OLD.status IN ('closed', 'resolved') AND NEW.status = 'draft' THEN
    RAISE EXCEPTION 'Cannot revert closed/resolved questions to draft';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Status değişikliklerini kontrol et
DROP TRIGGER IF EXISTS validate_question_status_transition_trigger ON public.questions;
CREATE TRIGGER validate_question_status_transition_trigger
BEFORE UPDATE ON public.questions
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION validate_question_status_transition();

-- ================================================
-- 2. END DATE VALIDATION
-- ================================================

-- End date gelecekte olmalı (soru oluşturulurken)
CREATE OR REPLACE FUNCTION validate_question_end_date()
RETURNS TRIGGER AS $$
BEGIN
  -- Sadece yeni soru oluşturulurken kontrol et (INSERT)
  -- UPDATE'de end_date değiştirilebilir (admin için)
  IF TG_OP = 'INSERT' AND NEW.end_date <= NOW() THEN
    RAISE EXCEPTION 'End date must be in the future';
  END IF;
  
  -- UPDATE'de sadece admin end_date'i geçmişe çekebilir
  IF TG_OP = 'UPDATE' AND NEW.end_date <= NOW() THEN
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

-- Trigger: End date kontrolü
DROP TRIGGER IF EXISTS validate_question_end_date_trigger ON public.questions;
CREATE TRIGGER validate_question_end_date_trigger
BEFORE INSERT OR UPDATE ON public.questions
FOR EACH ROW
EXECUTE FUNCTION validate_question_end_date();

-- ================================================
-- 3. FEATURED/TRENDING OTOMATIK BELİRLEME (OPSİYONEL)
-- ================================================

-- Featured/Trending otomatik belirleme function
CREATE OR REPLACE FUNCTION update_question_flags()
RETURNS TRIGGER AS $$
BEGIN
  -- Sadece active sorular için flag'leri güncelle
  IF NEW.status != 'active' THEN
    NEW.is_featured := false;
    NEW.is_trending := false;
    RETURN NEW;
  END IF;
  
  -- Featured: Toplam oy > 1000 ve son 7 gün içinde oluşturulmuş
  NEW.is_featured := (
    NEW.total_votes > 1000 AND 
    NEW.created_at > NOW() - INTERVAL '7 days'
  );
  
  -- Trending: Son 24 saatte > 100 oy veya son 1 saatte > 50 oy
  NEW.is_trending := (
    (NEW.total_votes > 100 AND NEW.updated_at > NOW() - INTERVAL '24 hours') OR
    (NEW.total_votes > 50 AND NEW.updated_at > NOW() - INTERVAL '1 hour')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Soru güncellendiğinde flag'leri güncelle
-- NOT: Bu trigger şimdilik yorum satırı olarak bırakıldı
-- Çünkü manuel featured/trending set etme özelliği var
-- İhtiyaç duyulduğunda aktif edilebilir

/*
DROP TRIGGER IF EXISTS update_question_flags_trigger ON public.questions;
CREATE TRIGGER update_question_flags_trigger
BEFORE UPDATE ON public.questions
FOR EACH ROW
WHEN (
  OLD.total_votes IS DISTINCT FROM NEW.total_votes OR
  OLD.updated_at IS DISTINCT FROM NEW.updated_at OR
  OLD.status IS DISTINCT FROM NEW.status
)
EXECUTE FUNCTION update_question_flags();
*/

-- ================================================
-- 4. INDEX OPTİMİZASYONU
-- ================================================

-- Featured sorular için index
CREATE INDEX IF NOT EXISTS idx_questions_featured 
ON public.questions(id, created_at DESC) 
WHERE is_featured = true AND status = 'active';

-- Trending sorular için index
CREATE INDEX IF NOT EXISTS idx_questions_trending 
ON public.questions(id, total_votes DESC) 
WHERE is_trending = true AND status = 'active';

-- Status ve end_date için composite index (aktif sorular için)
CREATE INDEX IF NOT EXISTS idx_questions_status_end_date_active 
ON public.questions(status, end_date) 
WHERE status = 'active';

-- ================================================
-- 5. KOLON İYİLEŞTİRMELERİ (OPSİYONEL)
-- ================================================

-- 5.1. publish_date kaldırma (eğer kullanılmıyorsa)
-- ÖNCE KONTROL EDİN: publish_date kullanılıyor mu?
-- SELECT COUNT(*) FROM questions WHERE publish_date != created_at;
-- Eğer farklı değerler varsa, kaldırmayın!

-- ALTER TABLE public.questions DROP COLUMN IF EXISTS publish_date;

-- 5.2. description NOT NULL yapma (eğer istenirse)
-- ÖNCE KONTROL EDİN: NULL description'lar var mı?
-- SELECT COUNT(*) FROM questions WHERE description IS NULL;
-- Eğer NULL description'lar varsa, önce doldurun!

-- UPDATE public.questions SET description = '' WHERE description IS NULL;
-- ALTER TABLE public.questions ALTER COLUMN description SET NOT NULL;

-- ================================================
-- 6. DOKÜMANTASYON
-- ================================================

COMMENT ON FUNCTION validate_question_status_transition() IS 
'Status geçişlerini kontrol eder: Draft -> Active sadece admin, Active/Resolved değiştirilemez (sadece admin)';

COMMENT ON FUNCTION validate_question_end_date() IS 
'End date validasyonu: Yeni sorular için gelecekte olmalı, admin geçmişe çekebilir';

COMMENT ON FUNCTION update_question_flags() IS 
'Featured/Trending flaglerini otomatik belirler (opsiyonel - şimdilik yorum satırı)';

COMMENT ON COLUMN public.questions.status IS 
'Durum: draft (beklemede), active (onaylanmış), closed (kapatılmış), resolved (sonuçlanmış)';

COMMENT ON COLUMN public.questions.is_featured IS 
'Öne çıkan soru: Manuel set edilir veya otomatik belirlenir (total_votes > 1000)';

COMMENT ON COLUMN public.questions.is_trending IS 
'Trend soru: Manuel set edilir veya otomatik belirlenir (son 24 saatte > 100 oy)';

-- ================================================
-- SONUÇ
-- ================================================

-- Bu migration şu işlemleri yaptı:
-- ✅ Status transition validation eklendi
-- ✅ End date validation eklendi
-- ✅ Featured/Trending index'leri eklendi
-- ✅ Dokümantasyon eklendi
-- ⚠️ publish_date kaldırma yorum satırı (kontrol edilmeli)
-- ⚠️ description NOT NULL yorum satırı (kontrol edilmeli)
-- ⚠️ Featured/Trending otomatik belirleme yorum satırı (opsiyonel)

-- ÖNEMLİ NOTLAR:
-- 1. Status transition validation: Kullanıcılar draft soruları active yapamaz
-- 2. End date validation: Yeni sorular için gelecekte olmalı
-- 3. publish_date kaldırmadan önce kullanımını kontrol edin
-- 4. description NOT NULL yapmadan önce NULL değerleri doldurun
