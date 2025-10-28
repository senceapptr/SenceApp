-- ================================================
-- DISABLE RLS FOR EXISTING TABLES ONLY
-- ================================================

-- Önce mevcut tabloları kontrol et
-- Sadece var olan tablolar için RLS'yi devre dışı bırak

-- PROFILES - RLS'yi devre dışı bırak
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- QUESTIONS - RLS'yi devre dışı bırak
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;

-- PREDICTIONS - RLS'yi devre dışı bırak
ALTER TABLE public.predictions DISABLE ROW LEVEL SECURITY;

-- COUPONS - RLS'yi devre dışı bırak
ALTER TABLE public.coupons DISABLE ROW LEVEL SECURITY;

-- LEAGUES - RLS'yi devre dışı bırak
ALTER TABLE public.leagues DISABLE ROW LEVEL SECURITY;

-- NOTIFICATIONS - RLS'yi devre dışı bırak
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- CATEGORIES - RLS'yi devre dışı bırak
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;

-- COMMENTS - RLS'yi devre dışı bırak (varsa)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'comments') THEN
        ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- LEAGUE_MEMBERS - RLS'yi devre dışı bırak (varsa)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'league_members') THEN
        ALTER TABLE public.league_members DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- LEAGUE_CHAT_MESSAGES - RLS'yi devre dışı bırak (varsa)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'league_chat_messages') THEN
        ALTER TABLE public.league_chat_messages DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- TASKS - RLS'yi devre dışı bırak (varsa)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tasks') THEN
        ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- MARKET_ITEMS - RLS'yi devre dışı bırak (varsa)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'market_items') THEN
        ALTER TABLE public.market_items DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- USER_PURCHASES - RLS'yi devre dışı bırak (varsa)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_purchases') THEN
        ALTER TABLE public.user_purchases DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- TÜM POLICY'LERİ SİL
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
-- NOT: Bu çözüm güvenlik açısından ideal değil
-- Ancak uygulamanın çalışması için gerekli
-- Daha sonra güvenli RLS policy'leri eklenebilir
-- ================================================
