-- ================================================
-- FIX: Profiles tablosuna INSERT politikası ekle
-- ================================================

-- Kullanıcılar kayıt sırasında kendi profillerini oluşturabilir
CREATE POLICY "Users can insert own profile during signup"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Alternatif olarak, authenticated kullanıcılar profil oluşturabilir
-- (Eğer yukarıdaki çalışmazsa bu politikayı kullan)
-- CREATE POLICY "Authenticated users can create profile"
--   ON public.profiles FOR INSERT
--   TO authenticated
--   WITH CHECK (auth.uid() = id);

