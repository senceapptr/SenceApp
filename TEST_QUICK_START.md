# 🚀 Email Verification - Hızlı Test Başlangıcı

## 1️⃣ Adım 1: Database Migration (5 dakika)

**Supabase Dashboard → SQL Editor:**

1. `supabase/migrations/045_add_email_verification.sql` dosyasını aç
2. İçeriğini kopyala
3. SQL Editor'e yapıştır ve çalıştır
4. ✅ Kontrol et:
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'profiles' AND column_name = 'is_verified';
   -- Sonuç: is_verified görünmeli
   ```

## 2️⃣ Adım 2: Edge Functions Deploy (10 dakika)

### Seçenek A: Supabase CLI ile

```bash
# Terminal'de proje root'unda:

# 1. Supabase CLI login (eğer yapmadıysan)
supabase login

# 2. Projeyi link et
supabase link --project-ref your-project-id

# 3. Secrets ekle
supabase secrets set SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY_HERE
supabase secrets set SENDGRID_FROM_EMAIL=sence-hi@senceapp.tr

# 4. Functions deploy
supabase functions deploy send-verification-otp
supabase functions deploy verify-otp

# 5. Kontrol
supabase functions list
```

### Seçenek B: Supabase Dashboard ile

1. **Project Settings → Edge Functions → Secrets**
   - `SENDGRID_API_KEY` ekle
   - `SENDGRID_FROM_EMAIL` ekle

2. **Edge Functions → Create Function**
   - Function name: `send-verification-otp`
   - `supabase/functions/send-verification-otp/index.ts` ve `deno.json` dosyalarını yükle
   - Deploy

   - Function name: `verify-otp`
   - `supabase/functions/verify-otp/index.ts` ve `deno.json` dosyalarını yükle
   - Deploy

## 3️⃣ Adım 3: Uygulamayı Test Et (2 dakika)

```bash
# Terminal'de
npm start
# veya
npx expo start
```

### Test Senaryosu:

1. **Yeni kullanıcı kaydet:**
   - Email: `test@example.com` (gerçek email kullan!)
   - Şifre: `123456`
   - Kullanıcı adı: `testuser`

2. **Beklenen:**
   - ✅ SignUp başarılı
   - ✅ Otomatik EmailVerificationPage açılmalı
   - ✅ Email kutusuna kod gelmeli

3. **Kodu doğrula:**
   - Email'den 6 haneli kodu al
   - EmailVerificationPage'de gir
   - "Doğrula" butonuna tıkla

4. **Beklenen:**
   - ✅ "Başarılı" mesajı
   - ✅ HomePage'e yönlendirme

## 4️⃣ Adım 4: Hata Kontrolü

### Edge Function Logları:

**Supabase Dashboard → Edge Functions → Logs**

Veya terminal:
```bash
supabase functions logs send-verification-otp --follow
```

### Yaygın Hatalar:

❌ **"SENDGRID_API_KEY not set"**
```bash
supabase secrets set SENDGRID_API_KEY=your_key
```

❌ **"User not found"**
- SignUp'ın başarılı olduğundan emin ol
- Profile tablosunda kullanıcı var mı kontrol et

❌ **Email gelmiyor**
- Spam klasörünü kontrol et
- SendGrid dashboard'da email gönderim durumunu kontrol et

---

## ✅ Hızlı Kontrol Listesi

- [ ] Migration çalıştırıldı (`is_verified` column var)
- [ ] SendGrid secrets ayarlandı
- [ ] Edge Functions deploy edildi
- [ ] Uygulama çalışıyor
- [ ] SignUp sonrası EmailVerificationPage açılıyor
- [ ] Email'de kod var
- [ ] OTP doğrulama çalışıyor

---

## 🧪 Manuel Test (cURL)

```bash
# Test için gerçek bir user ID ve email kullan

# Send OTP
curl -X POST \
  'https://YOUR_PROJECT.supabase.co/functions/v1/send-verification-otp' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "user-uuid-from-auth",
    "email": "your-test-email@example.com"
  }'

# Verify OTP (email'den aldığın kodu kullan)
curl -X POST \
  'https://YOUR_PROJECT.supabase.co/functions/v1/verify-otp' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "user-uuid-from-auth",
    "email": "your-test-email@example.com",
    "code": "123456"
  }'
```

---

**Detaylı rehber için:** `EMAIL_VERIFICATION_TEST_GUIDE.md` dosyasına bak.


