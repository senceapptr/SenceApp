# 🎯 Kategori Sistemi V2 - Test Rehberi

## 🔧 Yapılan Değişiklikler:

### **1. Database Değişiklikleri:**
- ✅ `questions` tablosuna `secondary_category_id` ve `third_category_id` sütunları eklendi
- ✅ Foreign key constraint'leri eklendi
- ✅ Index'ler oluşturuldu
- ✅ Daha basit ve performanslı yapı

### **2. Backend Service Güncellemeleri:**
- ✅ `createQuestion` fonksiyonu güncellendi (secondary ve third kategori desteği)
- ✅ `getQuestionsByCategory` fonksiyonu düzeltildi
- ✅ `getAllQuestions` fonksiyonu güncellendi
- ✅ `searchQuestions` fonksiyonu güncellendi

### **3. Frontend Güncellemeleri:**
- ✅ HomePage'de primary kategori gösterimi
- ✅ CategoryQuestionsPage'de kategoriye göre doğru kategori gösterimi
- ✅ Soru detay sayfasında kategoriye göre kategori gösterimi

## 🚀 Test Adımları:

### **1. Database Güncellemeleri:**

1. **Supabase SQL Editor'da Çalıştır:**
   ```sql
   -- FIX_CATEGORY_SYSTEM_V2.sql dosyasındaki SQL'i çalıştır
   ```

2. **Tabloları Kontrol Et:**
   - ✅ `questions` tablosunda `secondary_category_id` sütunu olmalı
   - ✅ `questions` tablosunda `third_category_id` sütunu olmalı
   - ✅ Foreign key constraint'leri olmalı
   - ✅ Index'ler oluşmalı

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

### **5. Soru Detay Sayfası Testi:**

1. **Soru Detayını Aç:**
   - ✅ Herhangi bir soruya tıkla
   - ✅ Soru detay sayfası açılmalı

2. **Kategori Görüntüleme:**
   - ✅ Kategori bilgisi doğru görünmeli
   - ✅ Ana sayfadan geliyorsa primary kategori görünmeli
   - ✅ Kategori sayfasından geliyorsa o kategori görünmeli

### **6. Çoklu Kategori Testi:**

1. **Çoklu Kategorili Soru Oluştur:**
   - ✅ Spor + Sosyal Medya kategorilerinde soru oluştur

2. **Kategori Sayfalarında Test Et:**
   - ✅ Spor kategorisinde soru görünmeli
   - ✅ Sosyal Medya kategorisinde soru görünmeli
   - ✅ Her iki sayfada da doğru kategori görünmeli

## 🎯 Beklenen Sonuçlar:

### **Database:**
- ✅ `questions` tablosunda `secondary_category_id` sütunu
- ✅ `questions` tablosunda `third_category_id` sütunu
- ✅ Foreign key constraint'leri
- ✅ Index'ler

### **Soru Yazma:**
- ✅ Çoklu kategori seçimi
- ✅ Primary, secondary, third kategori sıralaması
- ✅ Backend'e doğru kayıt

### **Ana Sayfa:**
- ✅ Primary kategoriler görünümü (category_id)
- ✅ Kategori adları doğru
- ✅ Kategori renkleri doğru

### **Kategori Sayfaları:**
- ✅ Kategoriye göre soru listeleme
- ✅ Doğru kategori görüntüleme
- ✅ Çoklu kategorili sorular görünümü

### **Soru Detay:**
- ✅ Kategoriye göre kategori görüntüleme
- ✅ Ana sayfadan geliyorsa primary kategori
- ✅ Kategori sayfasından geliyorsa o kategori

## 🔧 Sorun Giderme:

### **Database Hatası Alıyorsa:**
1. SQL script'ini çalıştırdın mı kontrol et
2. `questions` tablosunda yeni sütunlar var mı kontrol et
3. Foreign key constraint'leri var mı kontrol et

### **Kategori Görünmüyorsa:**
1. Backend service'ini kontrol et
2. Database'de veri var mı kontrol et
3. Console'da hata var mı kontrol et

### **Çoklu Kategori Çalışmıyorsa:**
1. `secondary_category_id` ve `third_category_id` sütunları var mı kontrol et
2. Değerler kaydediliyor mu kontrol et
3. Frontend'de doğru mapping yapılıyor mu kontrol et

### **Kategori Sayfası Hatası:**
1. `getQuestionsByCategory` fonksiyonu çalışıyor mu kontrol et
2. Database'de ilişkiler doğru mu kontrol et
3. RLS policy'leri aktif mi kontrol et

## 🎉 Test Tamamlandı!

Eğer tüm adımlar başarılıysa:
- ✅ Kategori sistemi V2 düzeltildi
- ✅ Çoklu kategori desteği çalışıyor
- ✅ Primary, secondary, third kategoriler çalışıyor
- ✅ Kategoriye göre doğru görüntüleme çalışıyor
- ✅ Backend entegrasyonu çalışıyor
- ✅ Daha basit ve performanslı yapı

**Şimdi test et!** 🚀

**Önce SQL script'ini çalıştır, sonra tüm sayfaları test et!**
