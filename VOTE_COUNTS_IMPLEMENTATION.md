# Oy Sayıları (Vote Counts) İmplementasyonu

## Problem
Soru kartlarında (`FeaturedCard`, `TrendQuestionCard`) ve soru detay sayfalarında toplam oy sayısı 0 görünüyordu.

## Çözüm

### 1. Database Trigger Sistemi
`predictions` tablosuna eklenen/güncellenen/silinen her kayıt için otomatik olarak `questions` tablosundaki oy istatistiklerini güncelleyen bir trigger sistemi oluşturuldu.

**Dosya:** `supabase/migrations/042_update_question_votes_trigger.sql`

**Güncellenen Kolonlar:**
- `total_votes`: Toplam oy sayısı
- `yes_votes`: Evet oylarının sayısı
- `no_votes`: Hayır oylarının sayısı
- `yes_percentage`: Evet yüzdesi
- `no_percentage`: Hayır yüzdesi
- `total_amount`: Toplam yatırılan miktar

**Trigger'lar:**
- `trigger_prediction_insert_update_votes`: Yeni prediction eklendiğinde
- `trigger_prediction_update_update_votes`: Prediction güncellendiğinde
- `trigger_prediction_delete_update_votes`: Prediction silindiğinde

### 2. Test Verileri
Test amaçlı predictions eklenmesi için bir migration hazırlandı.

**Dosya:** `supabase/migrations/043_add_test_predictions.sql`

Bu migration her aktif soru için 50-500 arası random prediction ekler.

### 3. Frontend Entegrasyonu
Frontend zaten backend'den gelen `total_votes` ve `yes_percentage` değerlerini kullanıyor:

**HomePage/index.tsx:**
```typescript
votes: q.total_votes || 0,
yesPercentage: q.yes_percentage || 0,
```

**TrendQuestionCard.tsx:**
```typescript
<Text style={styles.statText}>{formatVotes(question.votes)}</Text>
```

**FeaturedCard.tsx:**
```typescript
<Text style={styles.statText}>{formatVotes(question.votes)}</Text>
```

## Migration'ları Uygulama

### Opsiyon 1: Supabase Dashboard (Önerilen)
1. https://supabase.com adresine git
2. Projenizi seç
3. SQL Editor'e git
4. `042_update_question_votes_trigger.sql` dosyasının içeriğini kopyala ve çalıştır
5. `043_add_test_predictions.sql` dosyasının içeriğini kopyala ve çalıştır (opsiyonel - test verileri için)

### Opsiyon 2: Supabase CLI (Docker gerektirir)
```bash
# Docker Desktop çalıştır
npx supabase start

# Migration'ları uygula
npx supabase db push
```

## Nasıl Çalışır?

### 1. Kullanıcı Oy Verdiğinde:
```typescript
// Frontend'de
await predictionsService.createPrediction({
  question_id: 'uuid',
  vote: 'yes',
  odds: 2.5,
  amount: 100
});
```

### 2. Backend'de:
1. `predictions` tablosuna yeni kayıt eklenir
2. `trigger_prediction_insert_update_votes` tetiklenir
3. `update_question_vote_counts()` function çalışır
4. İlgili sorunun tüm predictions'ları sayılır
5. `questions` tablosundaki vote kolonları güncellenir

### 3. Frontend'de:
1. Soru yeniden fetch edildiğinde güncel `total_votes` gelir
2. `formatVotes()` ile formatlanır (127k, 1.2M gibi)
3. Kartlarda görüntülenir

## Kontrol

Migration'ları uyguladıktan sonra kontrol etmek için:

```sql
-- Oy sayılarını kontrol et
SELECT 
  id,
  title,
  total_votes,
  yes_votes,
  no_votes,
  yes_percentage,
  no_percentage
FROM questions 
WHERE status = 'active'
ORDER BY total_votes DESC
LIMIT 10;
```

## Manuel Güncelleme

Eğer bir sorunun vote counts'ını manuel olarak güncellemek isterseniz:

```sql
SELECT update_question_vote_counts_for_question('question-uuid-here');
```

Tüm soruları güncellemek için:

```sql
SELECT update_question_vote_counts_for_question(id) 
FROM questions 
WHERE status = 'active';
```

## Notlar

- İptal edilmiş (`status = 'cancelled'`) predictions oy sayısına dahil edilmez
- Trigger'lar otomatik çalışır, ekstra kod gerekmez
- Frontend'de `|| 0` fallback'leri sayesinde vote count olmasa bile hata vermez
- Vote counts her prediction işleminde real-time güncellenir

