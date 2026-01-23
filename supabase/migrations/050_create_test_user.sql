-- Test Kullanıcısı Oluşturma Script'i
-- Bu script'i Supabase SQL Editor'de çalıştırabilirsiniz

-- ÖNEMLİ: Bu script sadece test amaçlıdır!
-- Production'da kullanmayın!

-- 1. Önce auth.users tablosuna kullanıcı oluştur
-- NOT: Password hash'lenmeli, bu yüzden Supabase Dashboard'dan oluşturmanız önerilir
-- Ama test için direkt insert yapabilirsiniz:

-- Önce mevcut kullanıcıyı kontrol et (varsa sil)
DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Test kullanıcısını bul
  SELECT id INTO test_user_id 
  FROM auth.users 
  WHERE email = 'test@sence.app';
  
  -- Varsa sil
  IF test_user_id IS NOT NULL THEN
    -- Önce profiles'ı sil
    DELETE FROM public.profiles WHERE id = test_user_id;
    -- Sonra auth.users'ı sil
    DELETE FROM auth.users WHERE id = test_user_id;
  END IF;
END $$;

-- 2. Supabase Dashboard'dan kullanıcı oluşturmanız önerilir:
-- Dashboard > Authentication > Users > Add User
-- Email: test@sence.app
-- Password: Test123456!
-- Email Confirmed: true (işaretleyin)

-- 3. Eğer SQL ile yapmak istiyorsanız, şu script'i kullanın:
-- (Password hash'i manuel oluşturmanız gerekir)

-- Test kullanıcısı için UUID oluştur
DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  password_hash TEXT := crypt('Test123456!', gen_salt('bf')); -- bcrypt hash
BEGIN
  -- auth.users tablosuna insert (eğer yetkiniz varsa)
  -- NOT: Bu genelde sadece service_role key ile çalışır
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'test@sence.app',
    password_hash,
    NOW(), -- Email confirmed
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"username": "testuser"}',
    false,
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

  -- Profiles tablosuna insert
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
    new_user_id,
    'testuser',
    'test@sence.app',
    'Test Kullanıcı',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'Test kullanıcısı',
    10000,
    1,
    0,
    true, -- Email verified
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    email = EXCLUDED.email,
    is_verified = true;

  RAISE NOTICE 'Test kullanıcısı oluşturuldu!';
  RAISE NOTICE 'User ID: %', new_user_id;
  RAISE NOTICE 'Email: test@sence.app';
  RAISE NOTICE 'Password: Test123456!';
END $$;

-- 4. Kullanıcıyı kontrol et
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
