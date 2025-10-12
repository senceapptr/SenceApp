# SENCEBUDUR Demo Komponentleri

Bu dosya, Figma tasarımlarından React Native'e dönüştürülen komponentlerin kullanımını açıklar.

## 📱 Oluşturulan Komponentler

### 1. FollowersModal.tsx
**Açıklama:** Profil sayfasında takipçi sayısına tıklayınca açılan modal. Üç sekme içerir:
- **Takipçiler:** Kullanıcının takipçilerini listeler
- **Takip Edilenler:** Kullanıcının takip ettiği kişileri listeler  
- **Hareketler:** Son aktiviteleri gösterir

**Özellikler:**
- Sekme geçişleri
- Kullanıcı avatarları (gradient border ile)
- Doğrulanmış kullanıcı rozetleri
- Takip et butonları
- Aktivite zaman damgaları

**Kullanım:**
```tsx
<FollowersModal
  isOpen={showFollowersModal}
  onClose={() => setShowFollowersModal(false)}
  initialTab="followers"
/>
```

### 2. ProfilePage.tsx (QR Modal Eklendi)
**Açıklama:** Profil sayfasına QR kodlu profil paylaşım modalı eklendi.

**Özellikler:**
- QR kod placeholder (gerçek QR kod entegrasyonu için hazır)
- Kullanıcı bilgileri
- Takipçi/takip sayıları
- Link kopyalama özelliği

**Kullanım:**
```tsx
<ProfilePage
  onBack={handleBack}
  onNotifications={handleNotifications}
  onEditProfile={handleEditProfile}
/>
```

### 3. CouponDrawer.tsx
**Açıklama:** Soru kutucuklarında Evet/Hayır butonlarına tıklayınca açılan kupon oluşturma penceresi.

**Özellikler:**
- Seçilen tahminleri listeler
- Toplam oran hesaplama
- Potansiyel kazanç hesaplama
- Tahmin silme özelliği
- Kupon oluşturma

**Kullanım:**
```tsx
<CouponDrawer
  isOpen={showCouponDrawer}
  onClose={() => setShowCouponDrawer(false)}
  selections={selections}
  onRemoveSelection={handleRemoveSelection}
  onClearAll={handleClearAll}
/>
```

## 🎯 Demo Sayfası

`DemoPage.tsx` dosyası tüm komponentleri test etmek için oluşturuldu. Bu sayfa:

- Tüm komponentleri tek yerden test etme imkanı sağlar
- Her komponentin nasıl çalıştığını gösterir
- Mock data ile gerçekçi örnekler sunar

## 🚀 Kurulum ve Çalıştırma

1. **Demo modunu aktif etmek için:**
   ```tsx
   // App.tsx dosyasında
   const [showDemo, setShowDemo] = useState(true);
   ```

2. **Demo modunu kapatmak için:**
   ```tsx
   const [showDemo, setShowDemo] = useState(false);
   ```

3. **Uygulamayı çalıştırın:**
   ```bash
   npm start
   # veya
   expo start
   ```

## 📋 Mock Data Yapısı

### FollowersModal için:
```tsx
const followers = [
  {
    id: 1,
    username: 'ahmet_bey',
    name: 'Ahmet Demir',
    avatar: 'https://...',
    verified: true
  }
];

const activities = [
  {
    id: 1,
    user: 'ahmet_bey',
    action: '"Galatasaray şampiyonluk yaşayabilir mi?" tahminine',
    vote: 'Evet',
    time: '2 dk önce',
    avatar: 'https://...'
  }
];
```

### CouponDrawer için:
```tsx
const selections = [
  {
    id: 1,
    title: "Erdoğan sonraki mitinginde saçını sağa tarar mı?",
    vote: 'yes', // 'yes' veya 'no'
    odds: 1.47,
    boosted: false
  }
];
```

## 🎨 Tasarım Özellikleri

- **Renk Paleti:** 
  - Ana renk: `#432870` (mor)
  - İkincil renk: `#B29EFD` (açık mor)
  - Arka plan: `#F2F3F5` (gri)
  - Metin: `#202020` (koyu gri)

- **Tipografi:**
  - Başlıklar: `fontWeight: '900'`
  - Alt başlıklar: `fontWeight: '700'`
  - Normal metin: `fontWeight: '400'`

- **Gölgeler ve Efektler:**
  - Kartlar için hafif gölgeler
  - Gradient border'lar
  - Hover efektleri (TouchableOpacity ile)

## 🔧 Özelleştirme

Komponentleri özelleştirmek için:

1. **Renkleri değiştirmek:** `styles` objelerindeki renk kodlarını güncelleyin
2. **Boyutları ayarlamak:** `padding`, `margin`, `fontSize` değerlerini değiştirin
3. **Veri yapısını değiştirmek:** Interface'leri güncelleyin

## 📝 Notlar

- Tüm komponentler React Native için optimize edilmiştir
- Expo LinearGradient kullanılmıştır
- Ionicons ikonları kullanılmıştır
- TypeScript desteği mevcuttur
- Responsive tasarım prensipleri uygulanmıştır

## 🐛 Bilinen Sorunlar

- QR kod placeholder olarak basit bir grid kullanılmıştır
- Gerçek QR kod entegrasyonu için ek kütüphane gerekebilir
- Link kopyalama özelliği Alert ile simüle edilmiştir

## 📞 Destek

Herhangi bir sorun yaşarsanız veya özelleştirme yardımına ihtiyacınız varsa, lütfen iletişime geçin. 