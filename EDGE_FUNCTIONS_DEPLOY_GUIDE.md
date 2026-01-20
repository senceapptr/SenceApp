# Edge Functions Deploy Rehberi

## ❌ "Network request failed" Hatası

Bu hata genellikle Edge Function'ların deploy edilmemiş olmasından kaynaklanır.

## ✅ Çözüm Adımları

### 1. Supabase CLI Kurulumu (Eğer yoksa)

```bash
npm install -g supabase
```

### 2. Supabase Projenize Bağlanın

```bash
supabase login
```

### 3. Proje ID'nizi Bulun

Supabase Dashboard > Settings > General > Reference ID

### 4. Projeyi Link Edin

```bash
supabase link --project-ref YOUR_PROJECT_ID
```

### 5. Edge Function'ları Deploy Edin

```bash
# send-verification-otp function'ını deploy et
supabase functions deploy send-verification-otp

# verify-otp function'ını deploy et
supabase functions deploy verify-otp
```

### 6. Secrets'ları Ayarlayın

```bash
# SendGrid API Key
supabase secrets set SENDGRID_API_KEY=your_sendgrid_api_key

# SendGrid From Email
supabase secrets set SENDGRID_FROM_EMAIL=sence-hi@senceapp.tr
```

**NOT:** `SUPABASE_URL` ve `SUPABASE_SERVICE_ROLE_KEY` otomatik olarak inject edilir, manuel eklemenize gerek yok.

### 7. Deploy Durumunu Kontrol Edin

Supabase Dashboard > Edge Functions sayfasına gidin:
- ✅ `send-verification-otp` görünüyor mu?
- ✅ `verify-otp` görünüyor mu?

## 🔍 Alternatif: Supabase Dashboard'dan Deploy

Eğer CLI kullanmak istemiyorsanız:

1. Supabase Dashboard > Edge Functions
2. "New Function" butonuna tıklayın
3. Function adını girin: `send-verification-otp`
4. `supabase/functions/send-verification-otp/index.ts` dosyasının içeriğini kopyalayın
5. Deploy edin
6. Aynı işlemi `verify-otp` için tekrarlayın

## 🧪 Test Etme

Deploy sonrası test etmek için:

1. Uygulamayı yeniden başlatın
2. Email verification sayfasına gidin
3. Console loglarını kontrol edin
4. "Kodu Tekrar Gönder" butonuna tıklayın

## 📝 Hata Ayıklama

### Edge Function Loglarını Görüntüleme

```bash
# send-verification-otp logları
supabase functions logs send-verification-otp

# verify-otp logları
supabase functions logs verify-otp
```

Veya Supabase Dashboard > Edge Functions > Function adı > Logs

### Yaygın Hatalar

1. **"Function not found"**
   - Edge Function deploy edilmemiş
   - Function adı yanlış yazılmış

2. **"Missing Supabase credentials"**
   - Secrets doğru ayarlanmamış
   - Service Role Key eksik

3. **"SendGrid API error"**
   - `SENDGRID_API_KEY` secret'ı eksik veya yanlış
   - SendGrid API key geçersiz

## ✅ Başarı Kontrolü

Deploy başarılı olduğunda:
- ✅ Supabase Dashboard'da function'lar görünüyor
- ✅ Function loglarında hata yok
- ✅ Uygulamada "Network request failed" hatası yok
- ✅ Email'e OTP kodu geliyor





