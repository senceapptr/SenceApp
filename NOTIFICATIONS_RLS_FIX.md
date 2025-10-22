# 🔧 Notifications RLS Hatası Çözümü

## 🚨 Sorun:
```
ERROR Create notification error: {"code": "42501", "details": null, "hint": null, "message": "new row violates row-level security policy for table \"notifications\""}
```

## 🎯 Çözüm:

### **1. Supabase Dashboard'da RLS Policy'lerini Düzelt:**

Supabase Dashboard > SQL Editor'de şu SQL'i çalıştır:

```sql
-- Önce mevcut policy'leri temizle
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;

-- RLS'yi etkinleştir
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Yeni policy'leri oluştur
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications" ON notifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" ON notifications
    FOR DELETE USING (auth.uid() = user_id);

-- Policy'lerin oluşturulduğunu kontrol et
SELECT 
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'notifications';
```

### **2. Alternatif Test Yöntemi:**

RLS hatası devam ederse, şu adımları izle:

1. **Mock Test Butonu Kullan:**
   - NotificationsPage'de "Mock Test" butonuna tıkla
   - Bu buton local state'e mock bildirimler ekler
   - Backend'e gitmeden test edebilirsin

2. **Test Butonları:**
   - **Backend Test**: Gerçek backend'e bildirim ekler (RLS düzeltilince çalışır)
   - **Mock Test**: Local state'e mock bildirim ekler (her zaman çalışır)

### **3. RLS Policy Kontrolü:**

Policy'lerin doğru oluşturulduğunu kontrol et:

```sql
-- Notifications tablosu policy'lerini kontrol et
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'notifications';
```

### **4. Test Adımları:**

1. **RLS Policy'lerini Düzelt** (yukarıdaki SQL'i çalıştır)
2. **Backend Test Butonu** ile test et
3. **Mock Test Butonu** ile fallback test et

### **5. Beklenen Sonuçlar:**

#### **RLS Düzeltildikten Sonra:**
- ✅ Backend Test butonu çalışır
- ✅ Bildirimler backend'e kaydedilir
- ✅ Gerçek verilerle test edilir

#### **RLS Hatası Devam Ederse:**
- ✅ Mock Test butonu çalışır
- ✅ Local state'e mock bildirimler eklenir
- ✅ UI/UX test edilir

### **6. Debug Bilgileri:**

Console'da şu logları göreceksin:

```javascript
// RLS hatası
"Create notification error: {code: '42501', message: 'new row violates row-level security policy...'}"

// RLS düzeltildikten sonra
"Create notification error: null"
"Test notifications created successfully"
```

### **7. Manuel Test:**

Eğer butonlar çalışmazsa, Supabase Dashboard'da manuel test:

```sql
-- Mevcut kullanıcıları kontrol et
SELECT id, email FROM auth.users LIMIT 5;

-- Manuel bildirim ekle
INSERT INTO notifications (user_id, type, title, message, is_read, data) VALUES
(
  'YOUR_USER_ID_HERE', -- Gerçek user ID'sini yaz
  'prediction',
  'Manuel Test',
  'Manuel olarak eklenen test bildirimi',
  false,
  '{"test": true}'::jsonb
);
```

## 🎉 Çözüm Tamamlandı!

RLS policy'leri düzeltildikten sonra:
- ✅ Backend Test butonu çalışır
- ✅ Bildirimler backend'e kaydedilir
- ✅ Gerçek verilerle test edilir
- ✅ Mock Test butonu fallback olarak çalışır

**Şimdi test et!** 🚀



