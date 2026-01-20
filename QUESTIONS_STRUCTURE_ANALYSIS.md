# 📊 Questions Tablosu Yapı Analizi ve İyileştirmeler

> **Tarih:** Ocak 2026  
> **Amaç:** Questions tablosu yapısının detaylı analizi ve iyileştirme önerileri

---

## 📋 İçindekiler

1. [Mevcut Yapı](#1-mevcut-yapı)
2. [Kolon Analizi](#2-kolon-analizi)
3. [İlişkiler](#3-ilişkiler)
4. [Tespit Edilen Sorunlar](#4-tespit-edilen-sorunlar)
5. [İyileştirme Önerileri](#5-iyileştirme-önerileri)
6. [RLS Policy Düzeltmeleri](#6-rls-policy-düzeltmeleri)

---

## 1. Mevcut Yapı

### 1.1. Questions Tablosu Kolonları

```sql
CREATE TABLE public.questions (
  -- PRIMARY KEY
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- İÇERİK
  title TEXT NOT NULL,                    -- ✅ Gerekli
  description TEXT,                      -- ⚠️ NULL olabilir, ama genelde dolu
  image_url TEXT,                        -- ⚠️ NULL olabilir, fallback var
  
  -- KATEGORİLER
  category_id UUID REFERENCES categories(id),              -- ✅ Primary kategori
  secondary_category_id UUID REFERENCES categories(id),   -- ⚠️ Kullanılıyor ama nadiren
  third_category_id UUID REFERENCES categories(id),        -- ⚠️ Kullanılıyor ama nadiren
  
  -- ODD/ORANLAR
  yes_odds DECIMAL(10,2) DEFAULT 2.0,    -- ✅ Kullanılıyor
  no_odds DECIMAL(10,2) DEFAULT 2.0,     -- ✅ Kullanılıyor
  
  -- OY İSTATİSTİKLERİ (Trigger ile güncelleniyor)
  total_votes INTEGER DEFAULT 0,         -- ✅ Kullanılıyor
  yes_votes INTEGER DEFAULT 0,            -- ✅ Kullanılıyor
  no_votes INTEGER DEFAULT 0,             -- ✅ Kullanılıyor
  yes_percentage DECIMAL(5,2) DEFAULT 0, -- ✅ Kullanılıyor
  no_percentage DECIMAL(5,2) DEFAULT 0,  -- ✅ Kullanılıyor
  total_amount BIGINT DEFAULT 0,          -- ✅ Kullanılıyor
  
  -- DURUM
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'closed', 'resolved')),
  result TEXT CHECK (result IN ('yes', 'no', 'cancelled')), -- ⚠️ Sadece resolved sorularda dolu
  
  -- TARİHLER
  publish_date TIMESTAMPTZ DEFAULT NOW(), -- ⚠️ Kullanılmıyor gibi (created_at ile aynı)
  end_date TIMESTAMPTZ NOT NULL,          -- ✅ Kullanılıyor (zorunlu)
  resolved_at TIMESTAMPTZ,                -- ⚠️ Sadece resolved sorularda dolu
  
  -- KULLANICI
  created_by UUID REFERENCES profiles(id), -- ✅ Kullanılıyor
  
  -- FLAG'LER
  is_featured BOOLEAN DEFAULT false,      -- ✅ Kullanılıyor (manuel set)
  is_trending BOOLEAN DEFAULT false,      -- ✅ Kullanılıyor (manuel set)
  
  -- ADMIN
  rejection_reason TEXT,                  -- ⚠️ Sadece rejected sorularda dolu
  
  -- TIMESTAMPS
  created_at TIMESTAMPTZ DEFAULT NOW(),   -- ✅ Kullanılıyor
  updated_at TIMESTAMPTZ DEFAULT NOW()    -- ✅ Kullanılıyor
);
```

---

## 2. Kolon Analizi

### ✅ Gerekli ve Kullanılan Kolonlar

| Kolon | Kullanım | Öncelik |
|-------|----------|---------|
| `id` | Primary key | 🔴 Kritik |
| `title` | Soru başlığı | 🔴 Kritik |
| `description` | Soru açıklaması | 🟡 Önemli |
| `category_id` | Primary kategori | 🔴 Kritik |
| `yes_odds`, `no_odds` | Oranlar | 🔴 Kritik |
| `total_votes`, `yes_votes`, `no_votes` | Oy sayıları | 🔴 Kritik |
| `yes_percentage`, `no_percentage` | Yüzdeler | 🔴 Kritik |
| `status` | Durum (draft/active/closed/resolved) | 🔴 Kritik |
| `end_date` | Bitiş tarihi | 🔴 Kritik |
| `created_by` | Oluşturan kullanıcı | 🔴 Kritik |
| `is_featured`, `is_trending` | Öne çıkarma | 🟡 Önemli |
| `created_at`, `updated_at` | Timestamps | 🟡 Önemli |

### ⚠️ Kısmen Kullanılan Kolonlar

| Kolon | Kullanım | Sorun |
|-------|----------|-------|
| `secondary_category_id` | Kategori sayfasında kullanılıyor | ✅ Çalışıyor |
| `third_category_id` | Kategori sayfasında kullanılıyor | ✅ Çalışıyor |
| `image_url` | Fallback image var | ✅ Çalışıyor |
| `result` | Sadece resolved sorularda | ✅ Normal |
| `resolved_at` | Sadece resolved sorularda | ✅ Normal |
| `rejection_reason` | Sadece rejected sorularda | ✅ Normal |

### ❓ Kullanılmayan veya Gereksiz Kolonlar

| Kolon | Durum | Öneri |
|-------|-------|-------|
| `publish_date` | `created_at` ile aynı | Kaldırılabilir veya birleştirilebilir |

---

## 3. İlişkiler

### 3.1. Foreign Keys

| İlişki | Tablo | Açıklama |
|--------|-------|----------|
| `category_id` → `categories.id` | categories | Primary kategori |
| `secondary_category_id` → `categories.id` | categories | Secondary kategori |
| `third_category_id` → `categories.id` | categories | Third kategori |
| `created_by` → `profiles.id` | profiles | Soru oluşturan kullanıcı |

### 3.2. Reverse İlişkiler

| Tablo | İlişki | Açıklama |
|-------|--------|----------|
| `predictions` | `question_id` → `questions.id` | Soruya yapılan tahminler |
| `comments` | `question_id` → `questions.id` | Soruya yapılan yorumlar |
| `coupon_selections` | `question_id` → `questions.id` | Kuponlarda kullanılan sorular |
| `question_statistics` | `question_id` → `questions.id` | Soru istatistikleri |
| `league_questions` | `question_id` → `questions.id` | Lig soruları |

---

## 4. Tespit Edilen Sorunlar

### 🔴 Kritik Sorunlar

1. **Kullanıcılar Active Soruları Güncelleyebiliyor**
   - Sorun: RLS policy'de status kontrolü yok
   - Risk: Kullanıcılar onaylanmış soruları değiştirebilir
   - Çözüm: Sadece draft sorular güncellenebilmeli

2. **publish_date Gereksiz**
   - Sorun: `created_at` ile aynı işlevi görüyor
   - Çözüm: Kaldırılabilir veya `created_at` kullanılabilir

### 🟡 Orta Öncelikli Sorunlar

3. **is_featured ve is_trending Manuel**
   - Sorun: Otomatik belirlenmiyor
   - Çözüm: Trigger ile otomatik yapılabilir (opsiyonel)

4. **Description NULL Olabilir**
   - Sorun: Açıklama olmadan soru oluşturulabilir
   - Çözüm: NOT NULL yapılabilir veya minimum karakter sayısı

5. **Image URL Fallback**
   - Sorun: Hardcoded fallback image
   - Çözüm: Daha iyi bir sistem (default image table)

### 🟢 Düşük Öncelikli İyileştirmeler

6. **Secondary/Third Category Kullanımı Düşük**
   - Sorun: Çoğu soruda sadece primary category kullanılıyor
   - Çözüm: Kullanım oranına göre değerlendirilebilir

---

## 5. İyileştirme Önerileri

### 5.1. Kolon İyileştirmeleri

#### A) publish_date Kaldırma

```sql
-- publish_date kaldır (created_at zaten var)
ALTER TABLE public.questions DROP COLUMN IF EXISTS publish_date;
```

**Avantajlar:**
- Duplikasyon kaldırılır
- Daha az disk alanı
- Daha basit sorgular

**Dezavantajlar:**
- Eğer publish_date farklı bir amaç için kullanılıyorsa sorun olabilir

#### B) Description NOT NULL Yapma

```sql
-- Description zorunlu yap
ALTER TABLE public.questions 
ALTER COLUMN description SET NOT NULL;
```

**Avantajlar:**
- Daha kaliteli sorular
- Frontend'de zaten zorunlu

**Dezavantajlar:**
- Mevcut NULL description'ları doldurmak gerekir

### 5.2. Constraint İyileştirmeleri

#### A) End Date Validation

```sql
-- End date gelecekte olmalı (soru oluşturulurken)
-- Bu kontrol application layer'da yapılıyor, ama database'de de olabilir
CREATE OR REPLACE FUNCTION validate_question_end_date()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.end_date <= NOW() THEN
    RAISE EXCEPTION 'End date must be in the future';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_question_end_date_trigger
BEFORE INSERT OR UPDATE ON public.questions
FOR EACH ROW
EXECUTE FUNCTION validate_question_end_date();
```

#### B) Status Transition Validation

```sql
-- Status geçişlerini kontrol et
-- draft -> active (sadece admin)
-- active -> closed/resolved (sadece admin veya otomatik)
-- closed/resolved -> (değiştirilemez)
CREATE OR REPLACE FUNCTION validate_question_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  -- Draft'tan active'e geçiş sadece admin yapabilir
  IF OLD.status = 'draft' AND NEW.status = 'active' THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    ) THEN
      RAISE EXCEPTION 'Only admins can approve questions';
    END IF;
  END IF;
  
  -- Active'ten sonraki durumlar değiştirilemez (sadece admin)
  IF OLD.status IN ('active', 'closed', 'resolved') AND 
     NEW.status != OLD.status THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    ) THEN
      RAISE EXCEPTION 'Only admins can change status of active/resolved questions';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 5.3. Index İyileştirmeleri

#### A) Composite Index'ler

```sql
-- Status ve created_by için (draft sorular için)
CREATE INDEX IF NOT EXISTS idx_questions_status_created_by 
ON public.questions(status, created_by) 
WHERE status = 'draft';

-- Status ve end_date için (aktif sorular için)
CREATE INDEX IF NOT EXISTS idx_questions_status_end_date 
ON public.questions(status, end_date) 
WHERE status = 'active';

-- Featured sorular için
CREATE INDEX IF NOT EXISTS idx_questions_featured 
ON public.questions(id) 
WHERE is_featured = true AND status = 'active';

-- Trending sorular için
CREATE INDEX IF NOT EXISTS idx_questions_trending 
ON public.questions(id) 
WHERE is_trending = true AND status = 'active';
```

---

## 6. RLS Policy Düzeltmeleri

### 6.1. Mevcut Sorun

```sql
-- ŞU ANKİ POLICY (YANLIŞ):
CREATE POLICY "questions_update_own" ON public.questions
FOR UPDATE USING (
  created_by = auth.uid() OR is_admin
);
-- Sorun: Status kontrolü yok, kullanıcı active soruları güncelleyebilir!
```

### 6.2. Düzeltilmiş Policy

```sql
-- DÜZELTİLMİŞ POLICY:
CREATE POLICY "questions_update_own" ON public.questions
FOR UPDATE USING (
  -- Kullanıcılar sadece draft soruları güncelleyebilir
  (created_by = auth.uid() AND status = 'draft') OR
  -- Adminler tüm soruları güncelleyebilir
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);
```

---

## 📝 Özet İyileştirmeler

### 🔴 Kritik (Hemen Yapılmalı)

1. ✅ RLS Policy: Kullanıcılar sadece draft soruları güncelleyebilmeli
2. ✅ Status transition validation: Draft -> Active sadece admin
3. ✅ Index optimizasyonu: Featured/Trending sorular için

### 🟡 Önemli (Yapılabilir)

4. ⚠️ publish_date kaldırma (kontrol edilmeli)
5. ⚠️ description NOT NULL yapma (mevcut verileri kontrol et)
6. ⚠️ End date validation trigger

### 🟢 İyileştirme (Opsiyonel)

7. ⚠️ Featured/Trending otomatik belirleme trigger
8. ⚠️ Default image sistemi

---

## 🔗 İlgili Dosyalar

- `supabase/migrations/001_initial_schema.sql` - İlk şema
- `supabase/migrations/048_fix_questions_rls_and_visibility.sql` - RLS düzeltmeleri
- `services/questions.service.ts` - Questions servisleri
- `app/SenceFinal/components/WriteQuestionPage/` - Soru oluşturma
