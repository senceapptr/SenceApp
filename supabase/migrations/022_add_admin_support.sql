-- ================================================
-- ADD ADMIN SUPPORT
-- ================================================

-- Profiles tablosuna admin alanı ekle
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Profiles tablosuna ban alanı ekle
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;

-- Questions tablosuna rejection_reason alanı ekle
ALTER TABLE public.questions 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- ================================================
-- ADMIN RLS POLICIES
-- ================================================

-- Admin'ler tüm profilleri görebilir
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE is_admin = TRUE
  )
);

-- Admin'ler profilleri güncelleyebilir
CREATE POLICY "Admins can update profiles" ON public.profiles
FOR UPDATE USING (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE is_admin = TRUE
  )
);

-- Admin'ler tüm soruları görebilir
CREATE POLICY "Admins can view all questions" ON public.questions
FOR SELECT USING (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE is_admin = TRUE
  )
);

-- Admin'ler soruları güncelleyebilir
CREATE POLICY "Admins can update questions" ON public.questions
FOR UPDATE USING (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE is_admin = TRUE
  )
);

-- ================================================
-- CREATE ADMIN USER (Optional)
-- ================================================

-- İlk admin kullanıcısını oluştur (email ile)
-- Bu kısmı manuel olarak yapmanız gerekebilir
-- INSERT INTO public.profiles (id, username, full_name, email, is_admin)
-- VALUES ('your-admin-user-id', 'admin', 'Admin User', 'admin@example.com', TRUE);
