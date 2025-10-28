-- ================================================
-- SAFE FIX - CHECK AND REMOVE EXISTING POLICIES
-- ================================================

-- Önce mevcut policy'leri kontrol et ve sil
-- Bu komutlar hata vermez, sadece varsa siler

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin override for profiles" ON public.profiles;

-- QUESTIONS POLICIES
DROP POLICY IF EXISTS "Enable read access for all users" ON public.questions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.questions;
DROP POLICY IF EXISTS "Enable update for users based on created_by" ON public.questions;
DROP POLICY IF EXISTS "Enable delete for users based on created_by" ON public.questions;
DROP POLICY IF EXISTS "Questions are viewable by everyone" ON public.questions;
DROP POLICY IF EXISTS "Authenticated users can insert questions" ON public.questions;
DROP POLICY IF EXISTS "Users can update own questions" ON public.questions;
DROP POLICY IF EXISTS "Users can delete own questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can view all questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can update questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can manage all questions" ON public.questions;
DROP POLICY IF EXISTS "Admin override for questions" ON public.questions;

-- PREDICTIONS POLICIES
DROP POLICY IF EXISTS "Users can view own predictions" ON public.predictions;
DROP POLICY IF EXISTS "Users can create predictions" ON public.predictions;
DROP POLICY IF EXISTS "Predictions are viewable by everyone" ON public.predictions;
DROP POLICY IF EXISTS "Authenticated users can insert predictions" ON public.predictions;
DROP POLICY IF EXISTS "Users can update own predictions" ON public.predictions;
DROP POLICY IF EXISTS "Admins can manage all predictions" ON public.predictions;

-- COUPONS POLICIES
DROP POLICY IF EXISTS "Users can view own coupons" ON public.coupons;
DROP POLICY IF EXISTS "Users can create coupons" ON public.coupons;
DROP POLICY IF EXISTS "Coupons are viewable by everyone" ON public.coupons;
DROP POLICY IF EXISTS "Authenticated users can insert coupons" ON public.coupons;
DROP POLICY IF EXISTS "Users can update own coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can manage all coupons" ON public.coupons;

-- LEAGUES POLICIES
DROP POLICY IF EXISTS "Users can view leagues" ON public.leagues;
DROP POLICY IF EXISTS "Users can create leagues" ON public.leagues;
DROP POLICY IF EXISTS "Leagues are viewable by everyone" ON public.leagues;
DROP POLICY IF EXISTS "Authenticated users can insert leagues" ON public.leagues;
DROP POLICY IF EXISTS "Users can update own leagues" ON public.leagues;
DROP POLICY IF EXISTS "Admins can manage all leagues" ON public.leagues;

-- NOTIFICATIONS POLICIES
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.notifications;

-- ================================================
-- CREATE NEW SIMPLE POLICIES
-- ================================================

-- PROFILES - Yeni basit policy'ler
CREATE POLICY "profiles_select_all" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "profiles_update_own" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- QUESTIONS - Yeni basit policy'ler
CREATE POLICY "questions_select_all" ON public.questions
FOR SELECT USING (true);

CREATE POLICY "questions_insert_auth" ON public.questions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "questions_update_own" ON public.questions
FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "questions_delete_own" ON public.questions
FOR DELETE USING (auth.uid() = created_by);

-- PREDICTIONS - Yeni basit policy'ler
CREATE POLICY "predictions_select_all" ON public.predictions
FOR SELECT USING (true);

CREATE POLICY "predictions_insert_auth" ON public.predictions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "predictions_update_own" ON public.predictions
FOR UPDATE USING (auth.uid() = user_id);

-- COUPONS - Yeni basit policy'ler
CREATE POLICY "coupons_select_all" ON public.coupons
FOR SELECT USING (true);

CREATE POLICY "coupons_insert_auth" ON public.coupons
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "coupons_update_own" ON public.coupons
FOR UPDATE USING (auth.uid() = user_id);

-- LEAGUES - Yeni basit policy'ler
CREATE POLICY "leagues_select_all" ON public.leagues
FOR SELECT USING (true);

CREATE POLICY "leagues_insert_auth" ON public.leagues
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "leagues_update_own" ON public.leagues
FOR UPDATE USING (auth.uid() = created_by);

-- NOTIFICATIONS - Yeni basit policy'ler
CREATE POLICY "notifications_select_own" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_insert_system" ON public.notifications
FOR INSERT WITH CHECK (true);

CREATE POLICY "notifications_update_own" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

-- ================================================
-- ADMIN POLICIES - Sadece gerekli tablolar için
-- ================================================

-- Admin'ler için özel yetkiler (sadece profiles ve questions)
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
