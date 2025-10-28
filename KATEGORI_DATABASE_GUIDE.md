# 🎯 Kategori Database Sistemi - Test Rehberi

## 🔧 Yapılan Değişiklikler:

### **1. Database Sütunları:**
- ✅ `category_id` → İlk seçilen kategori (Primary)
- ✅ `secondary_category_id` → İkinci seçilen kategori (Secondary)
- ✅ `third_category_id` → Üçüncü seçilen kategori (Third)

### **2. Soru Oluşturma Sistemi:**
- ✅ İlk seçilen kategori → `category_id` sütununda kaydedilir
- ✅ İkinci seçilen kategori → `secondary_category_id` sütununda kaydedilir
- ✅ Üçüncü seçilen kategori → `third_category_id` sütununda kaydedilir

## 🚀 Test Adımları:

### **1. Soru Oluşturma Testi:**

1. **Soru Yaz Sayfasını Aç:**
   - ✅ Ana sayfadan "Soru Yaz" butonuna tıkla
   - ✅ WriteQuestionPage açılmalı

2. **Kategori Seçimi Testi:**
   - ✅ İlk kategoriyi seç (örn: Spor)
   - ✅ İkinci kategoriyi seç (örn: Sosyal Medya)
   - ✅ Üçüncü kategoriyi seç (örn: Finans)

3. **Soru Oluşturma:**
   - ✅ Soru metnini yaz
   - ✅ Bitiş tarihini seç
   - ✅ "Soru Oluştur" butonuna tıkla

### **2. Database Kontrol Testi:**

1. **Supabase Dashboard'a Git:**
   - ✅ Supabase projesine giriş yap
   - ✅ Database → Tables → questions tablosunu aç

2. **Yeni Oluşturulan Soruyu Bul:**
   - ✅ Son eklenen soruyu bul
   - ✅ `category_id` sütununu kontrol et → İlk seçilen kategori olmalı
   - ✅ `secondary_category_id` sütununu kontrol et → İkinci seçilen kategori olmalı
   - ✅ `third_category_id` sütununu kontrol et → Üçüncü seçilen kategori olmalı

### **3. Kategori Mapping Testi:**

1. **Ana Sayfa Testi:**
   - ✅ Ana sayfada soru görünmeli
   - ✅ Soru primary kategorisini göstermeli

2. **Kategori Sayfası Testi:**
   - ✅ İlk kategoriye tıkla → Soru görünmeli
   - ✅ İkinci kategoriye tıkla → Soru görünmeli
   - ✅ Üçüncü kategoriye tıkla → Soru görünmeli

3. **Soru Detay Sayfası Testi:**
   - ✅ Soruya tıkla
   - ✅ Hangi kategoriden geliyorsa o kategori gösterilmeli

## 🎯 Beklenen Sonuçlar:

### **Database:**
- ✅ `category_id` → İlk seçilen kategori
- ✅ `secondary_category_id` → İkinci seçilen kategori
- ✅ `third_category_id` → Üçüncü seçilen kategori

### **UI/UX:**
- ✅ Kategori seçimi çalışır
- ✅ Ana kategori sistemi çalışır
- ✅ 3 kategori limiti çalışır
- ✅ Database'e doğru kaydedilir

## 🔧 Sorun Giderme:

### **Kategoriler Database'e Kaydedilmiyorsa:**
1. `createQuestion` fonksiyonunu kontrol et
2. `category_ids` array'ini kontrol et
3. Database connection'ını kontrol et

### **Yanlış Kategori Mapping:**
1. `category_id` sütununu kontrol et
2. `secondary_category_id` sütununu kontrol et
3. `third_category_id` sütununu kontrol et

### **Soru Görünmüyorsa:**
1. Database'de soru var mı kontrol et
2. Kategori mapping'i kontrol et
3. Frontend query'leri kontrol et

## 🎉 Test Tamamlandı!

Eğer tüm adımlar başarılıysa:
- ✅ Kategoriler doğru sütunlarda kaydedilir
- ✅ İlk kategori → `category_id`
- ✅ İkinci kategori → `secondary_category_id`
- ✅ Üçüncü kategori → `third_category_id`
- ✅ UI'da doğru kategoriler gösterilir

**Şimdi test et!** 🚀

**Metro bundler'ı yeniden başlat ve Soru Yaz sayfasını test et!**
