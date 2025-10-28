-- ================================================
-- NUCLEAR FIX - COMPLETELY RESET RLS
-- ================================================

-- 1. TÜM RLS'Yİ DEVRE DIŞI BIRAK
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- 2. TÜM POLICY'LERİ SİL (ZORLA)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Tüm tablolar için policy'leri sil
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename IN ('profiles', 'questions', 'predictions', 'coupons', 'leagues', 'notifications')
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.schemaname || '.' || r.tablename;
    END LOOP;
END $$;

-- 3. RLS'Yİ YENİDEN AKTİFLEŞTİR
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 4. SADECE EN BASİT POLICY'LERİ OLUŞTUR
-- PROFILES - Sadece temel işlemler
CREATE POLICY "profiles_read_all" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "profiles_update_own" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- QUESTIONS - Sadece temel işlemler
CREATE POLICY "questions_read_all" ON public.questions
FOR SELECT USING (true);

CREATE POLICY "questions_insert_auth" ON public.questions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "questions_update_auth" ON public.questions
FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "questions_delete_auth" ON public.questions
FOR DELETE USING (auth.uid() IS NOT NULL);

-- PREDICTIONS - Sadece temel işlemler
CREATE POLICY "predictions_read_all" ON public.predictions
FOR SELECT USING (true);

CREATE POLICY "predictions_insert_auth" ON public.predictions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "predictions_update_auth" ON public.predictions
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- COUPONS - Sadece temel işlemler
CREATE POLICY "coupons_read_all" ON public.coupons
FOR SELECT USING (true);

CREATE POLICY "coupons_insert_auth" ON public.coupons
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "coupons_update_auth" ON public.coupons
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- LEAGUES - Sadece temel işlemler
CREATE POLICY "leagues_read_all" ON public.leagues
FOR SELECT USING (true);

CREATE POLICY "leagues_insert_auth" ON public.leagues
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "leagues_update_auth" ON public.leagues
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- NOTIFICATIONS - Sadece temel işlemler
CREATE POLICY "notifications_read_auth" ON public.notifications
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "notifications_insert_system" ON public.notifications
FOR INSERT WITH CHECK (true);

CREATE POLICY "notifications_update_auth" ON public.notifications
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- 5. ADMIN OVERRIDE - Sadece gerekli tablolar için
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
