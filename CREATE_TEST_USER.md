# Test Kullanıcısı Oluşturma Rehberi

## Yöntem 1: Supabase Dashboard (ÖNERİLEN - En Kolay)

1. **Supabase Dashboard'a gidin**
   - https://supabase.com/dashboard
   - Projenizi seçin

2. **Authentication > Users** sayfasına gidin

3. **"Add User"** butonuna tıklayın

4. **Bilgileri girin:**
   - **Email:** `test@sence.app`
   - **Password:** `Test123456!`
   - **Email Confirmed:** ✅ (işaretleyin - önemli!)
   - **Auto Confirm User:** ✅ (işaretleyin)

5. **"Create User"** butonuna tıklayın

6. **Profili oluşturmak için SQL Editor'de şu script'i çalıştırın:**

```sql
-- Kullanıcı ID'sini al
DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Email'den kullanıcı ID'sini bul
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = 'test@sence.app';
  
  IF user_id IS NOT NULL THEN
    -- Profil oluştur
    INSERT INTO public.profiles (
      id,
      username,
      email,
      full_name,
      profile_image,
      cover_image,
      bio,
      credits,
      level,
      experience,
      is_verified,
      created_at,
      updated_at
    ) VALUES (
      user_id,
      'testuser',
      'test@sence.app',
      'Test Kullanıcı',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      'Test kullanıcısı',
      10000,
      1,
      0,
      true,
      NOW(),
      NOW()
    ) ON CONFLICT (id) DO UPDATE SET
      username = EXCLUDED.username,
      email = EXCLUDED.email,
      is_verified = true;
    
    RAISE NOTICE 'Profil oluşturuldu! User ID: %', user_id;
  ELSE
    RAISE NOTICE 'Kullanıcı bulunamadı! Önce Dashboard''dan kullanıcı oluşturun.';
  END IF;
END $$;
```

## Yöntem 2: Sadece SQL (Gelişmiş)

Eğer SQL ile direkt oluşturmak istiyorsanız, `supabase/migrations/050_create_test_user.sql` dosyasını çalıştırın.

**NOT:** Bu yöntem için `crypt` extension'ının aktif olması gerekir. Eğer hata alırsanız:

```sql
-- Extension'ı aktif et
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

## Giriş Bilgileri

- **Email:** `test@sence.app`
- **Password:** `Test123456!`

## Kullanıcıyı Kontrol Etme

```sql
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.username,
  p.full_name,
  p.credits,
  p.is_verified
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'test@sence.app';
```

## Sorun Giderme

### Kullanıcı oluşturuldu ama giriş yapamıyorum
- Email Confirmed işaretli mi kontrol edin
- `is_verified = true` olmalı profiles tablosunda

### Profil oluşturulmadı
- Trigger çalışmamış olabilir
- Manuel olarak yukarıdaki SQL script'ini çalıştırın

### RLS hatası alıyorum
- Admin olarak çalıştırdığınızdan emin olun
- Veya RLS'yi geçici olarak devre dışı bırakın (sadece test için)
