-- ================================================
-- EMERGENCY FIX - REMOVE ALL RLS POLICIES
-- ================================================

-- TÜM RLS POLICY'LERİNİ SİL
-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- Questions
DROP POLICY IF EXISTS "Enable read access for all users" ON public.questions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.questions;
DROP POLICY IF EXISTS "Enable update for users based on created_by" ON public.questions;
DROP POLICY IF EXISTS "Enable delete for users based on created_by" ON public.questions;
DROP POLICY IF EXISTS "Admins can view all questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can update questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can manage all questions" ON public.questions;

-- Predictions
DROP POLICY IF EXISTS "Users can view own predictions" ON public.predictions;
DROP POLICY IF EXISTS "Users can create predictions" ON public.predictions;
DROP POLICY IF EXISTS "Admins can manage all predictions" ON public.predictions;

-- Coupons
DROP POLICY IF EXISTS "Users can view own coupons" ON public.coupons;
DROP POLICY IF EXISTS "Users can create coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can manage all coupons" ON public.coupons;

-- Leagues
DROP POLICY IF EXISTS "Users can view leagues" ON public.leagues;
DROP POLICY IF EXISTS "Users can create leagues" ON public.leagues;
DROP POLICY IF EXISTS "Admins can manage all leagues" ON public.leagues;

-- Notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.notifications;

-- ================================================
-- SIMPLE RLS POLICIES - NO RECURSION
-- ================================================

-- PROFILES - Basit policy'ler
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- QUESTIONS - Basit policy'ler
CREATE POLICY "Questions are viewable by everyone" ON public.questions
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert questions" ON public.questions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own questions" ON public.questions
FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own questions" ON public.questions
FOR DELETE USING (auth.uid() = created_by);

-- PREDICTIONS - Basit policy'ler
CREATE POLICY "Predictions are viewable by everyone" ON public.predictions
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert predictions" ON public.predictions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own predictions" ON public.predictions
FOR UPDATE USING (auth.uid() = user_id);

-- COUPONS - Basit policy'ler
CREATE POLICY "Coupons are viewable by everyone" ON public.coupons
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert coupons" ON public.coupons
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own coupons" ON public.coupons
FOR UPDATE USING (auth.uid() = user_id);

-- LEAGUES - Basit policy'ler
CREATE POLICY "Leagues are viewable by everyone" ON public.leagues
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert leagues" ON public.leagues
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own leagues" ON public.leagues
FOR UPDATE USING (auth.uid() = created_by);

-- NOTIFICATIONS - Basit policy'ler
CREATE POLICY "Users can view own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON public.notifications
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

-- ================================================
-- ADMIN OVERRIDE - Sadece gerekli tablolar için
-- ================================================

-- Admin'ler için özel policy'ler (sadece gerekli tablolar)
CREATE POLICY "Admin override for profiles" ON public.profiles
FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);

CREATE POLICY "Admin override for questions" ON public.questions
FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);
