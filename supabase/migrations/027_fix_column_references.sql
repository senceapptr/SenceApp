-- ================================================
-- FIX COLUMN REFERENCES
-- ================================================

-- Önce tabloların yapısını kontrol et ve düzelt
-- Eğer created_by kolonu yoksa, user_id kullan

-- PROFILES - Basit policies (created_by yok)
CREATE POLICY "profiles_public_read" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "profiles_own_update" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_own_insert" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- QUESTIONS - created_by kontrolü
CREATE POLICY "questions_public_read" ON public.questions
FOR SELECT USING (true);

CREATE POLICY "questions_auth_insert" ON public.questions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- created_by varsa kullan, yoksa user_id kullan
CREATE POLICY "questions_own_update" ON public.questions
FOR UPDATE USING (
  auth.uid() = COALESCE(created_by, user_id)
);

CREATE POLICY "questions_own_delete" ON public.questions
FOR DELETE USING (
  auth.uid() = COALESCE(created_by, user_id)
);

-- PREDICTIONS - user_id kullan
CREATE POLICY "predictions_public_read" ON public.predictions
FOR SELECT USING (true);

CREATE POLICY "predictions_auth_insert" ON public.predictions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "predictions_own_update" ON public.predictions
FOR UPDATE USING (auth.uid() = user_id);

-- COUPONS - user_id kullan
CREATE POLICY "coupons_public_read" ON public.coupons
FOR SELECT USING (true);

CREATE POLICY "coupons_auth_insert" ON public.coupons
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "coupons_own_update" ON public.coupons
FOR UPDATE USING (auth.uid() = user_id);

-- LEAGUES - created_by kontrolü
CREATE POLICY "leagues_public_read" ON public.leagues
FOR SELECT USING (true);

CREATE POLICY "leagues_auth_insert" ON public.leagues
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- created_by varsa kullan, yoksa user_id kullan
CREATE POLICY "leagues_own_update" ON public.leagues
FOR UPDATE USING (
  auth.uid() = COALESCE(created_by, user_id)
);

-- NOTIFICATIONS - user_id kullan
CREATE POLICY "notifications_own_read" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_system_insert" ON public.notifications
FOR INSERT WITH CHECK (true);

CREATE POLICY "notifications_own_update" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);
