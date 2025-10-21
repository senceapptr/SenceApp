-- ============================================
-- PROFILES RLS - BASİT VE ÇALIŞIR ÇÖZÜM
-- ============================================

-- 1. Önce RLS'i kapat
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Tüm mevcut policy'leri sil
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.profiles';
    END LOOP;
END $$;

-- 3. RLS'i tekrar aç
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Basit policy'ler - HERKESİN YAPMASINA İZİN VER (kayıt için)
CREATE POLICY "profiles_select_all" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "profiles_insert_all" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "profiles_update_own" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" 
  ON public.profiles 
  FOR DELETE 
  USING (auth.uid() = id);

-- 5. Trigger'ı güncelle (yedek olarak)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, username, email, full_name, profile_image, cover_image, bio, credits, level, experience
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'Yeni Sence kullanıcısı 🎯',
    10000, 1, 0
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Test
SELECT 'RLS policies updated successfully!' as status;

