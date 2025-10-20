# Kimlik Doğrulama Sistemi - Uygulama Rehberi

## 🎯 Yapılan Değişiklikler

### 1. Giriş ve Kayıt Ekranları Oluşturuldu
- **Login Screen** (`app/auth/login.tsx`): E-posta ve şifre ile giriş yapma ekranı
- **SignUp Screen** (`app/auth/signup.tsx`): Yeni kullanıcı kaydı ekranı
- Modern gradient arka planlar ve kullanıcı dostu tasarım

### 2. Kimlik Doğrulama Akışı Kuruldu
- **Root Layout** (`app/_layout.tsx`): AuthProvider tüm uygulamayı kapsıyor
- **Index Screen** (`app/index.tsx`): Otomatik yönlendirme yapıyor:
  - Kullanıcı girişli değilse → `/auth/login`
  - Kullanıcı girişliyse → `/SenceFinal`

### 3. Çıkış Yap Özelliği Eklendi
- Settings sayfasına "Çıkış Yap" butonu eklendi
- Çıkış yapınca otomatik olarak login ekranına yönlendirme

## 📱 Kullanım Akışı

### İlk Açılışta
1. Uygulama açıldığında kullanıcı girişi kontrol edilir
2. Giriş yoksa → Login ekranı gösterilir
3. Giriş varsa → SenceFinal ana ekranına yönlendirilir

### Kayıt Olma
1. Login ekranında "Kayıt Ol" linkine tıkla
2. Kullanıcı adı, e-posta ve şifre gir
3. Başarılı kayıttan sonra otomatik giriş yapılır
4. SenceFinal ekranına yönlendirilir

### Giriş Yapma
1. E-posta ve şifre gir
2. "Giriş Yap" butonuna tıkla
3. Başarılı girişten sonra SenceFinal'e yönlendirilir

### Çıkış Yapma
1. SenceFinal uygulamasında menüden "Ayarlar"a git
2. "Çıkış Yap" butonuna tıkla
3. Onay ver
4. Login ekranına yönlendirilir

## 🔧 Teknik Detaylar

### Kullanılan Teknolojiler
- **Supabase Auth**: Backend kimlik doğrulama
- **AuthContext**: State yönetimi
- **Expo Router**: Navigation
- **React Native**: UI components

### Dosya Yapısı
```
app/
├── auth/
│   ├── _layout.tsx       # Auth navigation layout
│   ├── login.tsx         # Giriş ekranı
│   └── signup.tsx        # Kayıt ekranı
├── _layout.tsx           # Root layout (AuthProvider wrapper)
├── index.tsx             # Redirect logic
└── SenceFinal/
    ├── contexts/
    │   └── AuthContext.tsx
    └── components/
        └── SettingsPage/
            ├── components/
            │   └── LogoutButton.tsx
            └── hooks.ts
```

### AuthContext Hook Kullanımı
```typescript
const { user, loading, signIn, signUp, signOut } = useAuth();

// Giriş
await signIn(email, password);

// Kayıt
await signUp(email, password, username);

// Çıkış
await signOut();
```

## ✅ Özellikler

### Login Screen
- ✅ E-posta ve şifre ile giriş
- ✅ Şifre görünürlük toggle
- ✅ "Şifremi Unuttum" linki (UI hazır, işlev eklenebilir)
- ✅ Kayıt ol linkine yönlendirme
- ✅ Hata yönetimi ve kullanıcı bildirimleri
- ✅ Loading state

### SignUp Screen
- ✅ Kullanıcı adı, e-posta ve şifre girişi
- ✅ Şifre tekrarı kontrolü
- ✅ E-posta validasyonu
- ✅ Şifre uzunluk kontrolü (min 6 karakter)
- ✅ Kullanıcı adı uzunluk kontrolü (min 3 karakter)
- ✅ Şifre görünürlük toggle
- ✅ Kullanım koşulları metni
- ✅ Hata yönetimi
- ✅ Loading state

### Logout Functionality
- ✅ Settings sayfasında çıkış butonu
- ✅ Onay dialogu
- ✅ Otomatik yönlendirme

## 🔐 Güvenlik

- Şifreler Supabase tarafından güvenli şekilde hash'leniyor
- Session token'lar otomatik yönetiliyor
- Row Level Security (RLS) politikaları aktif

## 🎨 UI/UX

- Modern gradient arka planlar (mor tonları)
- Smooth animasyonlar
- Kullanıcı dostu hata mesajları
- Responsive tasarım
- Loading state'leri
- Icon kullanımı (Ionicons)

## 📝 Notlar

1. Supabase bağlantısı yapılandırılmış durumda (`lib/supabase.ts`)
2. Email doğrulama istersen Supabase dashboard'dan aktif edilebilir
3. Şifre sıfırlama email fonksiyonu AuthService'te mevcut
4. Profil bilgileri otomatik oluşturuluyor (10000 kredi ile başlıyor)

## 🚀 Sonraki Adımlar (Opsiyonel)

- [ ] Sosyal medya ile giriş (Google, Apple, vb.)
- [ ] Email doğrulama zorunluluğu
- [ ] Şifre sıfırlama akışı
- [ ] Biometric authentication
- [ ] Session timeout yönetimi
- [ ] Remember me özelliği

