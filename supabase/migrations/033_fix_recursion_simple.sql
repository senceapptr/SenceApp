-- ================================================
-- FIX INFINITE RECURSION - SIMPLE SOLUTION
-- ================================================

-- Önce tüm policy'leri sil
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Tüm tablolar için policy'leri sil
    FOR r IN (
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.schemaname || '.' || r.tablename;
    END LOOP;
END $$;

-- ================================================
-- BASIT VE GÜVENLİ RLS POLICY'LERİ
-- ================================================

-- PROFILES - Basit policy'ler
CREATE POLICY "profiles_select_all" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- QUESTIONS - Basit policy'ler
CREATE POLICY "questions_select_all" ON public.questions
FOR SELECT USING (true);

CREATE POLICY "questions_insert_auth" ON public.questions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "questions_update_auth" ON public.questions
FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "questions_delete_auth" ON public.questions
FOR DELETE USING (auth.uid() IS NOT NULL);

-- PREDICTIONS - Basit policy'ler
CREATE POLICY "predictions_select_all" ON public.predictions
FOR SELECT USING (true);

CREATE POLICY "predictions_insert_auth" ON public.predictions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "predictions_update_auth" ON public.predictions
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- COUPONS - Basit policy'ler
CREATE POLICY "coupons_select_all" ON public.coupons
FOR SELECT USING (true);

CREATE POLICY "coupons_insert_auth" ON public.coupons
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "coupons_update_auth" ON public.coupons
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- LEAGUES - Basit policy'ler
CREATE POLICY "leagues_select_all" ON public.leagues
FOR SELECT USING (true);

CREATE POLICY "leagues_insert_auth" ON public.leagues
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "leagues_update_auth" ON public.leagues
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- NOTIFICATIONS - Basit policy'ler
CREATE POLICY "notifications_select_own" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_insert_system" ON public.notifications
FOR INSERT WITH CHECK (true);

CREATE POLICY "notifications_update_own" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

-- CATEGORIES - Basit policy'ler
CREATE POLICY "categories_select_all" ON public.categories
FOR SELECT USING (true);

CREATE POLICY "categories_insert_auth" ON public.categories
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "categories_update_auth" ON public.categories
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ================================================
-- NOT: Admin override policy'leri eklemedik
-- Bu şekilde infinite recursion riski yok
-- Admin işlemleri için ayrı fonksiyonlar kullanılabilir
-- ================================================
