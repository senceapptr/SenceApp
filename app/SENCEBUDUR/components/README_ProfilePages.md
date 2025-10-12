# Profile Pages & Components

## Overview
Bu dokümantasyon, Sence uygulamasının profil ile ilgili tüm sayfalarını ve bileşenlerini kapsar. Figma tasarımlarından React Native'e dönüştürülmüş tüm profil sayfaları burada yer almaktadır.

## 📱 Bileşenler

### 1. ProfileDrawer (Profil Dropdown)
**Dosya:** `ProfileDrawer.tsx`

Header'daki profil resmine tıklandığında açılan dropdown menü.

**Özellikler:**
- Kullanıcı bilgileri (avatar, kullanıcı adı, kredi)
- Menü öğeleri (Bildirimler, Market, Soru Yaz, Profili Düzenle, Ayarlar, Çıkış Yap)
- Okunmamış bildirim göstergesi
- Sağ üst köşede açılan modal tasarım

**Props:**
```typescript
interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onEditProfile: () => void;
  onSettings: () => void;
  onNotifications: () => void;
  onWriteQuestion: () => void;
  onMarket: () => void;
  onLogout: () => void;
  hasNotifications: boolean;
}
```

### 2. ProfilePage (Ana Profil Sayfası)
**Dosya:** `ProfilePage.tsx`

Kullanıcının ana profil sayfası.

**Özellikler:**
- Profil fotoğrafı ve kullanıcı bilgileri
- Takipçi/Takip butonları
- Biyografi bölümü
- Tahmin istatistikleri (toplam, başarılı, başarı oranı)
- Dairesel ilerleme çubuğu
- Kategori başarısı
- Profili düzenle butonu

**Props:**
```typescript
interface ProfilePageProps {
  onBack: () => void;
  onNotifications: () => void;
  onEditProfile: () => void;
}
```

### 3. NotificationsPage (Bildirimler Sayfası)
**Dosya:** `NotificationsPage.tsx`

Bildirimler modal sayfası.

**Özellikler:**
- Okunmamış bildirim sayısı
- "Tümünü Oku" butonu
- Bildirim türleri (tahmin sonucu, lig sıralaması, takipçi, hatırlatma, bonus)
- Okunmamış bildirim göstergeleri
- Zaman damgaları

**Props:**
```typescript
interface NotificationsPageProps {
  isOpen: boolean;
  onClose: () => void;
}
```

### 4. MarketPage (Market Sayfası)
**Dosya:** `MarketPage.tsx`

Kredi ile ürün satın alma sayfası.

**Özellikler:**
- Kategori sekmeleri (Tümü, Elektronik, Ev & Yaşam)
- Öne çıkan ürünler
- Ürün kartları (resim, isim, açıklama, fiyat)
- İndirim ve popülerlik rozetleri
- Kredi sistemi
- Yetersiz kredi uyarıları

**Props:**
```typescript
interface MarketPageProps {
  onBack: () => void;
}
```

### 5. WriteQuestionPage (Soru Yaz Sayfası)
**Dosya:** `WriteQuestionPage.tsx`

Soru oluşturma ve durum takip sayfası.

**Özellikler:**
- İki sekme: "Soru Yaz" ve "Durumlar"
- Soru oluşturma formu (soru, açıklama, bitiş tarihi)
- Karakter sayacı
- Otomatik EVET/HAYIR seçenekleri
- Gönderilen soruların durumu (onaylandı, bekliyor, reddedildi)
- Red sebebi gösterimi

**Props:**
```typescript
interface WriteQuestionPageProps {
  onBack: () => void;
}
```

### 6. EditProfilePage (Profil Düzenle Sayfası)
**Dosya:** `EditProfilePage.tsx`

Profil bilgilerini düzenleme sayfası.

**Özellikler:**
- Profil fotoğrafı değiştirme
- Form alanları (görünen isim, kullanıcı adı, hakkımda, konum, website)
- Karakter sınırı (hakkımda: 150 karakter)
- Gizlilik ayarları bölümü
- Değişiklikleri kaydet butonu

