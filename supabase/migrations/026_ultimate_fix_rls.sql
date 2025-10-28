-- ================================================
-- ULTIMATE FIX - DISABLE RLS TEMPORARILY
-- ================================================

-- Geçici olarak RLS'yi devre dışı bırak
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- ================================================
-- DROP ALL EXISTING POLICIES (FORCE)
-- ================================================

-- Tüm mevcut policy'leri zorla sil
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Profiles policies
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.profiles';
    END LOOP;
    
    -- Questions policies
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'questions' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.questions';
    END LOOP;
    
    -- Predictions policies
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'predictions' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.predictions';
    END LOOP;
    
    -- Coupons policies
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'coupons' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.coupons';
    END LOOP;
    
    -- Leagues policies
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'leagues' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.leagues';
    END LOOP;
    
    -- Notifications policies
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'notifications' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.notifications';
    END LOOP;
END $$;

-- ================================================
-- ENABLE RLS AGAIN
-- ================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ================================================
-- CREATE MINIMAL POLICIES
-- ================================================

-- PROFILES - Minimal policies
CREATE POLICY "profiles_public_read" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "profiles_own_update" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_own_insert" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- QUESTIONS - Minimal policies
CREATE POLICY "questions_public_read" ON public.questions
FOR SELECT USING (true);

CREATE POLICY "questions_auth_insert" ON public.questions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "questions_own_update" ON public.questions
FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "questions_own_delete" ON public.questions
FOR DELETE USING (auth.uid() = created_by);

-- PREDICTIONS - Minimal policies
CREATE POLICY "predictions_public_read" ON public.predictions
FOR SELECT USING (true);

CREATE POLICY "predictions_auth_insert" ON public.predictions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "predictions_own_update" ON public.predictions
FOR UPDATE USING (auth.uid() = user_id);

-- COUPONS - Minimal policies
CREATE POLICY "coupons_public_read" ON public.coupons
FOR SELECT USING (true);

CREATE POLICY "coupons_auth_insert" ON public.coupons
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "coupons_own_update" ON public.coupons
FOR UPDATE USING (auth.uid() = user_id);

-- LEAGUES - Minimal policies
CREATE POLICY "leagues_public_read" ON public.leagues
FOR SELECT USING (true);

CREATE POLICY "leagues_auth_insert" ON public.leagues
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "leagues_own_update" ON public.leagues
FOR UPDATE USING (auth.uid() = created_by);

-- NOTIFICATIONS - Minimal policies
CREATE POLICY "notifications_own_read" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_system_insert" ON public.notifications
FOR INSERT WITH CHECK (true);

CREATE POLICY "notifications_own_update" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);
