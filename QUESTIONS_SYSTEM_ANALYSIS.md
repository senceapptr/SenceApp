# 📊 Questions Sistemi - Detaylı Analiz

> **Tarih:** Ocak 2026  
> **Amaç:** Questions tablosu ve görüntüleme sisteminin tam analizi

---

## 📋 İçindekiler

1. [Database Yapısı](#1-database-yapısı)
2. [RLS Policies](#2-rls-policies)
3. [Frontend Görüntüleme](#3-frontend-görüntüleme)
4. [Servisler](#4-servisler)
5. [Tespit Edilen Sorunlar](#5-tespit-edilen-sorunlar)
6. [Çözüm Önerileri](#6-çözüm-önerileri)

---

## 1. Database Yapısı

### 1.1. Questions Tablosu

```sql
CREATE TABLE public.questions (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  secondary_category_id UUID REFERENCES categories(id),  -- ⚠️ Kullanılmıyor
  third_category_id UUID REFERENCES categories(id),     -- ⚠️ Kullanılmıyor
  image_url TEXT,
  yes_odds DECIMAL(10,2) DEFAULT 2.0,
  no_odds DECIMAL(10,2) DEFAULT 2.0,
  total_votes INTEGER DEFAULT 0,
  yes_votes INTEGER DEFAULT 0,
  no_votes INTEGER DEFAULT 0,
  yes_percentage DECIMAL(5,2) DEFAULT 0,
  no_percentage DECIMAL(5,2) DEFAULT 0,
  total_amount BIGINT DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'closed', 'resolved')),
  result TEXT CHECK (result IN ('yes', 'no', 'cancelled')),
  publish_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  resolved_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  rejection_reason TEXT,  -- Admin için
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.2. İlişkili Tablolar

| Tablo | İlişki | Açıklama |
|-------|--------|----------|
| `categories` | category_id → categories.id | Primary kategori |
| `categories` | secondary_category_id → categories.id | Secondary kategori (kullanılmıyor) |
| `categories` | third_category_id → categories.id | Third kategori (kullanılmıyor) |
| `profiles` | created_by → profiles.id | Soru oluşturan kullanıcı |
| `predictions` | question_id → questions.id | Soruya yapılan tahminler |
| `comments` | question_id → questions.id | Soruya yapılan yorumlar |
| `coupon_selections` | question_id → questions.id | Kuponlarda kullanılan sorular |
| `question_statistics` | question_id → questions.id | Soru istatistikleri |

---

## 2. RLS Policies

### 2.1. Mevcut Policies

```sql
-- Herkes soruları okuyabilir
CREATE POLICY "questions_read_public" ON public.questions
FOR SELECT USING (true);

-- Authenticated kullanıcılar soru oluşturabilir
CREATE POLICY "questions_insert_auth" ON public.questions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Kullanıcılar soruları güncelleyebilir (created_by kontrolü YOK!)
CREATE POLICY "questions_update_auth" ON public.questions
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Kullanıcılar soruları silebilir (created_by kontrolü YOK!)
CREATE POLICY "questions_delete_auth" ON public.questions
FOR DELETE USING (auth.uid() IS NOT NULL);

-- Admin override
CREATE POLICY "admin_questions_override" ON public.questions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);
```

### 2.2. Sorunlar

1. **Güvenlik Sorunu:** Her authenticated kullanıcı her soruyu güncelleyebilir/silebilir
2. **Draft Sorular:** Draft sorular herkes tarafından görülebilir (RLS'de status kontrolü yok)
3. **Admin Override:** Admin policy recursive olabilir (profiles tablosuna bakıyor)

---

## 3. Frontend Görüntüleme

### 3.1. HomePage

**Veri Yükleme:**
```typescript
// Featured questions
questionsService.getFeaturedQuestions()
// Filtre: status = 'active' AND is_featured = true

// Trending questions  
questionsService.getTrendingQuestions()
// Filtre: status = 'active' AND is_trending = true
```

**Kullanılan Veriler:**
- `id`, `title`, `image_url`
- `total_votes`, `yes_percentage`
- `yes_odds`, `no_odds`
- `end_date` (timeLeft hesaplama için)
- `categories` (name, color, icon)

**Kullanılmayan Veriler:**
- `secondary_category_id`, `third_category_id` ❌
- `description` (HomePage'de gösterilmiyor)
- `created_by` (soru oluşturan kullanıcı bilgisi yok)

### 3.2. CategoryQuestionsPage

**Veri Yükleme:**
```typescript
questionsService.getQuestionsByCategory(categoryId)
// Filtre: status = 'active' AND category_id = categoryId
```

**Sorun:** Secondary ve third category'ler kontrol edilmiyor!

### 3.3. QuestionDetailPage

**Veri Yükleme:**
```typescript
questionsService.getQuestionById(questionId)
// Tüm detaylar + categories + profiles + question_statistics
```

---

## 4. Servisler

### 4.1. questionsService.getFeaturedQuestions()

```typescript
.select(`
  *,
  categories!questions_category_id_fkey (...)
`)
.eq('status', 'active')
.eq('is_featured', true)
```

**Sorun:** Sadece primary category join ediliyor, secondary/third yok.

### 4.2. questionsService.getTrendingQuestions()

```typescript
.select(`
  *,
  categories!questions_category_id_fkey (...)
`)
.eq('status', 'active')
.eq('is_trending', true)
.order('total_votes', { ascending: false })
```

**Sorun:** Sadece primary category join ediliyor.

### 4.3. questionsService.getQuestionsByCategory()

```typescript
.eq('category_id', categoryId)
```

**Sorun:** Secondary ve third category'ler kontrol edilmiyor!

### 4.4. questionsService.getQuestionById()

```typescript
.select(`
  *,
  categories!questions_category_id_fkey (...),
  secondary_category:categories!questions_secondary_category_id_fkey (...),
  third_category:categories!questions_third_category_id_fkey (...),
  profiles (...)
`)
```

**İyi:** Tüm kategoriler join ediliyor.

---

## 5. Tespit Edilen Sorunlar

### 🔴 Kritik Sorunlar

1. **RLS Güvenlik Açığı**
   - Her authenticated kullanıcı her soruyu güncelleyebilir/silebilir
   - `created_by` kontrolü yok

2. **Draft Sorular Görünür**
   - RLS'de status kontrolü yok
   - Frontend'de filtre var ama RLS'de yok (güvenlik riski)

3. **Secondary/Third Category Kullanılmıyor**
   - Frontend'de sadece primary category gösteriliyor
   - CategoryQuestionsPage'de secondary/third kontrol edilmiyor

### 🟡 Orta Öncelikli Sorunlar

4. **is_featured ve is_trending Manuel**
   - Otomatik belirlenmiyor
   - Admin panel'den manuel set edilmeli

5. **Question Statistics Kullanılmıyor**
   - `question_statistics` tablosu var ama frontend'de kullanılmıyor
   - `questions` tablosundaki kolonlar kullanılıyor

6. **Soru Oluşturan Kullanıcı Bilgisi Yok**
   - HomePage'de soru oluşturan kullanıcı gösterilmiyor
   - QuestionDetailPage'de var

### 🟢 Düşük Öncelikli Sorunlar

7. **Image URL Fallback**
   - Hardcoded fallback image kullanılıyor
   - Daha iyi bir sistem olabilir

8. **TimeLeft Hesaplama**
   - Her component'te ayrı hesaplanıyor
   - Utility function olabilir

---

## 6. Çözüm Önerileri

### 6.1. RLS Policy Düzeltmeleri

```sql
-- Draft sorular sadece oluşturan kullanıcı ve admin görebilir
CREATE POLICY "questions_read_public_active" ON public.questions
FOR SELECT USING (
  status = 'active' OR 
  (status = 'draft' AND created_by = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Kullanıcılar sadece kendi sorularını güncelleyebilir
CREATE POLICY "questions_update_own" ON public.questions
FOR UPDATE USING (
  created_by = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Kullanıcılar sadece kendi sorularını silebilir
CREATE POLICY "questions_delete_own" ON public.questions
FOR DELETE USING (
  created_by = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
```

### 6.2. Secondary/Third Category Desteği

```typescript
// CategoryQuestionsPage'de
.eq('category_id', categoryId)
.or(`secondary_category_id.eq.${categoryId},third_category_id.eq.${categoryId}`)
```

### 6.3. Featured/Trending Otomatik Belirleme

```sql
-- Trigger ile otomatik featured/trending belirleme
CREATE OR REPLACE FUNCTION update_question_flags()
RETURNS TRIGGER AS $$
BEGIN
  -- Featured: Toplam oy > 1000 ve son 7 gün içinde
  NEW.is_featured := (
    NEW.total_votes > 1000 AND 
    NEW.created_at > NOW() - INTERVAL '7 days'
  );
  
  -- Trending: Son 24 saatte > 100 oy
  NEW.is_trending := (
    NEW.total_votes > 100 AND
    NEW.updated_at > NOW() - INTERVAL '24 hours'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 6.4. Soru Oluşturan Kullanıcı Bilgisi

```typescript
// HomePage'de
.select(`
  *,
  categories (...),
  profiles!questions_created_by_fkey (
    id,
    username,
    profile_image
  )
`)
```

---

## 📝 Öncelik Sırası

1. **🔴 KRİTİK:** RLS Policy düzeltmeleri (güvenlik)
2. **🔴 KRİTİK:** Draft sorular görünürlük kontrolü
3. **🟡 ÖNEMLİ:** Secondary/Third category desteği
4. **🟡 ÖNEMLİ:** Featured/Trending otomatik belirleme
5. **🟢 İYİLEŞTİRME:** Soru oluşturan kullanıcı bilgisi
6. **🟢 İYİLEŞTİRME:** Image URL fallback sistemi

---

## 🔗 İlgili Dosyalar

- `supabase/migrations/001_initial_schema.sql` - Questions tablosu
- `supabase/migrations/032_secure_rls_policies.sql` - RLS policies
- `services/questions.service.ts` - Questions servisleri
- `app/SenceFinal/components/HomePage/index.tsx` - Ana sayfa
- `app/SenceFinal/components/CategoryQuestionsPage/index.tsx` - Kategori sayfası
- `app/SenceFinal/components/QuestionDetailPage.tsx` - Soru detay sayfası
