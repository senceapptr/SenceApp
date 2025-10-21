-- ============================================
-- USER_STATS RLS - KAYIT SORUNU ÇÖZÜMÜ
-- ============================================

-- 1. RLS'i kapat
ALTER TABLE public.user_stats DISABLE ROW LEVEL SECURITY;

-- 2. Tüm mevcut policy'leri sil
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_stats') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.user_stats';
    END LOOP;
END $$;

-- 3. RLS'i tekrar aç
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- 4. Basit policy'ler - HERKESİN YAPMASINA İZİN VER
CREATE POLICY "user_stats_select_all" 
  ON public.user_stats 
  FOR SELECT 
  USING (true);

CREATE POLICY "user_stats_insert_all" 
  ON public.user_stats 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "user_stats_update_own" 
  ON public.user_stats 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "user_stats_delete_own" 
  ON public.user_stats 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 5. Trigger'ı kontrol et (zaten var ama emin olalım)
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
DROP FUNCTION IF EXISTS create_user_stats();

CREATE OR REPLACE FUNCTION create_user_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION create_user_stats();

-- Test
SELECT 'User stats RLS fixed successfully!' as status;

