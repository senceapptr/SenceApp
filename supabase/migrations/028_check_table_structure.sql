-- ================================================
-- CHECK TABLE STRUCTURE AND CREATE SAFE POLICIES
-- ================================================

-- Önce tabloların yapısını kontrol et
-- Bu sorgular tabloların kolonlarını gösterecek

-- Tabloların yapısını kontrol et
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'questions', 'predictions', 'coupons', 'leagues', 'notifications')
ORDER BY table_name, ordinal_position;

-- ================================================
-- CREATE SAFE POLICIES BASED ON ACTUAL STRUCTURE
-- ================================================

-- PROFILES - En basit policies
CREATE POLICY "profiles_public_read" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "profiles_own_update" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_own_insert" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- QUESTIONS - Sadece temel işlemler
CREATE POLICY "questions_public_read" ON public.questions
FOR SELECT USING (true);

CREATE POLICY "questions_auth_insert" ON public.questions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Sadece auth kontrolü, kolon referansı yok
CREATE POLICY "questions_auth_update" ON public.questions
FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "questions_auth_delete" ON public.questions
FOR DELETE USING (auth.uid() IS NOT NULL);

-- PREDICTIONS - Sadece auth kontrolü
CREATE POLICY "predictions_public_read" ON public.predictions
FOR SELECT USING (true);

CREATE POLICY "predictions_auth_insert" ON public.predictions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "predictions_auth_update" ON public.predictions
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- COUPONS - Sadece auth kontrolü
CREATE POLICY "coupons_public_read" ON public.coupons
FOR SELECT USING (true);

CREATE POLICY "coupons_auth_insert" ON public.coupons
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "coupons_auth_update" ON public.coupons
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- LEAGUES - Sadece auth kontrolü
CREATE POLICY "leagues_public_read" ON public.leagues
FOR SELECT USING (true);

CREATE POLICY "leagues_auth_insert" ON public.leagues
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "leagues_auth_update" ON public.leagues
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- NOTIFICATIONS - Sadece auth kontrolü
CREATE POLICY "notifications_auth_read" ON public.notifications
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "notifications_system_insert" ON public.notifications
FOR INSERT WITH CHECK (true);

CREATE POLICY "notifications_auth_update" ON public.notifications
FOR UPDATE USING (auth.uid() IS NOT NULL);
