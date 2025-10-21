-- ================================================
-- OTOMATIK PROFİL OLUŞTURMA TRİGGER
-- ================================================
-- Kullanıcı kayıt olduğunda otomatik profil oluşturur

-- Profile trigger fonksiyonu oluştur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, full_name, credits, level, experience)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    10000,
    1,
    0
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger oluştur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- NOT: Bu trigger RLS'i bypass eder (SECURITY DEFINER)
-- Yeni kullanıcı kayıt olduğunda otomatik profil oluşturulur

