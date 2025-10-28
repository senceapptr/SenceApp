# 🎯 Kategori Sistemi Düzeltme Adımları

## 🔧 SQL Script'lerini Sırayla Çalıştır:

### **1. Adım: Questions Tablosuna Sütunları Ekle**
```sql
-- ADD_CATEGORY_COLUMNS.sql dosyasını çalıştır
```

Bu script:
- ✅ `questions` tablosuna `secondary_category_id` sütunu ekler
- ✅ `questions` tablosuna `third_category_id` sütunu ekler
- ✅ Foreign key constraint'leri ekler
- ✅ Index'leri oluşturur

### **2. Adım: Question_Categories Tablosunu Kaldır**
```sql
-- DROP_QUESTION_CATEGORIES.sql dosyasını çalıştır
```

Bu script:
- ✅ `question_categories` tablosunu kaldırır
- ✅ Foreign key constraint'leri kaldırır

## 🚀 Test Adımları:

### **1. Database Kontrol:**
1. **Supabase SQL Editor'da Kontrol Et:**
   ```sql
   -- Questions tablosunun yapısını kontrol et
   SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_name = 'questions' 
   AND column_name IN ('category_id', 'secondary_category_id', 'third_category_id');
   ```

2. **Beklenen Sonuç:**
   - ✅ `category_id` sütunu olmalı
   - ✅ `secondary_category_id` sütunu olmalı
   - ✅ `third_category_id` sütunu olmalı

### **2. Soru Yazma Testi:**

1. **Soru Yaz Sayfasını Aç:**
   - ✅ Ana sayfadan "Soru Yaz" butonuna tıkla

2. **Çoklu Kategori Seçimi:**
   - ✅ İlk kategoriyi seç (primary olacak - category_id)
   - ✅ İkinci kategoriyi seç (secondary olacak - secondary_category_id)
   - ✅ Üçüncü kategoriyi seç (third olacak - third_category_id)

3. **Soru Oluştur:**
   - ✅ Soru metnini yaz
   - ✅ Açıklama yaz
   - ✅ Bitiş tarihi seç
   - ✅ "Soru Oluştur" butonuna tıkla
   - ✅ Backend'e kaydedilmeli

### **3. Ana Sayfa Testi:**

1. **Ana Sayfayı Aç:**
   - ✅ Ana sayfaya git
   - ✅ Featured questions yüklenmeli
   - ✅ Trend questions yüklenmeli

2. **Kategori Görüntüleme:**
   - ✅ Sorularda primary kategoriler görünmeli (category_id)
   - ✅ Kategori adları doğru olmalı
   - ✅ Kategori renkleri doğru olmalı

### **4. Kategori Sayfası Testi:**

1. **Keşfet Sayfasını Aç:**
   - ✅ Ana sayfadan "Keşfet" butonuna tıkla

2. **Kategori Seçimi:**
   - ✅ Spor kategorisine tıkla
   - ✅ Sorular yüklenmeli
   - ✅ Sorularda "Spor" kategorisi görünmeli

3. **Farklı Kategori Testi:**
   - ✅ Sosyal Medya kategorisine tıkla
   - ✅ Sorular yüklenmeli
   - ✅ Sorularda "Sosyal Medya" kategorisi görünmeli

## 🔧 Sorun Giderme:

### **Sütunlar Eklenmiyorsa:**
1. SQL script'ini tekrar çalıştır
2. Supabase'de permissions kontrol et
3. Console'da hata var mı kontrol et

### **Question_Categories Tablosu Kaldırılmıyorsa:**
1. Foreign key constraint'leri manuel olarak kaldır
2. Tabloyu manuel olarak kaldır
3. Supabase'de permissions kontrol et

### **Backend Hatası Alıyorsa:**
1. Database'de sütunlar var mı kontrol et
2. Foreign key constraint'leri var mı kontrol et
3. Index'ler oluşmuş mu kontrol et

## 🎉 Test Tamamlandı!

Eğer tüm adımlar başarılıysa:
- ✅ `questions` tablosunda yeni sütunlar
- ✅ `question_categories` tablosu kaldırıldı
- ✅ Çoklu kategori desteği çalışıyor
- ✅ Backend entegrasyonu çalışıyor

**Şimdi test et!** 🚀

**Önce SQL script'lerini sırayla çalıştır, sonra test et!**
