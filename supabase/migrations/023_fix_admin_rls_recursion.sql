-- ================================================
-- FIX ADMIN RLS RECURSION
-- ================================================

-- Mevcut admin policy'lerini sil
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can update questions" ON public.questions;

-- ================================================
-- PROFILES TABLE - FIXED POLICIES
-- ================================================

-- Mevcut profiles policy'lerini sil
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Yeni profiles policy'leri oluştur
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (true);

-- Admin'ler tüm profilleri görebilir ve güncelleyebilir
CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);

-- ================================================
-- QUESTIONS TABLE - FIXED POLICIES
-- ================================================

-- Mevcut questions policy'lerini sil
DROP POLICY IF EXISTS "Enable read access for all users" ON public.questions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.questions;
DROP POLICY IF EXISTS "Enable update for users based on created_by" ON public.questions;
DROP POLICY IF EXISTS "Enable delete for users based on created_by" ON public.questions;

-- Yeni questions policy'leri oluştur
CREATE POLICY "Enable read access for all users" ON public.questions
FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.questions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for users based on created_by" ON public.questions
FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Enable delete for users based on created_by" ON public.questions
FOR DELETE USING (auth.uid() = created_by);

-- Admin'ler tüm soruları yönetebilir
CREATE POLICY "Admins can manage all questions" ON public.questions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);

-- ================================================
-- OTHER TABLES - ADMIN POLICIES
-- ================================================

-- Predictions için admin policy
CREATE POLICY "Admins can manage all predictions" ON public.predictions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);

-- Coupons için admin policy
CREATE POLICY "Admins can manage all coupons" ON public.coupons
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);

-- Leagues için admin policy
CREATE POLICY "Admins can manage all leagues" ON public.leagues
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);

-- Notifications için admin policy
CREATE POLICY "Admins can manage all notifications" ON public.notifications
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);
