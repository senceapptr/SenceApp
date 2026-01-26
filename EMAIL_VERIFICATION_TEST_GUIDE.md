# Email Verification Test Rehberi

## 📋 Ön Hazırlık

### 1. Database Migration'ı Çalıştır

**Supabase Dashboard → SQL Editor:**

```sql
-- supabase/migrations/045_add_email_verification.sql dosyasının içeriğini kopyala-yapıştır ve çalıştır

-- Kontrol:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'is_verified';

SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'email_verification_codes';
```

### 2. SendGrid Secrets Ayarla

**Terminal'de:**

```bash
# Supabase CLI ile (eğer kuruluysa)
supabase secrets set SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY_HERE
supabase secrets set SENDGRID_FROM_EMAIL=sence-hi@senceapp.tr

# VEYA Supabase Dashboard'dan:
# Project Settings → Edge Functions → Secrets → Add Secret
```

### 3. Edge Functions'ı Deploy Et

**Terminal'de:**

```bash
# Supabase CLI ile
supabase functions deploy send-verification-otp
supabase functions deploy verify-otp

# Deploy sonrası kontrol:
supabase functions list
```

**VEYA Supabase Dashboard'dan:**
- Edge Functions → New Function → Dosyaları yükle

---

## 🧪 Test Senaryoları

### Senaryo 1: SignUp Sonrası Otomatik Yönlendirme

1. **Uygulamayı başlat:**
   ```bash
   npm start
   # veya
   npx expo start
   ```

2. **Yeni kullanıcı kaydet:**
   - LoginPage'de "Kayıt Ol" butonuna tıkla
   - Email, şifre, kullanıcı adı gir
   - "Hesap Oluştur" butonuna tıkla

3. **Beklenen sonuç:**
   - ✅ SignUp başarılı olmalı
   - ✅ Otomatik olarak EmailVerificationPage açılmalı
   - ✅ Email adresine OTP kodu gönderilmiş olmalı

4. **Kontrol et:**
   - Email kutusunu (ve spam klasörünü) kontrol et
   - 6 haneli kod gelmiş olmalı

### Senaryo 2: OTP Doğrulama

1. **Email'den kodu al**
2. **EmailVerificationPage'de:**
   - 6 haneli kodu gir
   - "Doğrula" butonuna tıkla

3. **Beklenen sonuç:**
   - ✅ "Email adresiniz başarıyla doğrulandı!" mesajı
   - ✅ HomePage'e yönlendirme
   - ✅ `is_verified = true` olmalı

4. **Database kontrolü:**
   ```sql
   SELECT id, email, is_verified 
   FROM profiles 
   WHERE email = 'test@example.com';
   ```

### Senaryo 3: Kodu Tekrar Gönderme

1. **EmailVerificationPage'de:**
   - "Kodu Tekrar Gönder" butonuna tıkla
   - 60 saniye countdown başlamalı

2. **Beklenen sonuç:**
   - ✅ Yeni email gelmeli
   - ✅ Eski kod geçersiz olmalı

### Senaryo 4: Settings > Security

1. **Email verified olmayan kullanıcı için:**
   - Settings → Security tıkla
   - ✅ EmailVerificationPage açılmalı

2. **Email verified kullanıcı için:**
   - Settings → Security tıkla
   - ✅ SecuritySettingsPage açılmalı (veya console.log görmeli)

---

## 🔍 Hata Ayıklama

### Edge Function Logları

**Supabase Dashboard → Edge Functions → Logs:**

```bash
# Veya CLI ile
supabase functions logs send-verification-otp
supabase functions logs verify-otp
```

### Yaygın Hatalar

#### 1. "SENDGRID_API_KEY not set"
**Çözüm:**
```bash
supabase secrets set SENDGRID_API_KEY=your_key
```

#### 2. "User not found"
**Çözüm:**
- SignUp işleminin başarılı olduğundan emin ol
- Profile tablosunda kullanıcı var mı kontrol et:
  ```sql
  SELECT * FROM profiles WHERE id = 'user-uuid';
  ```

#### 3. "Invalid or expired code"
**Çözüm:**
- Kodun 10 dakika içinde kullanıldığından emin ol
- Email'deki kodun doğru kopyalandığından emin ol

#### 4. "Email verification codes table not found"
**Çözüm:**
- Migration'ı çalıştırdığından emin ol
  ```sql
  SELECT * FROM email_verification_codes LIMIT 1;
  ```

### Frontend Console Logları

**Chrome DevTools / React Native Debugger:**

- `console.log` çıktılarını kontrol et
- Network isteklerini kontrol et:
  - `send-verification-otp` function call
  - `verify-otp` function call

---

## 📊 Test Checklist

### Backend
- [ ] Database migration çalıştırıldı (`is_verified` column var)
- [ ] `email_verification_codes` tablosu oluşturuldu
- [ ] SendGrid secrets ayarlandı
- [ ] Edge Functions deploy edildi
- [ ] Edge Functions loglarında hata yok

### Frontend
- [ ] SignUp sonrası EmailVerificationPage açılıyor
- [ ] OTP otomatik gönderiliyor
- [ ] Email kutusunda kod var
- [ ] OTP girildiğinde doğrulama çalışıyor
- [ ] Settings > Security yönlendirmesi çalışıyor

### Database
- [ ] `profiles.is_verified` false'dan true'ya güncelleniyor
- [ ] `email_verification_codes` tablosuna kayıt ekleniyor
- [ ] Kod doğrulandıktan sonra `is_used = true` oluyor

---

## 🧪 Manuel Test Komutları

### Edge Function Test (cURL)

```bash
# Send OTP
curl -X POST \
  'https://YOUR_PROJECT.supabase.co/functions/v1/send-verification-otp' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "user-uuid-here",
    "email": "test@example.com"
  }'

# Verify OTP
curl -X POST \
  'https://YOUR_PROJECT.supabase.co/functions/v1/verify-otp' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "user-uuid-here",
    "email": "test@example.com",
    "code": "123456"
  }'
```

### Database Test Queries

```sql
-- Verification durumunu kontrol et
SELECT id, email, is_verified 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- Aktif kodları görüntüle
SELECT user_id, email, code, expires_at, is_used, attempts
FROM email_verification_codes
WHERE is_used = false
ORDER BY created_at DESC
LIMIT 10;

-- Kullanıcının kodlarını görüntüle
SELECT * 
FROM email_verification_codes
WHERE user_id = 'user-uuid-here'
ORDER BY created_at DESC;
```

---

## ✅ Başarı Kriterleri

1. **SignUp Flow:**
   - Kullanıcı kayıt oluyor → EmailVerificationPage açılıyor
   - Email kutusuna OTP kodu geliyor

2. **Verification Flow:**
   - OTP girildiğinde doğrulama başarılı
   - `profiles.is_verified = true` oluyor
   - HomePage'e yönlendiriliyor

3. **Re-send Flow:**
   - "Kodu Tekrar Gönder" çalışıyor
   - Yeni kod geliyor

4. **Settings Flow:**
   - Email verified değilse → EmailVerificationPage
   - Email verified ise → SecuritySettingsPage (veya placeholder)

---

## 🚨 Acil Durum Komutları

```bash
# Edge Function'ı tekrar deploy et
supabase functions deploy send-verification-otp --no-verify-jwt

# Secrets'ı kontrol et
supabase secrets list

# Logları canlı takip et
supabase functions logs send-verification-otp --follow
```

---

**Not:** İlk test için gerçek email adresi kullan (test@example.com çalışmayabilir, SendGrid domain verification gerektirebilir).


