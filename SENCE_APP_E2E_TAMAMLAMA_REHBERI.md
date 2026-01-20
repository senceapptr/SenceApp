# 🚀 SenceApp - End-to-End Tamamlama Rehberi

> **Son Güncelleme:** 14 Ocak 2026  
> **Mevcut Durum:** %85-90 Tamamlandı  
> **MVP'ye Kalan Süre:** 2-4 saat  
> **Production Ready:** 1-2 gün

---

## 📋 İçindekiler

1. [Mevcut Durum Özeti](#1-mevcut-durum-özeti)
2. [Kritik Eksiklikler](#2-kritik-eksiklikler)
3. [Supabase Kurulum ve Yapılandırma](#3-supabase-kurulum-ve-yapılandırma)
4. [Edge Functions Deploy](#4-edge-functions-deploy)
5. [Database Migrations](#5-database-migrations)
6. [RLS Policy Düzeltmeleri](#6-rls-policy-düzeltmeleri)
7. [Storage Bucket Kurulumu](#7-storage-bucket-kurulumu)
8. [iOS Simulator ve Expo Go](#8-ios-simulator-ve-expo-go)
9. [Test Senaryoları](#9-test-senaryoları)
10. [Kalan Özellikler](#10-kalan-özellikler)
11. [Production Checklist](#11-production-checklist)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Mevcut Durum Özeti

### ✅ Tamamlanan Özellikler

| Kategori | Özellik | Durum | Açıklama |
|----------|---------|-------|----------|
| **Auth** | SignIn | ✅ | Email/Password ile giriş |
| **Auth** | SignUp | ✅ | Yeni kullanıcı kaydı |
| **Auth** | SignOut | ✅ | Çıkış işlemi |
| **Auth** | Email Verification | ✅ | OTP ile doğrulama (Edge Function) |
| **Auth** | Session Management | ✅ | AsyncStorage ile persist |
| **Profile** | View Profile | ✅ | Profil görüntüleme |
| **Profile** | Edit Profile | ✅ | Profil düzenleme |
| **Profile** | User Stats | ✅ | Kullanıcı istatistikleri |
| **Questions** | List Questions | ✅ | Soru listeleme |
| **Questions** | Question Detail | ✅ | Soru detayı |
| **Questions** | Write Question | ⚠️ | RLS sorunu |
| **Questions** | Category Filter | ✅ | Kategori filtreleme |
| **Questions** | Search | ✅ | Soru arama |
| **Predictions** | Make Prediction | ✅ | Tahmin yapma |
| **Predictions** | View Predictions | ✅ | Tahminleri görüntüleme |
| **Coupons** | Create Coupon | ✅ | Kupon oluşturma |
| **Coupons** | View Coupons | ✅ | Kuponları görüntüleme |
| **Coupons** | Coupon Stats | ✅ | Kupon istatistikleri |
| **Leagues** | Public Leagues | ✅ | Herkese açık ligler |
| **Leagues** | Create League | ✅ | Lig oluşturma |
| **Leagues** | Join League | ✅ | Lige katılma |
| **Leagues** | Leaderboard | ✅ | Sıralama tablosu |
| **Leagues** | League Chat | ✅ | Lig sohbeti |
| **Market** | View Products | ✅ | Ürünleri görüntüleme |
| **Market** | Purchase | ✅ | Satın alma |
| **Tasks** | Daily Tasks | ✅ | Günlük görevler |
| **Tasks** | Weekly Tasks | ✅ | Haftalık görevler |
| **Notifications** | List | ✅ | Bildirim listesi |
| **Notifications** | Badge Count | ✅ | Okunmamış sayısı |
| **Settings** | All Settings | ✅ | Tüm ayarlar |
| **Admin** | Dashboard | ✅ | Admin paneli |
| **Admin** | Approve Questions | ✅ | Soru onaylama |
| **Admin** | User Management | ⚠️ | Temel düzeyde |

### 📊 Sayfa ve Servis Sayıları

```
📁 Sayfalar: 25+
📁 Servis Dosyaları: 19
📁 Migration Dosyaları: 45
📁 Component Dosyaları: 205+
📁 Edge Functions: 2
```

---

## 2. Kritik Eksiklikler

### 🔴 HEMEN YAPILMASI GEREKENLER

#### 2.1 Environment Variables Kontrolü

`.env.local` dosyanız mevcut. İçeriğinde şunların olduğundan emin olun:

```env
# .env.local dosyası içeriği kontrol listesi
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (opsiyonel)
```

**Kontrol Komutu:**
```bash
# .env.local içeriğini kontrol et (hassas bilgileri gizle)
cat .env.local | grep -E "^EXPO_PUBLIC" | cut -d'=' -f1
```

**Beklenen Çıktı:**
```
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
```

#### 2.2 RLS Policy Sorunları

Soru yazma özelliği şu anda çalışmıyor. Nedeni: RLS policy'leri.

**Sorunun Kaynağı:**
- `030_disable_rls_completely.sql` - RLS tamamen kapatılmış (GÜVENLİK RİSKİ!)
- Birçok düzeltme migrasyonu uygulanmış (019-033)

#### 2.3 Edge Functions Deploy Edilmemiş Olabilir

Email verification için Edge Functions gerekli:
- `send-verification-otp`
- `verify-otp`

#### 2.4 Database Types Eksik

`lib/database.types.ts` dosyası sadece şablon içeriyor.

---

## 3. Supabase Kurulum ve Yapılandırma

### 3.1 Supabase Dashboard Kontrolü

1. **Supabase Dashboard'a git:** https://app.supabase.com
2. **Projenizi seçin**
3. **Aşağıdaki kontrolleri yapın:**

#### Kontrol 1: Database Tables
```
Settings > Database > Tables

✅ profiles
✅ questions
✅ categories
✅ predictions
✅ coupons
✅ coupon_selections
✅ leagues
✅ league_members
✅ league_chat_messages
✅ notifications
✅ tasks
✅ user_tasks
✅ market_items
✅ user_purchases
✅ comments
✅ email_verification_codes
✅ credit_transactions
```

#### Kontrol 2: Authentication Settings
```
Authentication > Settings

✅ Enable email confirmations: KAPALI olmalı (kendi OTP sistemimiz var)
✅ Site URL: Doğru ayarlanmış mı?
✅ Redirect URLs: Doğru ayarlanmış mı?
```

#### Kontrol 3: API Keys
```
Settings > API

📋 Project URL: Kopyala → .env.local'e EXPO_PUBLIC_SUPABASE_URL olarak ekle
📋 anon public key: Kopyala → .env.local'e EXPO_PUBLIC_SUPABASE_ANON_KEY olarak ekle
📋 service_role key: Kopyala → .env.local'e EXPO_PUBLIC_SUPABASE_SERVICE_KEY olarak ekle (opsiyonel)
```

### 3.2 Supabase CLI Kurulumu

```bash
# Global olarak kur
npm install -g supabase

# Versiyonu kontrol et
supabase --version

# Login ol
supabase login

# Projeyi link et (YOUR_PROJECT_ID yerine gerçek ID'yi yaz)
# Project ID: Settings > General > Reference ID
supabase link --project-ref YOUR_PROJECT_ID
```

---

## 4. Edge Functions Deploy

### 4.1 Mevcut Edge Functions

```
supabase/functions/
├── deno.json
├── send-verification-otp/
│   ├── deno.json
│   ├── index.ts
│   └── README.md
└── verify-otp/
    ├── deno.json
    ├── index.ts
    └── README.md
```

### 4.2 Deploy Adımları

```bash
# Proje kök dizininde olduğunuzdan emin olun
cd /Users/metesevinti/SenceApp-7

# Edge Function'ları deploy et
supabase functions deploy send-verification-otp
supabase functions deploy verify-otp
```

### 4.3 Secrets Ayarlama

```bash
# SendGrid API Key (email gönderimi için)
supabase secrets set SENDGRID_API_KEY=your_sendgrid_api_key

# SendGrid gönderici email
supabase secrets set SENDGRID_FROM_EMAIL=sence-hi@senceapp.tr
```

**NOT:** `SUPABASE_URL` ve `SUPABASE_SERVICE_ROLE_KEY` otomatik olarak inject edilir.

### 4.4 Deploy Doğrulama

```bash
# Function loglarını kontrol et
supabase functions logs send-verification-otp --tail

# Veya Dashboard'dan kontrol et:
# Supabase Dashboard > Edge Functions > send-verification-otp
```

### 4.5 SendGrid Kurulumu (Email için)

1. **SendGrid hesabı oluştur:** https://sendgrid.com
2. **API Key al:** Settings > API Keys > Create API Key
3. **Sender Authentication:** Settings > Sender Authentication > Single Sender Verification
4. **API Key'i Supabase'e ekle:**
   ```bash
   supabase secrets set SENDGRID_API_KEY=SG.xxxxxxxx
   ```

---

## 5. Database Migrations

### 5.1 Mevcut Migration Dosyaları (45 adet)

```
supabase/migrations/
├── 001_initial_schema.sql
├── 002_row_level_security.sql
├── 003_seed_data.sql
├── 004_fix_profile_insert_policy.sql
├── 005_auto_create_profile_trigger.sql
├── 006_fix_profiles_rls_final.sql
├── 007_simplify_profiles_rls.sql
├── 008_fix_user_stats_rls.sql
├── 009_add_comments_table.sql
├── 010_fix_leagues_infinite_recursion.sql
├── 011_fix_leagues_and_add_test_data.sql
├── 012_add_league_chat_messages.sql
├── 013_fix_market_schema.sql
├── 014_add_market_images.sql
├── 015_fix_user_tasks_rls.sql
├── 016_fix_task_types.sql
├── 017_add_notification_seed_data.sql
├── 017_add_settings_tables.sql (DUPLICATE!)
├── 018_fix_notifications_rls.sql
├── 019_fix_questions_rls.sql
├── 020_create_storage_buckets.sql
├── 021_fix_storage_policies.sql
├── 022_add_admin_support.sql
├── 023_add_coupon_display_id.sql
├── 023_fix_admin_rls_recursion.sql (DUPLICATE!)
├── 024_create_get_user_coupons_function.sql
├── 024_emergency_fix_rls.sql (DUPLICATE!)
├── 025_safe_fix_rls.sql
├── 026_ultimate_fix_rls.sql
├── 027_fix_column_references.sql
├── 028_check_table_structure.sql
├── 029_nuclear_fix_rls.sql
├── 030_disable_rls_completely.sql (⚠️ GÜVENLİK RİSKİ!)
├── 031_disable_rls_existing_tables.sql
├── 032_secure_rls_policies.sql
├── 033_fix_recursion_simple.sql
├── 034_fix_coupon_display_id_start.sql
├── 035_safe_fix_coupon_display_id.sql
├── 036_create_increase_user_credits_function.sql
├── 037_create_resolve_coupon_function.sql
├── 038_create_credit_transactions_table.sql
├── 039_create_decrease_user_credits_function.sql
├── 040_fix_credit_transactions_policies.sql
├── 041_fix_decrease_user_credits_function.sql
├── 042_update_question_votes_trigger.sql
├── 043_add_test_predictions.sql
├── 044_sync_coupon_selections_to_predictions.sql
├── 045_add_email_verification.sql
```

### 5.2 Migration Uygulama

```bash
# Tüm migration'ları sırayla uygula
supabase db push

# Veya tek tek uygula (sorun varsa)
supabase migration repair --status applied 001_initial_schema
supabase migration repair --status applied 002_row_level_security
# ... devam eder
```

### 5.3 Migration Durumu Kontrol

```bash
# Uygulanan migration'ları listele
supabase migration list
```

---

## 6. RLS Policy Düzeltmeleri

### 6.1 Mevcut Sorun

`030_disable_rls_completely.sql` ile RLS kapatılmış. Bu **ciddi bir güvenlik riski**!

### 6.2 Güvenli RLS Policy'leri

Aşağıdaki SQL'i Supabase SQL Editor'da çalıştırın:

```sql
-- ================================================
-- SECURE RLS POLICIES - SenceApp
-- ================================================

-- 1. RLS'i Etkinleştir (tüm tablolar için)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- 2. Mevcut Policy'leri Temizle
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- ================================================
-- PROFILES
-- ================================================
CREATE POLICY "Users can view all profiles"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- ================================================
-- QUESTIONS
-- ================================================
CREATE POLICY "Anyone can view active questions"
ON public.questions FOR SELECT
USING (status = 'active' OR status = 'closed' OR status = 'resolved' OR created_by = auth.uid());

CREATE POLICY "Users can create questions"
ON public.questions FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own draft questions"
ON public.questions FOR UPDATE
USING (auth.uid() = created_by AND status = 'draft');

-- ================================================
-- CATEGORIES
-- ================================================
CREATE POLICY "Anyone can view categories"
ON public.categories FOR SELECT
USING (true);

-- ================================================
-- PREDICTIONS
-- ================================================
CREATE POLICY "Users can view their own predictions"
ON public.predictions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create predictions"
ON public.predictions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ================================================
-- COUPONS
-- ================================================
CREATE POLICY "Users can view their own coupons"
ON public.coupons FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create coupons"
ON public.coupons FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ================================================
-- COUPON_SELECTIONS
-- ================================================
CREATE POLICY "Users can view coupon selections"
ON public.coupon_selections FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.coupons
        WHERE coupons.id = coupon_selections.coupon_id
        AND coupons.user_id = auth.uid()
    )
);

CREATE POLICY "Users can create coupon selections"
ON public.coupon_selections FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.coupons
        WHERE coupons.id = coupon_selections.coupon_id
        AND coupons.user_id = auth.uid()
    )
);

-- ================================================
-- LEAGUES
-- ================================================
CREATE POLICY "Anyone can view public leagues"
ON public.leagues FOR SELECT
USING (type = 'public' OR creator_id = auth.uid());

CREATE POLICY "Users can create leagues"
ON public.leagues FOR INSERT
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their leagues"
ON public.leagues FOR UPDATE
USING (auth.uid() = creator_id);

-- ================================================
-- LEAGUE_MEMBERS
-- ================================================
CREATE POLICY "Members can view league members"
ON public.league_members FOR SELECT
USING (
    user_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.leagues
        WHERE leagues.id = league_members.league_id
        AND leagues.type = 'public'
    )
);

CREATE POLICY "Users can join leagues"
ON public.league_members FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave leagues"
ON public.league_members FOR UPDATE
USING (auth.uid() = user_id);

-- ================================================
-- LEAGUE_CHAT_MESSAGES
-- ================================================
CREATE POLICY "Members can view chat messages"
ON public.league_chat_messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.league_members
        WHERE league_members.league_id = league_chat_messages.league_id
        AND league_members.user_id = auth.uid()
        AND league_members.status = 'active'
    )
);

CREATE POLICY "Members can send chat messages"
ON public.league_chat_messages FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM public.league_members
        WHERE league_members.league_id = league_chat_messages.league_id
        AND league_members.user_id = auth.uid()
        AND league_members.status = 'active'
    )
);

-- ================================================
-- NOTIFICATIONS
-- ================================================
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

-- ================================================
-- TASKS
-- ================================================
CREATE POLICY "Anyone can view tasks"
ON public.tasks FOR SELECT
USING (true);

-- ================================================
-- USER_TASKS
-- ================================================
CREATE POLICY "Users can view their own tasks"
ON public.user_tasks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
ON public.user_tasks FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks"
ON public.user_tasks FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ================================================
-- MARKET_ITEMS
-- ================================================
CREATE POLICY "Anyone can view market items"
ON public.market_items FOR SELECT
USING (true);

-- ================================================
-- USER_PURCHASES
-- ================================================
CREATE POLICY "Users can view their own purchases"
ON public.user_purchases FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create purchases"
ON public.user_purchases FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ================================================
-- COMMENTS
-- ================================================
CREATE POLICY "Anyone can view comments"
ON public.comments FOR SELECT
USING (true);

CREATE POLICY "Users can create comments"
ON public.comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
ON public.comments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON public.comments FOR DELETE
USING (auth.uid() = user_id);

-- ================================================
-- EMAIL_VERIFICATION_CODES
-- ================================================
CREATE POLICY "Users can view their own verification codes"
ON public.email_verification_codes FOR SELECT
USING (auth.uid() = user_id);

-- ================================================
-- CREDIT_TRANSACTIONS
-- ================================================
CREATE POLICY "Users can view their own transactions"
ON public.credit_transactions FOR SELECT
USING (auth.uid() = user_id);
```

---

## 7. Storage Bucket Kurulumu

### 7.1 Supabase Dashboard'dan Oluşturma

1. **Supabase Dashboard > Storage**
2. **New Bucket** butonuna tıkla
3. **Bucket adı:** `user-images`
4. **Public bucket:** ✅ Aktif
5. **Create Bucket**

### 7.2 SQL ile Oluşturma

```sql
-- Storage bucket oluştur
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-images', 'user-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-images');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'user-images' AND
    auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'user-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'user-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 8. iOS Simulator ve Expo Go

### 8.1 Expo Go ile Çalıştırma

```bash
# Proje dizinine git
cd /Users/metesevinti/SenceApp-7

# Bağımlılıkları yükle
npm install

# Cache temizle ve başlat
npx expo start -c
```

**Expo Go Uyumlu Özellikler:**
- ✅ Authentication
- ✅ Navigation
- ✅ API Calls
- ✅ AsyncStorage
- ⚠️ Image Picker (fallback mevcut)
- ⚠️ Camera (fallback mevcut)

### 8.2 iOS Simulator ile Çalıştırma

```bash
# iOS için prebuild
npx expo prebuild

# iOS Simulator'da çalıştır
npx expo run:ios

# Veya doğrudan
npm run ios
```

### 8.3 Development Build

```bash
# Development client kurulumu
npx expo install expo-dev-client

# iOS build
eas build --profile development --platform ios

# Build sonrası çalıştır
npx expo start --dev-client
```

### 8.4 Olası Hatalar ve Çözümleri

#### Hata: "Supabase URL ve Anon Key gerekli!"
```
Çözüm: .env.local dosyasını kontrol et, değerler doğru mu?
```

#### Hata: "Network request failed"
```
Çözüm: 
1. İnternet bağlantısını kontrol et
2. Supabase projenin çalışır durumda olduğundan emin ol
3. Edge Functions deploy edilmiş mi kontrol et
```

#### Hata: "RLS policy violation"
```
Çözüm: Bölüm 6'daki RLS policy'lerini uygula
```

---

## 9. Test Senaryoları

### 9.1 Authentication Testleri

```markdown
[ ] Yeni kullanıcı kaydı yapılabiliyor
[ ] Email verification OTP gönderiliyor
[ ] OTP doğrulama çalışıyor
[ ] Giriş yapılabiliyor
[ ] Çıkış yapılabiliyor
[ ] Session persist ediyor (uygulama kapatılıp açılınca)
```

### 9.2 Ana Sayfa Testleri

```markdown
[ ] Sorular yükleniyor
[ ] Kategoriler görüntüleniyor
[ ] Trend sorular görüntüleniyor
[ ] Featured carousel çalışıyor
[ ] Pull-to-refresh çalışıyor
```

### 9.3 Soru Detay Testleri

```markdown
[ ] Soru detayı açılıyor
[ ] Evet/Hayır butonları çalışıyor
[ ] Oran gösterimi doğru
[ ] Yorumlar yükleniyor
[ ] İlgili sorular görüntüleniyor
```

### 9.4 Kupon Testleri

```markdown
[ ] Kupon drawer açılıyor
[ ] Seçimler ekleniyor
[ ] Toplam oran hesaplanıyor
[ ] Kupon oluşturulabiliyor
[ ] Kuponlarım sayfasında görüntüleniyor
```

### 9.5 Lig Testleri

```markdown
[ ] Public ligler görüntüleniyor
[ ] Lige katılınabiliyor
[ ] Lig sıralaması görüntüleniyor
[ ] Lig sohbeti çalışıyor
[ ] Yeni lig oluşturulabiliyor
```

### 9.6 Profil Testleri

```markdown
[ ] Profil bilgileri görüntüleniyor
[ ] Profil düzenlenebiliyor
[ ] Kredi bakiyesi görüntüleniyor
[ ] Kullanıcı istatistikleri doğru
```

### 9.7 Soru Yazma Testleri

```markdown
[ ] Soru formu açılıyor
[ ] Kategori seçimi çalışıyor (çoklu seçim)
[ ] Tarih seçimi çalışıyor
[ ] Soru gönderilebiliyor
[ ] Draft sorular listeleniyor
```

---

## 10. Kalan Özellikler

### 🔴 Kritik (MVP için gerekli)

| Özellik | Tahmini Süre | Açıklama |
|---------|--------------|----------|
| RLS Policy Düzeltmeleri | 30 dk | Güvenlik için şart |
| Edge Functions Deploy | 15 dk | Email verification için |
| Storage Bucket | 10 dk | Image upload için |
| Soru Yazma Testi | 30 dk | RLS düzeltmesi sonrası |

### 🟡 Önemli (Production için önerilen)

| Özellik | Tahmini Süre | Açıklama |
|---------|--------------|----------|
| Image Upload | 2 saat | Profil/Kapak/Soru görseli |
| Real-time Updates | 2 saat | Supabase subscriptions |
| Push Notifications | 3 saat | Expo Notifications |
| Admin Panel Geliştirme | 2 saat | User management |

### 🟢 İyileştirmeler (Gelecek için)

| Özellik | Tahmini Süre | Açıklama |
|---------|--------------|----------|
| Offline Support | 4 saat | AsyncStorage caching |
| Performance Optimization | 3 saat | Lazy loading, memoization |
| Analytics | 2 saat | Mixpanel/Amplitude |
| Error Tracking | 1 saat | Sentry |
| A/B Testing | 2 saat | Feature flags |

---

## 11. Production Checklist

### 11.1 Güvenlik

```markdown
[ ] RLS policy'leri aktif ve doğru
[ ] Service Role Key sadece backend'de
[ ] Anon Key sadece public işlemler için
[ ] HTTPS zorunlu
[ ] Rate limiting aktif
```

### 11.2 Performance

```markdown
[ ] Image optimization
[ ] API response caching
[ ] Bundle size < 10MB
[ ] Splash screen optimized
[ ] Lazy loading aktif
```

### 11.3 Monitoring

```markdown
[ ] Error tracking (Sentry)
[ ] Analytics (Mixpanel/Amplitude)
[ ] API monitoring
[ ] Database monitoring
[ ] Edge Function logs
```

### 11.4 App Store / Play Store

```markdown
[ ] App icons hazır
[ ] Screenshots hazır
[ ] Privacy Policy
[ ] Terms of Service
[ ] App description
[ ] Keywords
[ ] Age rating
```

---

## 12. Troubleshooting

### 12.1 Sık Karşılaşılan Hatalar

#### "relation 'xxx' does not exist"
```
Neden: Migration uygulanmamış
Çözüm: supabase db push veya SQL Editor'dan migration çalıştır
```

#### "permission denied for table xxx"
```
Neden: RLS policy eksik veya yanlış
Çözüm: Bölüm 6'daki policy'leri uygula
```

#### "JWT expired"
```
Neden: Token süresi dolmuş
Çözüm: Auth autoRefreshToken aktif olmalı (zaten aktif)
```

#### "Edge Function not found"
```
Neden: Function deploy edilmemiş
Çözüm: supabase functions deploy <function-name>
```

#### "SendGrid API error"
```
Neden: SendGrid API key yanlış veya eksik
Çözüm: supabase secrets set SENDGRID_API_KEY=xxx
```

### 12.2 Debug Modları

```typescript
// Supabase debug mode
import { supabase } from '@/lib/supabase';

// Console'da tüm istekleri göster
supabase.realtime.setAuth('debug');
```

### 12.3 Log Kontrolü

```bash
# Edge Function logları
supabase functions logs send-verification-otp --tail
supabase functions logs verify-otp --tail

# Database logları
# Supabase Dashboard > Database > Logs
```

---

## 📞 Hızlı Başlangıç Komutları

```bash
# 1. Projeye git
cd /Users/metesevinti/SenceApp-7

# 2. Bağımlılıkları yükle
npm install

# 3. .env.local kontrol et
cat .env.local

# 4. Supabase CLI kur ve bağlan
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_ID

# 5. Edge Functions deploy et
supabase functions deploy send-verification-otp
supabase functions deploy verify-otp

# 6. Secrets ayarla
supabase secrets set SENDGRID_API_KEY=your_key

# 7. Uygulamayı başlat
npx expo start -c
```

---

## 📊 Özet Tablo

| Adım | Durum | Süre | Öncelik |
|------|-------|------|---------|
| .env.local kontrolü | ✅ Mevcut | - | - |
| Edge Functions Deploy | ⚠️ Kontrol et | 15 dk | 🔴 |
| RLS Policy Düzeltme | ⚠️ Gerekli | 30 dk | 🔴 |
| Storage Bucket | ⚠️ Kontrol et | 10 dk | 🔴 |
| Database Migrations | ✅ Mevcut | - | - |
| Test Senaryoları | ⚠️ Yapılmalı | 1 saat | 🟡 |
| Image Upload | ❌ Eksik | 2 saat | 🟡 |
| Real-time | ❌ Eksik | 2 saat | 🟢 |
| Push Notifications | ❌ Eksik | 3 saat | 🟢 |

---

**Toplam Tahmini Süre:**
- MVP: 2-4 saat
- Production Ready: 1-2 gün
- Tam Özellikli: 1 hafta

---

*Bu rehber SenceApp projesinin tamamlanması için hazırlanmıştır. Sorularınız için geliştirici ile iletişime geçin.*
