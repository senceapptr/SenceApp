# Profil Navigasyon Rehberi

## 🔄 Navigasyon Akışı

### ProfileDrawer Butonları ve Hedef Sayfalar

| Buton | Hedef Sayfa | Handler | Durum |
|-------|-------------|---------|-------|
| **Kullanıcı Adı** | ProfilePage | `handleProfileNavigation` | ✅ Çalışıyor |
| **Bildirimler** | NotificationsPage (Modal) | `handleNotificationsClick` | ✅ Çalışıyor |
| **Market** | MarketPage | `handleMarketClick` | ✅ Çalışıyor |
| **Soru Yaz** | WriteQuestionPage | `handleWriteQuestionClick` | ✅ Çalışıyor |
| **Profili Düzenle** | EditProfilePage | `handleEditProfileNavigation` | ✅ Çalışıyor |
| **Ayarlar** | SettingsPage | `handleSettingsClick` | ✅ Çalışıyor |
| **Çıkış Yap** | Logout (Ana sayfaya dön) | `handleLogout` | ✅ Çalışıyor |

## 📱 Sayfa Detayları

### 1. NotificationsPage (Modal)
- **Açılış:** `appState.setNotificationsOpen(true)`
- **Kapanış:** `appState.setNotificationsOpen(false)`
- **Durum:** Modal olarak açılır, arka plan kararır

### 2. MarketPage
- **Açılış:** `appState.setCurrentPage('market')`
- **Geri:** `appState.setCurrentPage('home')`
- **Özellikler:** Kategori sekmeleri, ürün kartları, kredi sistemi

### 3. WriteQuestionPage
- **Açılış:** `appState.setCurrentPage('write-question')`
- **Geri:** `appState.setCurrentPage('home')`
- **Özellikler:** İki sekme (Soru Yaz, Durumlar), form alanları

### 4. EditProfilePage
- **Açılış:** `appState.setCurrentPage('edit-profile')`
- **Geri:** `appState.setCurrentPage('profile')`
- **Özellikler:** Form alanları, profil fotoğrafı değiştirme

### 5. SettingsPage
- **Açılış:** `appState.setCurrentPage('settings')`
- **Geri:** `appState.setCurrentPage('home')`
- **Özellikler:** Toggle switch'ler, ayar kategorileri

### 6. ProfilePage
- **Açılış:** `appState.setCurrentPage('profile')`
- **Geri:** `appState.setCurrentPage('home')`
- **Özellikler:** Profil bilgileri, istatistikler, takipçi sayıları

## 🔧 Teknik Detaylar

### Handler Fonksiyonları (useAppHandlers.ts)

```typescript
// Bildirimler
const handleNotificationsClick = () => {
  appState.setNotificationsOpen(true);
};

// Market
const handleMarketClick = () => {
  appState.setCurrentPage('market');
};

// Soru Yaz
const handleWriteQuestionClick = () => {
  appState.setCurrentPage('write-question');
};

// Profil Düzenle
const handleEditProfileNavigation = () => {
  appState.setCurrentPage('edit-profile');
};

// Ayarlar
const handleSettingsClick = () => {
  appState.setCurrentPage('settings');
};

// Çıkış
const handleLogout = async () => {
  await AsyncStorage.removeItem('sence_auth');
  appState.setIsAuthenticated(false);
  appState.setCurrentPage('home');
};
```

### PageRenderer Kontrolleri

