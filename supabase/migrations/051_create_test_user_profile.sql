-- Test Kullanıcısı Profili Oluşturma (Basit Versiyon)
-- ÖNCE: Supabase Dashboard > Authentication > Users > Add User
-- Email: test@sence.app, Password: Test123456!, Email Confirmed: ✅

-- Profil oluştur veya güncelle
DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Email'den kullanıcı ID'sini bul
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = 'test@sence.app';
  
  IF user_id IS NOT NULL THEN
    -- Profil oluştur veya güncelle
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
      true, -- Email verified
      NOW(),
      NOW()
    ) ON CONFLICT (id) DO UPDATE SET
      username = EXCLUDED.username,
      email = EXCLUDED.email,
      is_verified = true,
      updated_at = NOW();
    
    RAISE NOTICE '✅ Profil oluşturuldu/güncellendi!';
    RAISE NOTICE 'User ID: %', user_id;
  ELSE
    RAISE NOTICE '❌ Kullanıcı bulunamadı!';
    RAISE NOTICE 'Önce Supabase Dashboard > Authentication > Users > Add User ile kullanıcı oluşturun.';
    RAISE NOTICE 'Email: test@sence.app';
    RAISE NOTICE 'Password: Test123456!';
    RAISE NOTICE 'Email Confirmed: ✅ (işaretleyin)';
  END IF;
END $$;

-- Kullanıcıyı kontrol et
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.username,
  p.full_name,
  p.credits,
  p.is_verified,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL AND p.is_verified = true THEN '✅ Hazır'
    ELSE '❌ Eksik'
  END as durum
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'test@sence.app';
