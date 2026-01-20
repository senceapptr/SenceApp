-- ================================================
-- EMAIL VERIFICATION SYSTEM
-- Migration: 045_add_email_verification.sql
-- ================================================

-- 1. profiles tablosuna is_verified column ekle
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Mevcut kullanıcılar için is_verified = false olacak (default)
-- Yeni kullanıcılar için de false olarak başlayacak

-- 2. email_verification_codes tablosu oluştur
CREATE TABLE IF NOT EXISTS public.email_verification_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  code TEXT NOT NULL, -- 6 haneli kod (örn: "123456")
  expires_at TIMESTAMPTZ NOT NULL,
  is_used BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0, -- Yanlış deneme sayısı
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Index'ler (performans için)
-- NOT: WHERE clause'unda NOW() kullanamayız (IMMUTABLE değil)
-- expires_at kontrolü sorgu sırasında yapılacak

CREATE INDEX IF NOT EXISTS idx_verification_codes_user_email 
ON public.email_verification_codes(user_id, email, is_used) 
WHERE is_used = false;

CREATE INDEX IF NOT EXISTS idx_verification_codes_code 
ON public.email_verification_codes(code, is_used) 
WHERE is_used = false;

-- expires_at için ayrı index (WHERE olmadan)
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires 
ON public.email_verification_codes(expires_at);

-- 4. Otomatik temizlik fonksiyonu (eski kodları sil)
CREATE OR REPLACE FUNCTION cleanup_expired_verification_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM public.email_verification_codes
  WHERE expires_at < NOW() - INTERVAL '1 day' OR is_used = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RLS Policies
ALTER TABLE public.email_verification_codes ENABLE ROW LEVEL SECURITY;

-- Kullanıcı kendi kodlarını görebilir (sadece unused ve geçerli olanlar)
CREATE POLICY "Users can view their own unused codes"
ON public.email_verification_codes
FOR SELECT
USING (
  auth.uid() = user_id 
  AND is_used = false 
  AND expires_at > NOW()
);

-- Kullanıcı kendi kodlarını okuyabilir (verify için)
CREATE POLICY "Users can read their own codes for verification"
ON public.email_verification_codes
FOR SELECT
USING (auth.uid() = user_id);

-- Edge Functions için: Service role zaten RLS'i bypass eder
-- Bu yüzden insert/update için ayrı policy gerekmez

-- 6. Comment ekle (dokümantasyon için)
COMMENT ON TABLE public.email_verification_codes IS 'Email doğrulama kodları - OTP sistem için';
COMMENT ON COLUMN public.email_verification_codes.code IS '6 haneli doğrulama kodu';
COMMENT ON COLUMN public.email_verification_codes.expires_at IS 'Kodun son geçerlilik tarihi (genelde 10 dakika)';
COMMENT ON COLUMN public.email_verification_codes.attempts IS 'Yanlış deneme sayısı (güvenlik için)';

COMMENT ON COLUMN public.profiles.is_verified IS 'Email adresinin doğrulanıp doğrulanmadığı';