```typescript
// Market sayfası
if (appState.currentPage === 'market') {
  return <MarketPage onBack={() => appState.setCurrentPage('home')} />;
}

// Profil sayfası
if (appState.currentPage === 'profile') {
  return (
    <ProfilePage
      onBack={() => appState.setCurrentPage('home')}
      onNotifications={() => appState.setNotificationsOpen(true)}
      onEditProfile={() => appState.setCurrentPage('edit-profile')}
    />
  );
}

// Profil düzenle sayfası
if (appState.currentPage === 'edit-profile') {
  return (
    <EditProfilePage
      onBack={() => appState.setCurrentPage('profile')}
    />
  );
}

// Ayarlar sayfası
if (appState.currentPage === 'settings') {
  return (
    <SettingsPage
      onBack={() => appState.setCurrentPage('home')}
    />
  );
}

// Soru yaz sayfası
if (appState.currentPage === 'write-question') {
  return (
    <WriteQuestionPage
      onBack={() => appState.setCurrentPage('home')}
    />
  );
}
```

## 🎯 Test Senaryoları

### Senaryo 1: Kullanıcı Adı (Profil)
1. ProfileDrawer'ı aç
2. Kullanıcı adı kısmına tıkla
3. **Beklenen:** ProfilePage açılmalı
4. Geri butonuna tıkla
5. **Beklenen:** Ana sayfaya dönmeli

### Senaryo 2: Bildirimler
1. ProfileDrawer'ı aç
2. "Bildirimler" butonuna tıkla
3. **Beklenen:** NotificationsPage modal olarak açılmalı
4. Modal'ı kapat
5. **Beklenen:** Ana sayfaya dönmeli

### Senaryo 3: Market
1. ProfileDrawer'ı aç
2. "Market" butonuna tıkla
3. **Beklenen:** MarketPage açılmalı
4. Geri butonuna tıkla
5. **Beklenen:** Ana sayfaya dönmeli

### Senaryo 4: Soru Yaz
1. ProfileDrawer'ı aç
2. "Soru Yaz" butonuna tıkla
3. **Beklenen:** WriteQuestionPage açılmalı
4. Geri butonuna tıkla
5. **Beklenen:** Ana sayfaya dönmeli

### Senaryo 5: Profil Düzenle
1. ProfileDrawer'ı aç
2. "Profili Düzenle" butonuna tıkla
3. **Beklenen:** EditProfilePage açılmalı
4. Geri butonuna tıkla
5. **Beklenen:** ProfilePage'e dönmeli

### Senaryo 6: Ayarlar
1. ProfileDrawer'ı aç
2. "Ayarlar" butonuna tıkla
3. **Beklenen:** SettingsPage açılmalı
4. Geri butonuna tıkla
5. **Beklenen:** Ana sayfaya dönmeli

### Senaryo 7: Çıkış Yap
1. ProfileDrawer'ı aç
2. "Çıkış Yap" butonuna tıkla
3. **Beklenen:** Authentication ekranına dönmeli

## 🐛 Bilinen Sorunlar ve Çözümler

### Sorun 1: ProfileDrawer kapanmıyor
**Çözüm:** Tüm butonlarda `onClose()` çağrısı eklendi

### Sorun 2: Market sayfası çakışması
**Çözüm:** PageRenderer'da duplicate market kontrolü kaldırıldı

### Sorun 3: WriteQuestion handler karışıklığı
**Çözüm:** App.tsx'te doğru handler kullanılıyor

## ✅ Doğrulama Kontrol Listesi

- [x] ProfileDrawer açılıyor
- [x] Tüm butonlar çalışıyor
- [x] Her sayfa doğru render ediliyor
- [x] Geri navigasyon çalışıyor
- [x] Modal'lar doğru açılıp kapanıyor
- [x] State management doğru çalışıyor
- [x] TypeScript hataları yok
- [x] Performans sorunları yok

## 📝 Notlar

- Tüm navigasyon işlemleri `appState.setCurrentPage()` ile yapılıyor
- Modal'lar `appState.setNotificationsOpen()` ile kontrol ediliyor
- ProfileDrawer her buton tıklamasında otomatik kapanıyor
- Geri butonları doğru sayfalara yönlendiriyor
- Tüm sayfalar SafeAreaView kullanıyor
- StatusBar ayarları her sayfada doğru yapılandırılmış 