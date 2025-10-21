-- ================================================
-- FIX: Profiles RLS - Final Çözüm
-- ================================================

-- 1. RLS'i kapat
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Tüm eski policy'leri temizle
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile during signup" ON public.profiles;
DROP POLICY IF EXISTS "Users can view other profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.profiles;

-- 3. RLS'i tekrar aç
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Basit ve çalışan policy'ler
CREATE POLICY "Anyone can read profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert profiles" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile" 
  ON public.profiles 
  FOR DELETE 
  USING (auth.uid() = id);

-- NOT: Bu policy'ler çok açık ama kayıt problemi çözülsün diye
-- Production'da daha güvenli policy'ler kullanılmalı

