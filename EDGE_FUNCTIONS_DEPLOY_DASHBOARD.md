# Edge Functions Deploy - Dashboard Yöntemi (Kolay)

## 🎯 Supabase Dashboard'dan Deploy Etme

CLI kullanmak yerine Supabase Dashboard'dan direkt deploy edebilirsiniz.

---

## 📋 Adım 1: send-verification-otp Function'ını Oluştur

1. **Supabase Dashboard**'a gidin: https://supabase.com/dashboard
2. Projenizi seçin
3. Sol menüden **Edge Functions** > **Create a new function** tıklayın
4. Function adı: `send-verification-otp`
5. **Create function** butonuna tıklayın

### Kod İçeriğini Kopyalayın

`supabase/functions/send-verification-otp/index.ts` dosyasının **tam içeriğini** kopyalayıp Dashboard'daki editör'e yapıştırın.

### Deno.json Dosyası

Dashboard'da **deno.json** sekmesine gidin ve şu içeriği ekleyin:

```json
{
  "imports": {
    "@supabase/supabase-js": "https://esm.sh/@supabase/supabase-js@2",
    "@std/http": "https://deno.land/std@0.168.0/http/server.ts"
  }
}
```

### Deploy Edin

**Deploy** butonuna tıklayın.

---

## 📋 Adım 2: verify-otp Function'ını Oluştur

1. **Edge Functions** sayfasına geri dönün
2. **Create a new function** tıklayın
3. Function adı: `verify-otp`
4. **Create function** butonuna tıklayın

### Kod İçeriğini Kopyalayın

`supabase/functions/verify-otp/index.ts` dosyasının **tam içeriğini** kopyalayıp Dashboard'daki editör'e yapıştırın.

### Deno.json Dosyası

Dashboard'da **deno.json** sekmesine gidin ve şu içeriği ekleyin:

```json
{
  "imports": {
    "@supabase/supabase-js": "https://esm.sh/@supabase/supabase-js@2",
    "@std/http": "https://deno.land/std@0.168.0/http/server.ts"
  }
}
```

### Deploy Edin

**Deploy** butonuna tıklayın.

---

## 🔐 Adım 3: Secrets'ları Ayarlayın

1. Supabase Dashboard > **Project Settings** > **Edge Functions** > **Secrets**
2. Şu secret'ları ekleyin:

### Secret 1: SENDGRID_API_KEY
- **Name:** `SENDGRID_API_KEY`
- **Value:** SendGrid API Key'iniz (örn: `SG.xxxxx`)

### Secret 2: SENDGRID_FROM_EMAIL
- **Name:** `SENDGRID_FROM_EMAIL`
- **Value:** `sence-hi@senceapp.tr` (veya kendi email adresiniz)

**NOT:** `SUPABASE_URL` ve `SUPABASE_SERVICE_ROLE_KEY` otomatik olarak mevcut, eklemenize gerek yok.

---

## ✅ Adım 4: Test Edin

1. Uygulamanızı yeniden başlatın
2. Email verification sayfasına gidin
3. "Kodu Tekrar Gönder" butonuna tıklayın
4. Console'da hata olmamalı
5. Email'inize OTP kodu gelmeli

---

## 🔍 Hata Ayıklama

### Function Loglarını Kontrol Etme

1. Supabase Dashboard > **Edge Functions**
2. Function adına tıklayın (örn: `send-verification-otp`)
3. **Logs** sekmesine gidin
4. Hata mesajlarını kontrol edin

### Yaygın Hatalar

1. **"Missing Supabase credentials"**
   - Secrets doğru ayarlanmamış
   - Function'ı yeniden deploy edin

2. **"SendGrid API error"**
   - `SENDGRID_API_KEY` secret'ı eksik veya yanlış
   - SendGrid Dashboard'dan API key'i kontrol edin

3. **"Network request failed"**
   - Function deploy edilmemiş olabilir
   - Dashboard'da function'ın göründüğünden emin olun

---

## 📝 Dosya Yolları

Kod dosyalarınız şu konumlarda:
- `supabase/functions/send-verification-otp/index.ts`
- `supabase/functions/verify-otp/index.ts`
- `supabase/functions/send-verification-otp/deno.json`
- `supabase/functions/verify-otp/deno.json`

---

## ✅ Başarı Kontrolü

Deploy başarılı olduğunda:
- ✅ Dashboard'da her iki function da görünüyor
- ✅ Function loglarında hata yok
- ✅ Uygulamada "Network request failed" hatası yok
- ✅ Email'e OTP kodu geliyor





