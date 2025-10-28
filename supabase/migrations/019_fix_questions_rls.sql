-- ================================================
-- FIX QUESTIONS TABLE RLS POLICIES
-- ================================================

-- Mevcut RLS policy'lerini sil
DROP POLICY IF EXISTS "Enable read access for all users" ON public.questions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.questions;
DROP POLICY IF EXISTS "Enable update for users based on created_by" ON public.questions;
DROP POLICY IF EXISTS "Enable delete for users based on created_by" ON public.questions;

-- Yeni RLS policy'lerini oluştur
CREATE POLICY "Enable read access for all users" ON public.questions
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.questions
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for users based on created_by" ON public.questions
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Enable delete for users based on created_by" ON public.questions
    FOR DELETE USING (auth.uid() = created_by);

