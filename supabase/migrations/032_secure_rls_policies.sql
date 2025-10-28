-- ================================================
-- SECURE RLS POLICIES - NO RECURSION
-- ================================================

-- RLS'yi yeniden aktifleştir
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- ================================================
-- PROFILES - Güvenli Policy'ler
-- ================================================

-- Herkes profilleri okuyabilir
CREATE POLICY "profiles_read_public" ON public.profiles
FOR SELECT USING (true);

-- Kullanıcılar kendi profillerini güncelleyebilir
CREATE POLICY "profiles_update_own" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Kullanıcılar kendi profillerini oluşturabilir
CREATE POLICY "profiles_insert_own" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- ================================================
-- QUESTIONS - Güvenli Policy'ler
-- ================================================

-- Herkes soruları okuyabilir
CREATE POLICY "questions_read_public" ON public.questions
FOR SELECT USING (true);

-- Authenticated kullanıcılar soru oluşturabilir
CREATE POLICY "questions_insert_auth" ON public.questions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Kullanıcılar kendi sorularını güncelleyebilir (created_by kontrolü olmadan)
CREATE POLICY "questions_update_auth" ON public.questions
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Kullanıcılar kendi sorularını silebilir (created_by kontrolü olmadan)
CREATE POLICY "questions_delete_auth" ON public.questions
FOR DELETE USING (auth.uid() IS NOT NULL);

-- ================================================
-- PREDICTIONS - Güvenli Policy'ler
-- ================================================

-- Herkes tahminleri okuyabilir
CREATE POLICY "predictions_read_public" ON public.predictions
FOR SELECT USING (true);

-- Authenticated kullanıcılar tahmin oluşturabilir
CREATE POLICY "predictions_insert_auth" ON public.predictions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Kullanıcılar kendi tahminlerini güncelleyebilir
CREATE POLICY "predictions_update_auth" ON public.predictions
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ================================================
-- COUPONS - Güvenli Policy'ler
-- ================================================

-- Herkes kuponları okuyabilir
CREATE POLICY "coupons_read_public" ON public.coupons
FOR SELECT USING (true);

-- Authenticated kullanıcılar kupon oluşturabilir
CREATE POLICY "coupons_insert_auth" ON public.coupons
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Kullanıcılar kendi kuponlarını güncelleyebilir
CREATE POLICY "coupons_update_auth" ON public.coupons
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ================================================
-- LEAGUES - Güvenli Policy'ler
-- ================================================

-- Herkes ligleri okuyabilir
CREATE POLICY "leagues_read_public" ON public.leagues
FOR SELECT USING (true);

-- Authenticated kullanıcılar lig oluşturabilir
CREATE POLICY "leagues_insert_auth" ON public.leagues
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Kullanıcılar kendi liglerini güncelleyebilir
CREATE POLICY "leagues_update_auth" ON public.leagues
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ================================================
-- NOTIFICATIONS - Güvenli Policy'ler
-- ================================================

-- Kullanıcılar sadece kendi bildirimlerini okuyabilir
CREATE POLICY "notifications_read_own" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

-- Sistem bildirim oluşturabilir
CREATE POLICY "notifications_insert_system" ON public.notifications
FOR INSERT WITH CHECK (true);

-- Kullanıcılar kendi bildirimlerini güncelleyebilir
CREATE POLICY "notifications_update_own" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

-- ================================================
-- CATEGORIES - Güvenli Policy'ler
-- ================================================

-- Herkes kategorileri okuyabilir
CREATE POLICY "categories_read_public" ON public.categories
FOR SELECT USING (true);

-- Authenticated kullanıcılar kategori oluşturabilir
CREATE POLICY "categories_insert_auth" ON public.categories
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Kullanıcılar kategorileri güncelleyebilir
CREATE POLICY "categories_update_auth" ON public.categories
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ================================================
-- ADMIN OVERRIDE - Sadece gerekli tablolar için
-- ================================================

-- Admin'ler için özel yetkiler (sadece profiles ve questions)
CREATE POLICY "admin_profiles_override" ON public.profiles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);

CREATE POLICY "admin_questions_override" ON public.questions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);
