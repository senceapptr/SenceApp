# Supabase Profiles & User Stats RLS Sorunu - ÇÖZÜM

## Sorun
Kayıt olurken 2 hata alınıyor:
```
Profile creation error: {"code": "42501", "message": "new row violates row-level security policy for table \"user_stats\""}
Error loading profile: {"code": "PGRST116"}
```

**Neden?** 
- `profiles` tablosu oluşturulduğunda otomatik olarak `user_stats` tablosu da oluşturuluyor (trigger)
- Ama `user_stats` tablosunda RLS var ve INSERT izni yok!

## Çözüm Adımları

### 1. Supabase Dashboard'a Git
- https://supabase.com/dashboard
- Projenizi seçin

### 2. SQL Editor'ü Aç
- Sol menüden **SQL Editor** seçin
- **New query** butonuna tıklayın

### 3. İLK OLARAK Profiles RLS'i Düzelt

```sql
-- ============================================
-- PROFILES RLS - BASİT VE ÇALIŞIR ÇÖZÜM
-- ============================================

-- 1. Önce RLS'i kapat
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Tüm mevcut policy'leri sil
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.profiles';
    END LOOP;
END $$;

-- 3. RLS'i tekrar aç
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Basit policy'ler - HERKESİN YAPMASINA İZİN VER (kayıt için)
CREATE POLICY "profiles_select_all" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "profiles_insert_all" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "profiles_update_own" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" 
  ON public.profiles 
  FOR DELETE 
  USING (auth.uid() = id);

-- 5. Trigger'ı güncelle (yedek olarak)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, username, email, full_name, profile_image, cover_image, bio, credits, level, experience
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'Yeni Sence kullanıcısı 🎯',
    10000, 1, 0
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Run** butonuna tıkla ve "Success" görmeli!

---

### 4. İKİNCİ OLARAK User Stats RLS'i Düzelt

**Yeni bir SQL query oluştur** ve şunu yapıştır:

```sql
-- ============================================
-- USER_STATS RLS - KAYIT SORUNU ÇÖZÜMÜ
-- ============================================

-- 1. RLS'i kapat
ALTER TABLE public.user_stats DISABLE ROW LEVEL SECURITY;

-- 2. Tüm mevcut policy'leri sil
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_stats') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.user_stats';
    END LOOP;
END $$;

-- 3. RLS'i tekrar aç
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- 4. Basit policy'ler - HERKESİN YAPMASINA İZİN VER
CREATE POLICY "user_stats_select_all" 
  ON public.user_stats 
  FOR SELECT 
  USING (true);

CREATE POLICY "user_stats_insert_all" 
  ON public.user_stats 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "user_stats_update_own" 
  ON public.user_stats 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "user_stats_delete_own" 
  ON public.user_stats 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 5. Trigger'ı kontrol et (zaten var ama emin olalım)
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
DROP FUNCTION IF EXISTS create_user_stats();

CREATE OR REPLACE FUNCTION create_user_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION create_user_stats();

-- Test
SELECT 'User stats RLS fixed successfully!' as status;
```

**Run** butonuna tıkla!

---

### 5. Kontrol Et
- **Authentication > Users** kısmından mevcut test kullanıcılarını sil
- Uygulamayı yeniden başlat: `npx expo start --clear`
- Kayıt olmayı dene
- **Table Editor > profiles** kısmından kullanıcının oluştuğunu kontrol et
- **Table Editor > user_stats** kısmından istatistiklerin oluştuğunu kontrol et

---

## ✅ Artık Ne Oluyor?

### Kayıt Akışı:
1. **Kullanıcı auth.users'a kaydoluyor** ✅
2. **AuthContext manuel olarak profiles oluşturuyor** ✅
3. **Profiles oluşturulunca trigger otomatik user_stats oluşturuyor** ✅
4. **RLS policy'ler izin veriyor** ✅
5. **Kayıt başarılı oluyor ve SenceFinal'e yönleniyor** ✅

### Database Tabloları:
- ✅ `auth.users` → Supabase authentication
- ✅ `public.profiles` → Kullanıcı profili (username, email, credits, level, etc.)
- ✅ `public.user_stats` → Kullanıcı istatistikleri (predictions, coupons, accuracy, etc.)

### Console Log'lar:
```
Starting signup process...
User created: [uuid]
Creating profile...
Profile created successfully
```

---

## ⚠️ Not
Bu policy'ler kayıt için açık tutuldu. Production'da daha güvenli policy'ler kullanılmalı:
- SELECT: Herkese açık (profiller görünsün)
- INSERT: Sadece kayıt sırasında (trigger + manuel)
- UPDATE: Sadece kendi profili
- DELETE: Sadece kendi profili

