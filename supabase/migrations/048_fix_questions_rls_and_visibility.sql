-- ================================================
-- FIX QUESTIONS RLS AND VISIBILITY
-- Migration: 048_fix_questions_rls_and_visibility.sql
-- ================================================
-- Bu migration questions tablosu için güvenlik ve görünürlük düzeltmeleri yapar

-- ================================================
-- 1. MEVCUT POLICY'LERİ TEMİZLE
-- ================================================

-- Eski policy'leri kaldır
DROP POLICY IF EXISTS "questions_read_public" ON public.questions;
DROP POLICY IF EXISTS "questions_insert_auth" ON public.questions;
DROP POLICY IF EXISTS "questions_update_auth" ON public.questions;
DROP POLICY IF EXISTS "questions_delete_auth" ON public.questions;
DROP POLICY IF EXISTS "admin_questions_override" ON public.questions;

-- ================================================
-- 2. YENİ GÜVENLİ POLICY'LER
-- ================================================

-- 2.1. SELECT Policy - Görünürlük Kontrolü
-- - Active sorular: Herkes görebilir
-- - Draft sorular: Sadece oluşturan kullanıcı ve admin görebilir
-- - Closed/Resolved sorular: Herkes görebilir
CREATE POLICY "questions_read_visibility" ON public.questions
FOR SELECT USING (
  -- Active, closed, resolved sorular herkes görebilir
  status IN ('active', 'closed', 'resolved') OR
  -- Draft sorular sadece oluşturan ve admin görebilir
  (status = 'draft' AND (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  ))
);

-- 2.2. INSERT Policy - Authenticated kullanıcılar soru oluşturabilir
CREATE POLICY "questions_insert_auth" ON public.questions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 2.3. UPDATE Policy - Kullanıcılar sadece draft soruları güncelleyebilir, adminler tüm soruları
CREATE POLICY "questions_update_own" ON public.questions
FOR UPDATE USING (
  -- Kullanıcılar sadece kendi draft sorularını güncelleyebilir
  (created_by = auth.uid() AND status = 'draft') OR
  -- Adminler tüm soruları güncelleyebilir
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);

-- 2.4. DELETE Policy - Sadece oluşturan kullanıcı ve admin silebilir
CREATE POLICY "questions_delete_own" ON public.questions
FOR DELETE USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);

-- ================================================
-- 3. INDEX OPTİMİZASYONU (Görünürlük için)
-- ================================================

-- Status ve created_by için composite index (draft sorular için)
CREATE INDEX IF NOT EXISTS idx_questions_status_created_by 
ON public.questions(status, created_by) 
WHERE status = 'draft';

-- Status ve end_date için index (aktif sorular için)
CREATE INDEX IF NOT EXISTS idx_questions_status_end_date 
ON public.questions(status, end_date) 
WHERE status = 'active';

-- ================================================
-- 4. FEATURED/TRENDING OTOMATIK BELİRLEME (OPSİYONEL)
-- ================================================

-- NOT: Bu trigger şimdilik yorum satırı olarak bırakıldı
-- İhtiyaç duyulduğunda aktif edilebilir

/*
-- Featured/Trending otomatik belirleme function
CREATE OR REPLACE FUNCTION update_question_flags()
RETURNS TRIGGER AS $$
BEGIN
  -- Featured: Toplam oy > 1000 ve son 7 gün içinde oluşturulmuş
  NEW.is_featured := (
    NEW.total_votes > 1000 AND 
    NEW.created_at > NOW() - INTERVAL '7 days' AND
    NEW.status = 'active'
  );
  
  -- Trending: Son 24 saatte > 100 oy veya son 1 saatte > 50 oy
  NEW.is_trending := (
    (NEW.total_votes > 100 AND NEW.updated_at > NOW() - INTERVAL '24 hours') OR
    (NEW.total_votes > 50 AND NEW.updated_at > NOW() - INTERVAL '1 hour')
  ) AND NEW.status = 'active';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Soru güncellendiğinde flag'leri güncelle
CREATE TRIGGER update_question_flags_trigger
BEFORE UPDATE ON public.questions
FOR EACH ROW
WHEN (
  OLD.total_votes IS DISTINCT FROM NEW.total_votes OR
  OLD.updated_at IS DISTINCT FROM NEW.updated_at
)
EXECUTE FUNCTION update_question_flags();
*/

-- ================================================
-- 5. MEVCUT DRAFT SORULARI KONTROL ET
-- ================================================

-- Draft soruların created_by bilgisini kontrol et
-- Eğer created_by NULL ise, sorun var demektir
DO $$
DECLARE
  draft_count INTEGER;
  null_created_by_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO draft_count FROM public.questions WHERE status = 'draft';
  SELECT COUNT(*) INTO null_created_by_count FROM public.questions WHERE status = 'draft' AND created_by IS NULL;
  
  IF null_created_by_count > 0 THEN
    RAISE WARNING 'Draft sorulardan % tanesinin created_by bilgisi NULL!', null_created_by_count;
  END IF;
  
  RAISE NOTICE 'Toplam % draft soru bulundu', draft_count;
END $$;

-- ================================================
-- 6. DOKÜMANTASYON
-- ================================================

COMMENT ON POLICY "questions_read_visibility" ON public.questions IS 
'Görünürlük kontrolü: Active sorular herkes görebilir, draft sorular sadece oluşturan ve admin görebilir';

COMMENT ON POLICY "questions_update_own" ON public.questions IS 
'Güncelleme kontrolü: Sadece soru oluşturan kullanıcı ve admin güncelleyebilir';

COMMENT ON POLICY "questions_delete_own" ON public.questions IS 
'Silme kontrolü: Sadece soru oluşturan kullanıcı ve admin silebilir';

-- ================================================
-- SONUÇ
-- ================================================

-- Bu migration şu işlemleri yaptı:
-- ✅ Draft sorular sadece oluşturan ve admin görebilir
-- ✅ Active/Closed/Resolved sorular herkes görebilir
-- ✅ Güncelleme/Silme işlemleri sadece oluşturan ve admin yapabilir
-- ✅ Performans için index'ler eklendi
-- ✅ Dokümantasyon eklendi

-- ÖNEMLİ NOTLAR:
-- 1. Bu migration geri alınamaz değişiklikler içerir
-- 2. Production'a uygulamadan önce mutlaka test edin
-- 3. Backup alın!
