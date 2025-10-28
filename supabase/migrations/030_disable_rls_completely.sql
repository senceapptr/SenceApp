-- ================================================
-- EMERGENCY FIX - DISABLE RLS COMPLETELY
-- ================================================

-- Bu acil durum çözümü - RLS'yi tamamen devre dışı bırakır
-- Uygulama çalışır hale gelir, güvenlik daha sonra eklenebilir

-- TÜM TABLOLARDA RLS'Yİ DEVRE DIŞI BIRAK
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases DISABLE ROW LEVEL SECURITY;

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
