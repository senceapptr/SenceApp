-- ================================================
-- RLS sonsuz döngü düzeltmesi: profiles tablosu
-- ================================================
-- "Admin override for profiles" policy'si admin kontrolü için profiles'a
-- SELECT atıyor, bu da RLS'i tekrar tetikleyip sonsuz recursion'a yol açıyor.
-- Bu iki policy kaldırılıyor. Profil okuma zaten "Profiles are viewable by everyone" ile herkese açık.

DROP POLICY IF EXISTS "Admin override for profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin override for questions" ON public.questions;
