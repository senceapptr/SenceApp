# Supabase Veritabanı Kurulumu

## Adım 1: SQL Dosyalarını Supabase'e Yükle

### SQL Editor Üzerinden:

1. **Supabase Dashboard**'a gidin: https://supabase.com/dashboard
2. Projenizi seçin
3. Sol menüden **SQL Editor** seçin
4. **New Query** butonuna tıklayın

### Migration Dosyalarını Sırayla Çalıştırın:

#### 1️⃣ İlk Şema (001_initial_schema.sql)
```bash
# Dosya içeriğini kopyalayıp SQL Editor'e yapıştırın
# RUN butonuna basın
```
Bu dosya tüm tabloları, indexleri ve trigger'ları oluşturur.

#### 2️⃣ Güvenlik Politikaları (002_row_level_security.sql)
```bash
# Dosya içeriğini SQL Editor'e yapıştırın
# RUN butonuna basın
```
Bu dosya Row Level Security (RLS) politikalarını ayarlar.

#### 3️⃣ Başlangıç Verileri (003_seed_data.sql)
```bash
# Dosya içeriğini SQL Editor'e yapıştırın
# RUN butonuna basın
```
Bu dosya kategoriler, görevler ve örnek sorular ekler.

## Adım 2: Storage Bucket'larını Oluştur

Sol menüden **Storage** seçin ve şu bucket'ları oluşturun:

1. **`avatars`** - Kullanıcı profil fotoğrafları
   - Public: ✅ Evet
   - File size limit: 2MB
   - Allowed types: `image/*`

2. **`covers`** - Kapak fotoğrafları
   - Public: ✅ Evet
   - File size limit: 5MB
   - Allowed types: `image/*`

3. **`questions`** - Soru görselleri
   - Public: ✅ Evet
   - File size limit: 10MB
   - Allowed types: `image/*`

### Storage Politikaları:

Her bucket için bu politikaları ekleyin:

```sql
-- Avatars bucket policies
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Adım 3: Authentication Ayarları

Sol menüden **Authentication > Providers** seçin:

### Email Authentication:
- ✅ Enable Email provider
- ☑️ Confirm email: İsteğe bağlı (test için kapalı tutabilirsiniz)

### Social Auth (İsteğe bağlı):
- Google
- Apple
- Facebook

## Adım 4: API Ayarları

**Settings > API** sayfasından kontrol edin:

- ✅ **Project URL**: `.env.local` dosyasına ekleyin
- ✅ **anon public key**: `.env.local` dosyasına ekleyin
- ℹ️ **service_role key**: Sadece backend'de kullanın (GİZLİ!)

## Adım 5: TypeScript Tiplerini Oluştur

Terminal'de şu komutu çalıştırın:

```bash
npx supabase gen types typescript --project-id "YOUR_PROJECT_ID" --schema public > lib/database.types.ts
```

> **Not:** `YOUR_PROJECT_ID` yerine kendi project ID'nizi yazın.
> Project ID'yi Settings > General sayfasından bulabilirsiniz.

## Veritabanı Yapısı

### Tablolar:

1. **profiles** - Kullanıcı profilleri
2. **user_stats** - Kullanıcı istatistikleri
3. **categories** - Soru kategorileri
4. **questions** - Sorular
5. **question_statistics** - Soru istatistikleri
6. **predictions** - Tahminler
7. **coupons** - Kuponlar
8. **coupon_selections** - Kupon seçimleri
9. **leagues** - Ligler
10. **league_members** - Lig üyeleri
11. **league_invitations** - Lig davetleri
12. **league_questions** - Lig soruları
13. **tasks** - Görevler
14. **user_tasks** - Kullanıcı görevleri
15. **notifications** - Bildirimler
16. **market_items** - Market ürünleri
17. **user_purchases** - Satın almalar
18. **activities** - Aktivite akışı

## Test Et

SQL Editor'de test sorgusu çalıştır:

```sql
-- Kategorileri listele
SELECT * FROM public.categories;

-- Görevleri listele
SELECT * FROM public.tasks;

-- Örnek soruları listele
SELECT * FROM public.questions;
```

Sonuç geliyorsa ✅ hazırsınız!

## Sonraki Adımlar

- ✅ SQL migration'ları çalıştırıldı
- ✅ Storage bucket'ları oluşturuldu
- ✅ Authentication ayarlandı
- ⏳ TypeScript tipleri generate edilecek
- ⏳ Auth Context oluşturulacak
- ⏳ API servisleri yazılacak




