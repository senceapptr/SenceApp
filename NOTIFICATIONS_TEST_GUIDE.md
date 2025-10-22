# 🔔 NotificationsPage Test Rehberi

NGörev: NotificationsPage'i test etmek ve backend'e bildirimler eklemek

## 🚀 Test Adımları:

### 1. **Uygulamayı Başlat:**
```bash
cd /Users/ilginyolgezen/SenceApp-main
npx expo start --port 8083
```

### 2. **NotificationsPage'e Git:**
- Uygulamada NotificationsPage'e git
- Eğer menüden erişim varsa oradan git
- Veya direkt olarak NotificationsPage component'ini aç

### 3. **Test Butonu ile Bildirimler Oluştur:**
- Sayfada "Test Bildirimleri Oluştur" butonunu göreceksin
- Bu butona tıkla
- Backend'e test bildirimleri eklenecek
- "Başarılı! Test bildirimleri oluşturuldu!" mesajını göreceksin

### 4. **Beklenen Sonuçlar:**

#### **Backend'den Veri Gelirse:**
- ✅ Loading spinner gösterilir
- ✅ Backend'den bildirimler yüklenir
- ✅ Bildirimler listelenir
- ✅ Test butonu ile yeni bildirimler eklenebilir
- ✅ Okundu işaretleme çalışır
- ✅ Bildirim silme çalışır

#### **Backend'de Veri Yoksa (Fallback):**
- ✅ Loading spinner gösterilir
- ✅ Mock data gösterilir
- ✅ Test butonu ile yeni bildirimler eklenebilir
- ✅ Tüm işlemler çalışır

### 5. **Test Edilecek Özellikler:**

#### **Bildirim Türleri:**
- 🎯 **Prediction**: Tahmin sonuçları
- 🏆 **League**: Lig güncellemeleri
- 👥 **Friend**: Arkadaş aktiviteleri
- 🔔 **System**: Sistem bildirimleri

#### **Bildirim İşlemleri:**
- ✅ **Okundu İşaretleme**: Bildirime tıklayınca okundu olarak işaretlenir
- ✅ **Bildirim Silme**: Bildirimi silme işlemi
- ✅ **Tümünü Okundu İşaretleme**: Tüm bildirimleri okundu olarak işaretle
- ✅ **Loading States**: Veri yüklenirken loading gösterilir

### 6. **Test Bildirimleri:**

Test butonu aşağıdaki bildirimleri oluşturur:

1. **Tahmin Sonuçlandı**
   - Mesaj: "Galatasaray şampiyonluk yaşayacak mı?" tahminin doğru çıktı!
   - Ödül: +250 kredi

2. **Liga Sıralaması**
   - Mesaj: Spor liginde 3. sıraya yükseldin!

3. **Yeni Takipçi**
   - Mesaj: ahmet_bey seni takip etmeye başladı

4. **Günlük Bonus**
   - Mesaj: Günlük giriş bonusun hazır! 100 kredi kazandın
   - Ödül: +100 kredi

### 7. **Hata Durumları:**

#### **Network Hatası:**
- ❌ Backend'e bağlanılamazsa mock data gösterilir
- ❌ Test butonu çalışmazsa hata mesajı gösterilir

#### **Auth Hatası:**
- ❌ Giriş yapılmamışsa bildirimler yüklenmez
- ❌ Test butonu çalışmaz

### 8. **Console Logları:**

Test sırasında console'da şu logları göreceksin:

```javascript
// Backend'den veri çekme
"Loading notifications for user: [user-id]"
"Load notifications response: { data: [...], error: null }"

// Test bildirimleri oluşturma
"Creating test notifications for user: [user-id]"
"Test notifications created successfully"

// Hata durumları
"Backend error, using mock data: [error]"
"Notifications data load error: [error]"
```

### 9. **Supabase Dashboard Kontrolü:**

Supabase Dashboard'da kontrol edebilirsin:

1. **Table Editor** > **notifications** tablosuna git
2. Yeni eklenen bildirimleri gör
3. Bildirim işlemlerini kontrol et

### 10. **Manuel SQL Testi:**

Eğer test butonu çalışmazsa, Supabase Dashboard > SQL Editor'de şu SQL'i çalıştır:

```sql
-- Mevcut kullanıcıları kontrol et
SELECT id, email FROM auth.users LIMIT 5;

-- Test bildirimi ekle (user_id'yi gerçek ID ile değiştir)
INSERT INTO notifications (user_id, type, title, message, is_read, data) VALUES
(
  'YOUR_USER_ID_HERE', -- Gerçek user ID'sini yaz
  'prediction',
  'Tahmin Sonuçlandı',
  '"Test tahmini" tahminin doğru çıktı!',
  false,
  '{"questionTitle": "Test tahmini", "isCorrect": true, "reward": 250}'::jsonb
);

-- Bildirimleri kontrol et
SELECT * FROM notifications WHERE user_id = 'YOUR_USER_ID_HERE' ORDER BY created_at DESC;
```

## 🎯 Başarı Kriterleri:

- ✅ NotificationsPage açılır
- ✅ Loading spinner gösterilir
- ✅ Bildirimler yüklenir (backend veya mock)
- ✅ Test butonu çalışır
- ✅ Bildirim işlemleri çalışır
- ✅ Error handling çalışır
- ✅ Animation'lar korunur

## 🔧 Sorun Giderme:

### **Bildirimler Yüklenmiyor:**
1. Internet bağlantısını kontrol et
2. Supabase bağlantısını kontrol et
3. Console loglarını kontrol et

### **Test Butonu Çalışmıyor:**
1. Giriş yapıldığını kontrol et
2. Console'da hata mesajlarını kontrol et
3. Supabase permissions'ları kontrol et

### **Bildirimler Görünmüyor:**
1. Backend'de veri var mı kontrol et
2. Mock data fallback çalışıyor mu kontrol et
3. Console'da mapping hatalarını kontrol et

## 🎉 Test Tamamlandı!

Eğer tüm adımlar başarılıysa, NotificationsPage backend entegrasyonu tamamlanmış demektir! 🚀



