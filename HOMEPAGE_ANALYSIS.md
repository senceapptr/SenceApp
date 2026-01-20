# 📊 Ana Sayfa (HomePage) Detaylı Analiz

> **Tarih:** Ocak 2026  
> **Amaç:** Ana sayfa bileşenlerinin, veri akışının ve UI yapısının detaylı analizi

---

## 📋 İçindekiler

1. [Mevcut Bileşenler](#1-mevcut-bileşenler)
2. [Veri Akışı](#2-veri-akışı)
3. [Database Sorguları](#3-database-sorguları)
4. [UI Yapısı](#4-ui-yapısı)
5. [Tespit Edilen Sorunlar](#5-tespit-edilen-sorunlar)
6. [İyileştirme Önerileri](#6-iyileştirme-önerileri)

---

## 1. Mevcut Bileşenler

### 1.1. Featured Questions (Büyük Soru Bannerı)

**Component:** `FeaturedCarousel` → `FeaturedCard`

**Özellikler:**
- ✅ Infinite scroll carousel
- ✅ Full-screen banner (55% ekran yüksekliği)
- ✅ Image + gradient overlay
- ✅ Vote buttons (EVET/HAYIR)
- ✅ Stats (votes, timeLeft)
- ✅ Category color support

**Veri Kaynağı:**
```typescript
questionsService.getFeaturedQuestions()
// Status: active
// is_featured: true
// Limit: 10
// Order: created_at DESC
```

**Sorunlar:**
- ⚠️ Secondary/third category desteği yok (sadece primary category)
- ⚠️ Image fallback hardcoded
- ⚠️ Category color kullanılmıyor (dominantColor var ama kullanılmıyor)

---

### 1.2. Active Coupons (Aktif Kuponlar)

**Component:** `ActiveCouponsSection` → `CouponCard`

**Özellikler:**
- ✅ Horizontal scroll list
- ✅ Empty state (kupon yoksa)
- ✅ Create coupon button
- ✅ Coupon detail modal

**Veri Kaynağı:**
```typescript
couponsService.getActiveCoupons(userId)
// Status: pending
// User-specific
```

**Sorunlar:**
- ⚠️ Complex data mapping (coupon_selections → predictions)
- ⚠️ End date calculation (en geç sonuçlanacak soru)
- ⚠️ Status mapping (pending → live)
- ⚠️ Type safety (any[] kullanılıyor)

---

### 1.3. Trend Questions (Trend Sorular Bannerı)

**Component:** `TrendQuestionsSection` → `TrendQuestionCard`

**Özellikler:**
- ✅ Vertical list (scroll disabled)
- ✅ Progress bars (yes/no percentage)
- ✅ Vote buttons
- ✅ Stats (votes, timeLeft)

**Veri Kaynağı:**
```typescript
questionsService.getTrendingQuestions()
// Status: active
// is_trending: true
// Limit: 20
// Order: total_votes DESC
```

**Sorunlar:**
- ⚠️ Secondary/third category desteği yok (sadece primary category)
- ⚠️ Image fallback hardcoded
- ⚠️ "Tümünü görüntüle" butonu işlevsiz (onPress yok)

---

### 1.4. Activities Section (Günlük Aktiviteler)

**Component:** `ActivitiesSection`

**Durum:** ⚠️ Şimdilik göz ardı edilebilir (kullanıcı isteği)

---

## 2. Veri Akışı

### 2.1. HomePage Component

**Akış:**
```
1. Component mount
   ↓
2. loadHomeData() çağrılır
   ↓
3. Promise.all([
     getFeaturedQuestions(),
     getTrendingQuestions(),
     getActiveCoupons(userId)
   ])
   ↓
4. Data mapping (backend → frontend format)
   ↓
5. State update
   ↓
6. Render
```

**Sorunlar:**
- ⚠️ Error handling genel (Alert.alert)
- ⚠️ Loading state skeleton gösteriyor ama optimize edilebilir
- ⚠️ Refresh mekanizması var ama pull-to-refresh indicator custom

---

### 2.2. Data Mapping

#### Featured Questions Mapping

```typescript
// Backend → Frontend
{
  id: q.id, // UUID
  title: q.title,
  image: q.image_url || fallback,
  votes: q.total_votes || 0,
  timeLeft: calculateTimeLeft(q.end_date),
  category: q.categories?.name || 'Genel',
  yesOdds: q.yes_odds,
  noOdds: q.no_odds,
  dominantColor: q.categories?.color || '#4F46E5'
}
```

**Sorunlar:**
- ⚠️ Secondary/third category kontrolü yok
- ⚠️ dominantColor kullanılmıyor (FeaturedCard'da)

#### Trend Questions Mapping

```typescript
// Backend → Frontend
{
  id: q.id, // UUID
  title: q.title,
  category: q.categories?.name || 'Genel',
  image: q.image_url || fallback,
  votes: q.total_votes || 0,
  timeLeft: calculateTimeLeft(q.end_date),
  yesOdds: q.yes_odds,
  noOdds: q.no_odds,
  yesPercentage: q.yes_percentage || 0
}
```

**Sorunlar:**
- ⚠️ Secondary/third category kontrolü yok
- ⚠️ yesPercentage 0 olabilir (default)

#### Active Coupons Mapping

```typescript
// Backend → Frontend (Complex!)
{
  id: coupon.display_id || coupon.id,
  name: `Kupon #${coupon.display_id || coupon.id}`,
  questionCount: coupon.selections_count || 0,
  totalOdds: coupon.total_odds || 1,
  potentialWinnings: coupon.potential_win || 0,
  endsIn: calculateTimeLeft(latestEndDate),
  predictions: coupon.coupon_selections.map(...),
  status: coupon.status === 'pending' ? 'live' : ...
}
```

**Sorunlar:**
- ⚠️ Çok karmaşık mapping
- ⚠️ Type safety yok (any[])
- ⚠️ End date calculation karmaşık

---

## 3. Database Sorguları

### 3.1. Featured Questions Query

```sql
SELECT 
  *,
  categories!questions_category_id_fkey (
    id, name, slug, icon, color
  )
FROM questions
WHERE status = 'active'
  AND is_featured = true
ORDER BY created_at DESC
LIMIT 10
```

**Sorunlar:**
- ⚠️ Secondary/third category join yok
- ⚠️ Image URL kontrolü yok (NULL olabilir)

---

### 3.2. Trending Questions Query

```sql
SELECT 
  *,
  categories!questions_category_id_fkey (
    id, name, slug, icon, color
  )
FROM questions
WHERE status = 'active'
  AND is_trending = true
ORDER BY total_votes DESC
LIMIT 20
```

**Sorunlar:**
- ⚠️ Secondary/third category join yok
- ⚠️ Image URL kontrolü yok (NULL olabilir)

---

### 3.3. Active Coupons Query

**Servis:** `couponsService.getActiveCoupons(userId)`

**Sorgu:**
```sql
SELECT 
  *,
  display_id,
  coupon_selections!left (
    id,
    question_id,
    vote,
    odds,
    status,
    questions (
      id,
      title,
      category_id,
      status,
      result,
      end_date,
      categories!questions_category_id_fkey (
        id,
        name
      )
    )
  )
FROM coupons
WHERE user_id = $userId
  AND status = 'pending'
ORDER BY created_at DESC
```

**Sorunlar:**
- ⚠️ Complex nested query
- ⚠️ RLS policy kontrolü gerekebilir
- ⚠️ Performance sorunları olabilir (nested queries)

---

## 4. UI Yapısı

### 4.1. Layout

```
┌─────────────────────────┐
│      Header             │
├─────────────────────────┤
│                         │
│  Featured Carousel      │ ← 55% screen height
│  (Full-screen banner)   │
│                         │
├─────────────────────────┤
│  Activities Section     │ ← Şimdilik göz ardı
├─────────────────────────┤
│  Active Coupons         │ ← Horizontal scroll
│  (Empty state if none)  │
├─────────────────────────┤
│  Trend Questions        │ ← Vertical list
│  (Scroll disabled)      │
└─────────────────────────┘
```

---

### 4.2. Styling

**FeaturedCarousel:**
- Height: 55% screen
- Border radius: 28px (bottom)
- Infinite scroll
- Indicators (bottom)

**TrendQuestionsSection:**
- Vertical list
- Card height: 340px
- Border radius: 24px
- Progress bars

**ActiveCouponsSection:**
- Horizontal scroll
- Empty state gradient
- Create button

---

## 5. Tespit Edilen Sorunlar

### 🔴 Kritik Sorunlar

1. **Secondary/Third Category Desteği Yok**
   - Featured ve Trend questions'da sadece primary category gösteriliyor
   - `getQuestionsByCategory`'de var ama HomePage'de yok

2. **Image Fallback Hardcoded**
   - Featured: `'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop'`
   - Trend: `'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop'`
   - Daha iyi bir sistem olmalı (default image table veya constant)

3. **Type Safety Eksik**
   - `activeCoupons: any[]` → `ActiveCoupon[]` olmalı
   - Mapping'lerde type safety yok

---

### 🟡 Orta Öncelikli Sorunlar

4. **Complex Coupon Mapping**
   - `coupon_selections` → `predictions` mapping karmaşık
   - End date calculation karmaşık
   - Utility function'a çıkarılabilir

5. **"Tümünü görüntüle" Butonu İşlevsiz**
   - TrendQuestionsSection'da onPress yok
   - Navigation eklenmeli

6. **dominantColor Kullanılmıyor**
   - FeaturedQuestion'da var ama FeaturedCard'da kullanılmıyor
   - Gradient veya accent color olarak kullanılabilir

7. **Error Handling Genel**
   - `Alert.alert('Hata', 'Veriler yüklenirken bir hata oluştu')`
   - Daha spesifik mesajlar olmalı

---

### 🟢 Düşük Öncelikli İyileştirmeler

8. **Loading State Optimizasyonu**
   - Skeleton loading var ama optimize edilebilir
   - Progressive loading eklenebilir

9. **Performance Optimizasyonu**
   - Image caching
   - Pre-loading
   - Memoization

10. **UI Enhancement**
    - Animations
    - Transitions
    - Micro-interactions

---

## 6. İyileştirme Önerileri

### 6.1. Database Sorguları İyileştirme

#### A) Secondary/Third Category Join Ekle

```typescript
// services/questions.service.ts
async getFeaturedQuestions() {
  const { data, error } = await supabase
    .from('questions')
    .select(`
      *,
      categories!questions_category_id_fkey (...),
      secondary_category:categories!questions_secondary_category_id_fkey (...),
      third_category:categories!questions_third_category_id_fkey (...)
    `)
    .eq('status', 'active')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(10);
}
```

#### B) Image URL Validation

```typescript
// Utility function
const getQuestionImage = (imageUrl: string | null, fallback: string): string => {
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl;
  }
  return fallback;
};
```

---

### 6.2. Type Safety İyileştirme

#### A) ActiveCoupon Type Düzeltme

```typescript
// types.ts
export interface ActiveCoupon {
  id: number | string; // display_id veya id
  name: string;
  questionCount: number;
  totalOdds: number;
  potentialWinnings: number;
  endsIn: string;
  colors: [string, string];
  predictions: CouponPrediction[];
  potentialEarnings: number;
  status: 'live' | 'won' | 'lost';
  createdAt: Date;
  username: string;
  investmentAmount: number;
}

export interface CouponPrediction {
  id: number;
  questionId: string; // UUID
  question: string;
  choice: 'yes' | 'no';
  odds: number;
  category: string;
  result?: 'won' | 'lost' | 'pending';
  endDate: Date | null;
}
```

#### B) State Type Düzeltme

```typescript
// HomePage/index.tsx
const [activeCoupons, setActiveCoupons] = useState<ActiveCoupon[]>([]);
```

---

### 6.3. Mapping Utility Functions

#### A) Coupon Mapping Utility

```typescript
// utils/couponMapper.ts
export const mapCouponToActiveCoupon = (coupon: any): ActiveCoupon => {
  const predictions = (coupon.coupon_selections || []).map((selection: any) => ({
    id: selection.id || 0,
    questionId: selection.question_id || '',
    question: selection.questions?.title || 'Soru bulunamadı',
    choice: selection.vote || 'yes',
    odds: selection.odds || 1,
    category: selection.questions?.categories?.name || 'Genel',
    result: selection.status === 'won' ? 'won' : selection.status === 'lost' ? 'lost' : 'pending',
    endDate: selection.questions?.end_date ? new Date(selection.questions.end_date) : null
  }));

  const latestEndDate = getLatestEndDate(predictions);
  const endsIn = latestEndDate ? calculateTimeLeft(latestEndDate.toISOString()) : 'Bilinmiyor';

  return {
    id: coupon.display_id || coupon.id,
    name: `Kupon #${coupon.display_id || coupon.id}`,
    questionCount: coupon.selections_count || 0,
    totalOdds: coupon.total_odds || 1,
    potentialWinnings: coupon.potential_win || 0,
    endsIn,
    colors: ['#432870', '#5A3A8B'] as [string, string],
    predictions,
    potentialEarnings: coupon.potential_win || 0,
    status: coupon.status === 'pending' ? 'live' : coupon.status === 'won' ? 'won' : coupon.status === 'lost' ? 'lost' : 'live',
    createdAt: new Date(coupon.created_at),
    username: coupon.username || '@kullanici',
    investmentAmount: coupon.stake_amount || 0,
  };
};

const getLatestEndDate = (predictions: CouponPrediction[]): Date | null => {
  if (!predictions || predictions.length === 0) return null;
  
  const validEndDates = predictions
    .map(prediction => prediction.endDate)
    .filter(endDate => endDate instanceof Date && !isNaN(endDate.getTime()));
  
  if (validEndDates.length === 0) return null;
  
  return new Date(Math.max(...validEndDates.map(date => date.getTime())));
};
```

---

### 6.4. UI Enhancement

#### A) dominantColor Kullanımı

```typescript
// FeaturedCard.tsx
<LinearGradient
  colors={[
    'transparent', 
    `rgba(${hexToRgb(question.dominantColor)}, 0.3)`, 
    `rgba(${hexToRgb(question.dominantColor)}, 0.7)`
  ]}
  style={styles.gradient}
/>
```

#### B) "Tümünü görüntüle" Navigation

```typescript
// TrendQuestionsSection.tsx
<TouchableOpacity onPress={() => onSeeAllPress?.()}>
  <Text style={[styles.seeAll, { color: theme.primary }]}>Tümünü görüntüle</Text>
</TouchableOpacity>
```

---

### 6.5. Error Handling İyileştirme

```typescript
// HomePage/index.tsx
catch (err) {
  console.error('Home data load error:', err);
  
  let errorMessage = 'Veriler yüklenirken bir hata oluştu';
  
  if (err instanceof Error) {
    if (err.message.includes('network')) {
      errorMessage = 'İnternet bağlantınızı kontrol edin';
    } else if (err.message.includes('permission')) {
      errorMessage = 'Bu verilere erişim yetkiniz yok';
    }
  }
  
  Alert.alert('Hata', errorMessage);
}
```

---

## 📝 Özet

### ✅ Çalışan Özellikler

1. ✅ Featured questions carousel
2. ✅ Trend questions list
3. ✅ Active coupons section
4. ✅ Data loading ve mapping
5. ✅ Refresh mechanism

### ⚠️ İyileştirme Gereken Özellikler

1. ⚠️ Secondary/third category desteği
2. ⚠️ Type safety
3. ⚠️ Image fallback sistemi
4. ⚠️ Complex coupon mapping
5. ⚠️ Error handling
6. ⚠️ UI enhancements

---

## 🔗 İlgili Dosyalar

- `app/SenceFinal/components/HomePage/index.tsx` - Ana sayfa component
- `app/SenceFinal/components/HomePage/components/FeaturedCarousel.tsx` - Featured carousel
- `app/SenceFinal/components/HomePage/components/TrendQuestionsSection.tsx` - Trend questions
- `app/SenceFinal/components/HomePage/components/ActiveCouponsSection.tsx` - Active coupons
- `services/questions.service.ts` - Questions servisleri
- `services/coupons.service.ts` - Coupons servisleri