**Props:**
```typescript
interface EditProfilePageProps {
  onBack: () => void;
}
```

### 7. SettingsPage (Ayarlar Sayfası)
**Dosya:** `SettingsPage.tsx`

Uygulama ayarları sayfası.

**Özellikler:**
- Kullanıcı profil özeti
- Bildirim ayarları (uygulama, push, e-posta)
- Görünüm ayarları (karanlık mod, dil)
- Hesap ayarları (gizlilik)
- Toggle switch'ler

**Props:**
```typescript
interface SettingsPageProps {
  onBack: () => void;
}
```

## 🎨 Tasarım Sistemi

### Renkler
- **Primary:** `#432870` (Koyu Mor)
- **Secondary:** `#B29EFD` (Açık Mor)
- **Background:** `#F2F3F5` (Açık Gri)
- **Text:** `#202020` (Koyu Gri)
- **Success:** `#10B981` (Yeşil)
- **Warning:** `#F59E0B` (Turuncu)
- **Error:** `#EF4444` (Kırmızı)

### Tipografi
- **Başlıklar:** 20-24px, fontWeight: '900'
- **Alt başlıklar:** 18px, fontWeight: '900'
- **Normal metin:** 16px, fontWeight: 'bold'
- **Küçük metin:** 14px, fontWeight: 'normal'
- **Çok küçük:** 12px, fontWeight: 'normal'

### Bileşen Stilleri
- **Border Radius:** 12-24px (yuvarlak köşeler)
- **Shadow:** Subtle gölgeler (elevation: 2-3)
- **Padding:** 16-20px (iç boşluklar)
- **Margin:** 12-24px (dış boşluklar)

## 🔄 Navigasyon Akışı

```
Ana Sayfa
├── Profil Dropdown (Header)
│   ├── Bildirimler → NotificationsPage
│   ├── Market → MarketPage
│   ├── Soru Yaz → WriteQuestionPage
│   ├── Profili Düzenle → EditProfilePage
│   ├── Ayarlar → SettingsPage
│   └── Çıkış Yap → Logout
└── Profil Sayfası → ProfilePage
    ├── Bildirimler → NotificationsPage
    └── Profili Düzenle → EditProfilePage
```

## 📱 Kullanım Örnekleri

### ProfileDrawer Kullanımı
```typescript
<ProfileDrawer
  isOpen={isProfileDrawerOpen}
  onClose={() => setIsProfileDrawerOpen(false)}
  onEditProfile={() => navigateToEditProfile()}
  onSettings={() => navigateToSettings()}
  onNotifications={() => openNotifications()}
  onWriteQuestion={() => navigateToWriteQuestion()}
  onMarket={() => navigateToMarket()}
  onLogout={() => handleLogout()}
  hasNotifications={true}
/>
```

### Sayfa Navigasyonu
```typescript
// Profil sayfasına git
appState.setCurrentPage('profile');

// Market sayfasına git
appState.setCurrentPage('market');

// Soru yaz sayfasına git
appState.setCurrentPage('write-question');

// Ayarlar sayfasına git
appState.setCurrentPage('settings');
```

## 🔧 Teknik Detaylar

### Bağımlılıklar
- React Native core components
- @expo/vector-icons (ikonlar için)
- React hooks (state management)

### Performans Optimizasyonları
- ScrollView'lerde `showsVerticalScrollIndicator={false}`
- Modal'lerde `animationType="slide"` veya `"fade"`
- TouchableOpacity'lerde `activeOpacity={0.7}`

### Erişilebilirlik
- SafeAreaView kullanımı
- StatusBar ayarları
- Touch target boyutları (minimum 44px)

## 📝 Notlar

- Tüm metinler Türkçe olarak yazılmıştır
- Responsive tasarım prensipleri uygulanmıştır
- TypeScript ile tip güvenliği sağlanmıştır
- Figma tasarımlarına sadık kalınmıştır
- Modern mobile UI/UX standartları takip edilmiştir 