# 🔍 Kategori Seçimi Debug Rehberi

## 🚨 Sorun: Kategoriler Görünmüyor

### 🔧 Yapılan Düzeltmeler:

1. **Debug Log'ları Eklendi:**
   - ✅ Categories service'inde debug log'ları
   - ✅ Hooks'ta debug log'ları
   - ✅ QuestionForm'da debug log'ları

2. **Fallback UI Eklendi:**
   - ✅ Kategoriler yüklenirken "Kategoriler yükleniyor..." mesajı
   - ✅ Boş kategori listesi kontrolü

3. **Error Handling İyileştirildi:**
   - ✅ Kategori yükleme hatalarını yakalama
   - ✅ Console'da detaylı hata mesajları

## 🚀 Test Adımları:

### **1. Console Log'larını Kontrol Et:**

1. **Soru Yaz Sayfasını Aç:**
   - ✅ Ana sayfadan "Soru Yaz" butonuna tıkla
   - ✅ Console'u aç (F12 veya React Native Debugger)

2. **Console'da Görmen Gereken Log'lar:**
   ```
   Loading categories...
   Fetching categories from database...
   Categories fetched successfully: [array of categories]
   Categories loaded: [array of categories]
   QuestionForm categories: [array of categories]
   QuestionForm categoryId: ""
   ```

### **2. Hata Durumlarını Kontrol Et:**

#### **Eğer "Loading categories..." görünmüyorsa:**
- Hooks'ta useEffect çalışmıyor
- Component mount olmamış

#### **Eğer "Fetching categories from database..." görünmüyorsa:**
- Categories service çağrılmıyor
- Import hatası olabilir

#### **Eğer "Categories fetched successfully:" görünmüyorsa:**
- Database bağlantı hatası
- RLS policy hatası
- Categories tablosu boş

#### **Eğer "Categories loaded:" görünmüyorsa:**
- setCategories çalışmıyor
- State güncellemesi başarısız

### **3. Database Kontrolü:**

1. **Supabase Dashboard'a Git:**
   - ✅ Supabase projenize gidin
   - ✅ Table Editor'da "categories" tablosunu açın

2. **Kategoriler Var mı Kontrol Et:**
   - ✅ Tabloda veri var mı?
   - ✅ `is_active = true` olan kayıtlar var mı?

3. **RLS Policy Kontrolü:**
   - ✅ Authentication > Policies
   - ✅ Categories tablosu için policy var mı?

## 🔧 Sorun Giderme:

### **Kategoriler Database'de Yoksa:**
```sql
-- Supabase SQL Editor'da çalıştır:
INSERT INTO categories (id, name, slug, icon, color, description, is_active) VALUES
('1', 'Teknoloji', 'teknoloji', '💻', '#3B82F6', 'Teknoloji ile ilgili sorular', true),
('2', 'Finans', 'finans', '💰', '#10B981', 'Finans ve ekonomi soruları', true),
('3', 'Spor', 'spor', '⚽', '#F59E0B', 'Spor ve rekabet soruları', true),
('4', 'Politika', 'politika', '🏛️', '#EF4444', 'Politik konular', true),
('5', 'Eğlence', 'eglence', '🎬', '#8B5CF6', 'Eğlence ve medya', true),
('6', 'Bilim', 'bilim', '🔬', '#06B6D4', 'Bilimsel konular', true),
('7', 'Sosyal Medya', 'sosyal-medya', '📱', '#84CC16', 'Sosyal medya konuları', true),
('8', 'Genel', 'genel', '🌍', '#6B7280', 'Genel konular', true);
```

### **RLS Policy Hatası Varsa:**
```sql
-- Supabase SQL Editor'da çalıştır:
DROP POLICY IF EXISTS "Enable read access for all users" ON public.categories;
CREATE POLICY "Enable read access for all users" ON public.categories
    FOR SELECT USING (true);
```

### **Import Hatası Varsa:**
```typescript
// hooks.ts dosyasında import'u kontrol et:
import { categoriesService } from '@/services/categories.service';
```

## 🎯 Beklenen Sonuçlar:

### **Başarılı Durum:**
- ✅ Console'da tüm log'lar görünmeli
- ✅ Kategoriler dropdown'da listelenmeli
- ✅ Kategori seçimi çalışmalı
- ✅ Form validation çalışmalı

### **Hata Durumu:**
- ❌ Console'da hata mesajları görünmeli
- ❌ "Kategoriler yükleniyor..." mesajı görünmeli
- ❌ Kategori seçimi çalışmamalı

## 🚀 Test Et:

1. **Soru Yaz sayfasını aç**
2. **Console'u kontrol et**
3. **Kategori dropdown'unu aç**
4. **Kategoriler görünüyor mu kontrol et**

**Console'da hangi log'ları görüyorsun?** 🔍
