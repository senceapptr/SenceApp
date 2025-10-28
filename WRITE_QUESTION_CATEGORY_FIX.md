# 🔧 WriteQuestionPage Kategori Hatası Düzeltildi!

## 🚨 Düzeltilen Sorun:

**Hata:** `invalid input syntax for type uuid: "default-category"`

**Sebep:** Database'de `category_id` UUID tipinde ama kodda string gönderiliyordu.

## 🔧 Yapılan Değişiklikler:

### **1. Categories Service Oluşturuldu:**
- ✅ `categoriesService.ts` oluşturuldu
- ✅ `getActiveCategories` fonksiyonu eklendi
- ✅ `getCategoryById` fonksiyonu eklendi
- ✅ `getCategoryBySlug` fonksiyonu eklendi

### **2. WriteQuestionPage Hooks Güncellemeleri:**
- ✅ Kategoriler dinamik olarak yükleniyor
- ✅ Varsayılan kategori seçimi eklendi
- ✅ UUID formatında kategori ID kullanılıyor

### **3. Services Index Güncellemesi:**
- ✅ `categoriesService` export edildi

## 🔧 Teknik Detaylar:

### **Categories Service:**
```typescript
export const categoriesService = {
  async getActiveCategories(): Promise<{ data: Category[] | null; error: Error | null }>
  async getCategoryById(categoryId: string): Promise<{ data: Category | null; error: Error | null }>
  async getCategoryBySlug(slug: string): Promise<{ data: Category | null; error: Error | null }>
}
```

### **Kategori Seçimi:**
```typescript
// İlk kategoriyi varsayılan olarak kullan (Genel kategori)
const defaultCategory = categories.find(cat => cat.slug === 'genel') || categories[0];

if (!defaultCategory) {
  Alert.alert('Hata', 'Kategori bulunamadı. Lütfen tekrar deneyin.');
  return;
}

// Soru oluştur
const { data, error } = await questionsService.createQuestion({
  title: question.trim(),
  description: description.trim(),
  category_id: defaultCategory.id, // UUID formatında
  end_date: endDate,
}, user.id);
```

### **Database Schema:**
```sql
-- Kategoriler tablosu
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  color TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO public.categories (name, slug, icon, color, description) VALUES
  ('Genel', 'genel', '🌍', '#6B7280', 'Diğer konular'),
  ('Teknoloji', 'teknoloji', '💻', '#3B82F6', 'Teknoloji ve yazılım dünyası'),
  ('Finans', 'finans', '💰', '#10B981', 'Ekonomi, borsa ve kripto'),
  -- ... diğer kategoriler
);
```

## 🚀 Test Adımları:

### **1. Soru Yazma Testi:**

1. **Soru Yaz Sayfasını Aç:**
   - ✅ Ana sayfadan "Soru Yaz" butonuna tıkla
   - ✅ WriteQuestionPage açılmalı

2. **Soru Bilgilerini Gir:**
   - ✅ Soru başlığını gir
   - ✅ Soru açıklamasını gir
   - ✅ Bitiş tarihini gir
   - ✅ "Gönder" butonuna tıkla

3. **Beklenen Sonuçlar:**
   - ✅ Loading state gösterilmeli
   - ✅ Soru database'e kaydedilmeli
   - ✅ Kategori ID UUID formatında olmalı
   - ✅ Başarı mesajı gösterilmeli
   - ✅ Form sıfırlanmalı

### **2. Kategori Yükleme Testi:**

1. **Kategoriler Yüklenmeli:**
   - ✅ Sayfa açıldığında kategoriler yüklenmeli
   - ✅ Varsayılan kategori seçilmeli
   - ✅ UUID formatında kategori ID kullanılmalı

### **3. Error Handling Testi:**

1. **Kategori Bulunamadığında:**
   - ✅ Kategori bulunamazsa hata mesajı gösterilmeli
   - ✅ Soru gönderimi durdurulmalı

2. **Network Hatası Testi:**
   - ✅ İnternet bağlantısını kes
   - ✅ Soru göndermeyi dene
   - ✅ Hata mesajı gösterilmeli

## 🎯 Beklenen Sonuçlar:

### **Soru Oluşturma:**
- ✅ Soru database'e kaydedilmeli
- ✅ `category_id` UUID formatında olmalı
- ✅ `status: 'draft'` olarak kaydedilmeli
- ✅ `created_by` field'ı kullanıcı ID'si ile doldurulmalı
- ✅ Başarı mesajı gösterilmeli

### **Kategori Yönetimi:**
- ✅ Kategoriler dinamik olarak yüklenmeli
- ✅ Varsayılan kategori seçilmeli
- ✅ UUID formatında kategori ID kullanılmalı

### **UI Güncellemeleri:**
- ✅ Form sıfırlanmalı
- ✅ Başarı mesajı gösterilmeli
- ✅ Soru listesi güncellenmeli
- ✅ Loading state'leri çalışmalı

## 🔧 Sorun Giderme:

### **Kategori Hatası Alıyorsan:**
1. Database'deki categories tablosunu kontrol et
2. Seed data'nın yüklendiğini kontrol et
3. Kategori ID'lerinin UUID formatında olduğunu kontrol et

### **Soru Kaydedilmiyorsa:**
1. Console'da hata mesajlarını kontrol et
2. Database bağlantısını kontrol et
3. RLS policy'lerini kontrol et
4. User authentication'ını kontrol et

### **Kategoriler Yüklenmiyorsa:**
1. Database'deki categories tablosunu kontrol et
2. `is_active` field'ını kontrol et
3. RLS policy'lerini kontrol et

## 🎉 Test Tamamlandı!

Eğer tüm adımlar başarılıysa:
- ✅ Soru yazma backend'e bağlı
- ✅ Kategori hatası düzeltildi
- ✅ UUID formatında kategori ID kullanılıyor
- ✅ Database güncellemeleri çalışıyor
- ✅ Error handling çalışıyor
- ✅ Loading state'leri çalışıyor
- ✅ UI güncellemeleri çalışıyor

**Şimdi test et!** 🚀

**Soru Yaz sayfasını aç ve yeni bir soru oluştur!**

