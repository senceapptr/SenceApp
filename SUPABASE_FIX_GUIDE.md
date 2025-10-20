# 🔧 Supabase RLS Hatası Çözümü

## ❌ Hata
```
Error creating profile: {"code": "42501", "details": null, "hint": null, 
"message": "new row violates row-level security policy for table \"profiles\""}
```

## 🔍 Sorun
`profiles` tablosunda INSERT politikası eksik. Bu yüzden yeni kullanıcılar kayıt olurken profil oluşturamıyor.

## ✅ Çözüm

### Yöntem 1: Supabase Dashboard (Önerilen - 2 Dakika)

1. **Supabase Dashboard'a Git**
   - https://supabase.com/dashboard adresine git
   - Projenizi seçin

2. **SQL Editor'ı Aç**
   - Sol menüden **SQL Editor** tıklayın
   - Veya doğrudan: `Project > SQL Editor`

3. **SQL Kodunu Çalıştır**
   Aşağıdaki kodu yapıştırıp **RUN** (Çalıştır) butonuna tıklayın:

   ```sql
   CREATE POLICY "Users can insert own profile during signup"
     ON public.profiles FOR INSERT
     WITH CHECK (auth.uid() = id);
   ```

4. **Başarı Mesajı**
   - "Success. No rows returned" mesajı görmelisiniz
   - Bu normal ve doğru bir sonuçtur

5. **Test Et**
   - Uygulamayı yeniden başlat
   - Yeni kullanıcı kaydı yap
   - Artık hata almamalısın! ✅

### Yöntem 2: Supabase CLI (İleri Düzey)

Eğer Supabase CLI kuruluysa:

```bash
# Migration dosyasını yükle
supabase db push

# Veya migration'ı çalıştır
supabase migration up
```

### Yöntem 3: psql ile (Terminal)

```bash
# Supabase veritabanına bağlan
psql YOUR_DATABASE_CONNECTION_STRING

# SQL komutunu çalıştır
CREATE POLICY "Users can insert own profile during signup"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

## 📋 Kontrol Listesi

- [ ] Supabase Dashboard'a giriş yaptım
- [ ] SQL Editor'ı açtım
- [ ] SQL kodunu yapıştırdım
- [ ] RUN butonuna tıkladım
- [ ] "Success" mesajı gördüm
- [ ] Uygulamayı test ettim
- [ ] Kayıt başarıyla tamamlandı

## 🔒 Politika Açıklaması

```sql
CREATE POLICY "Users can insert own profile during signup"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

**Ne yapıyor?**
- Authenticated (giriş yapmış) kullanıcıların kendi profilerini oluşturmasına izin verir
- `auth.uid() = id` kontrolü: Kullanıcı sadece kendi ID'si ile profil oluşturabilir
- Güvenlik: Kullanıcılar başkalarının profillerini oluşturamaz

## 🧪 Test Senaryosu

1. Uygulamayı aç
2. "Kayıt Ol" butonuna tıkla
3. Bilgileri doldur:
   - Kullanıcı adı: test123
   - E-posta: test@example.com
   - Şifre: 123456
4. "Kayıt Ol" butonuna tıkla
5. ✅ Başarılı kayıt mesajı görmelisin
6. ✅ SenceFinal ekranına yönlendirilmelisin

## 📊 Mevcut RLS Politikaları

Şu anda profiles tablosunda:

| İşlem  | Politika | Açıklama |
|--------|----------|----------|
| SELECT | ✅ Var   | Kullanıcılar kendi profillerini görebilir |
| UPDATE | ✅ Var   | Kullanıcılar kendi profillerini güncelleyebilir |
| INSERT | ❌ YOK!  | **Bu eksikti - şimdi eklendi** |
| DELETE | ❌ Yok   | Profil silme işlemi yok (güvenlik için) |

## 🐛 Alternatif Sorun Giderme

Eğer hala hata alıyorsan:

### 1. RLS'in Aktif Olduğunu Kontrol Et
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';
```

### 2. Mevcut Politikaları Kontrol Et
```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

### 3. Auth Kullanıcısını Kontrol Et
```sql
SELECT auth.uid();  -- Null olmamalı!
```

### 4. Eğer Çalışmazsa - Geçici Çözüm (Önerilmez)
```sql
-- Sadece test için! Production'da kullanma!
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
```

## 💡 İpuçları

- Supabase ücretsiz planında tüm RLS özellikleri kullanılabilir
- RLS politikaları anlık çalışır, restart gerekmez
- Dashboard'da politikaları görsel olarak da görebilirsin: `Authentication > Policies`

## 📚 Daha Fazla Bilgi

- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Docs](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

## ✅ Başarı Sonrası

Sorun çözüldüğünde:
- ✅ Kullanıcı kayıt olabilir
- ✅ Profil otomatik oluşturulur (10,000 kredi ile)
- ✅ SenceFinal ekranına yönlendirilir
- ✅ Giriş/çıkış sorunsuz çalışır

---

Herhangi bir sorun yaşarsan, Supabase Dashboard > Logs bölümünden detaylı hata loglarını kontrol edebilirsin.

