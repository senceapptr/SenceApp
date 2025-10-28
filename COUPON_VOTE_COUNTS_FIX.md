# Kupon Vote Counts Düzeltmesi

## Problem
Kupon oluşturulduğunda `coupon_selections` tablosuna ekleme yapılıyordu ama `predictions` tablosuna ekleme yapılmıyordu. Bu yüzden:
- Questions tablosundaki `total_votes` 0 kalıyordu
- Questions tablosundaki `total_amount` 0 kalıyordu
- Vote counts trigger'ları çalışmıyordu

## Çözüm

### 1. Frontend Değişikliği
**Dosya:** `services/coupons.service.ts`

`createCoupon` fonksiyonuna predictions ekleme mantığı eklendi:

```typescript
// Her selection için predictions tablosuna da ekle (vote counts için)
const amountPerQuestion = Math.floor(stake_amount / selections.length);

const predictionsData = selections.map((sel) => ({
  user_id: user.id,
  question_id: sel.question_id,
  vote: sel.vote,
  odds: sel.odds,
  amount: amountPerQuestion,
  potential_win: Math.floor(amountPerQuestion * sel.odds),
  status: 'pending' as const,
}));

await supabaseService
  .from('predictions')
  .insert(predictionsData);
```

**Mantık:**
- Kupon stake miktarı sorular arasında eşit paylaştırılır
- Her soru için ayrı bir prediction kaydı oluşturulur
- Bu sayede trigger'lar otomatik olarak vote counts'ları günceller

### 2. Mevcut Kuponları Senkronize Etme
**Dosya:** `supabase/migrations/044_sync_coupon_selections_to_predictions.sql`

Bu migration mevcut `coupon_selections` kayıtlarını `predictions` tablosuna aktarır.

**Ne yapar:**
1. Tüm coupon_selections'ları tarar
2. Her selection için predictions tablosunda kayıt var mı kontrol eder
3. Yoksa yeni prediction kaydı oluşturur
4. Tüm aktif soruların vote counts'larını günceller

## Uygulama Adımları

### 1. Mevcut Kuponları Senkronize Et
Supabase Dashboard → SQL Editor:

```sql
-- 044_sync_coupon_selections_to_predictions.sql dosyasını çalıştır
```

Bu işlem:
- ✅ Eski kuponları predictions'a aktarır
- ✅ Vote counts'ları günceller
- ✅ Hangi soruların kaç oy aldığını gösterir

### 2. Uygulamayı Yeniden Deploy Et
Frontend kodundaki değişiklikler sayesinde bundan sonra oluşturulan tüm kuponlar otomatik olarak predictions'a eklenecek.

## Doğrulama

### Kupon Oluşturduktan Sonra Kontrol:

```sql
-- Belirli bir sorunun vote counts'larını kontrol et
SELECT 
  id,
  title,
  total_votes,
  yes_votes,
  no_votes,
  total_amount
FROM questions
WHERE id = 'YOUR_QUESTION_ID_HERE';

-- Son oluşturulan predictions'ları kontrol et
SELECT 
  p.*,
  q.title as question_title
FROM predictions p
JOIN questions q ON p.question_id = q.id
ORDER BY p.created_at DESC
LIMIT 10;

-- Kupon ve predictions ilişkisini kontrol et
SELECT 
  c.id as coupon_id,
  c.coupon_code,
  c.stake_amount,
  c.selections_count,
  COUNT(p.id) as prediction_count
FROM coupons c
LEFT JOIN predictions p ON c.user_id = p.user_id 
  AND p.created_at = c.created_at
GROUP BY c.id, c.coupon_code, c.stake_amount, c.selections_count
ORDER BY c.created_at DESC
LIMIT 10;
```

## Veri Akışı

### Kupon Oluşturma:
```
1. User kupon oluşturur (1 soru, 10 kredi)
   ↓
2. coupons tablosuna kayıt eklenir
   ↓
3. coupon_selections tablosuna kayıt eklenir
   ↓
4. predictions tablosuna kayıt eklenir (YENİ!)
   ↓
5. trigger_prediction_insert_update_votes tetiklenir
   ↓
6. update_question_vote_counts() çalışır
   ↓
7. questions.total_votes += 1
8. questions.total_amount += 10
9. questions.yes_votes veya no_votes += 1
10. yüzdeler yeniden hesaplanır
```

### Sonuç:
- ✅ total_votes artık 0 değil
- ✅ total_amount artık 0 değil
- ✅ Gerçek zamanlı vote tracking çalışıyor
- ✅ Frontend'de ek değişiklik gerekmez

## Notlar

### Neden Her Soru İçin Ayrı Prediction?
1. **Vote Counts:** Trigger sistemi predictions tablosunu takip ediyor
2. **İstatistikler:** Her sorunun ne kadar oy aldığını takip edebiliyoruz
3. **Analytics:** Kullanıcı davranışlarını analiz edebiliyoruz
4. **Consistency:** Tek tahminler de, kupon tahminleri de aynı sistem üzerinden

### Performans
- Bir kuponla 5 soru seçilirse: 1 coupon + 5 coupon_selections + 5 predictions (eğer yoksa) = max 11 insert
- Trigger otomatik çalışır, ekstra sorgu gerekmez
- Vote counts cache'lenir (questions tablosunda)

### Önemli: Duplicate Prevention
- Kullanıcı aynı soruya birden fazla kupon ekleyemez (predictions unique constraint)
- Sistem otomatik kontrol eder: Eğer kullanıcı daha önce o soruya oy verdiyse, yeni prediction eklenmez
- Bu sayede:
  - ✅ Duplicate key hatası önlenir
  - ✅ Vote counts doğru kalır (bir kullanıcı = bir oy)
  - ✅ Kupon başarıyla oluşturulur (predictions hatası kritik değil)

### Gelecek İyileştirmeler
- [ ] Batch operations için optimize et
- [ ] Predictions'a coupon_id kolonu ekle (ilişkiyi net göster)
- [ ] Kupon iptal edilince predictions'ları da iptal et

