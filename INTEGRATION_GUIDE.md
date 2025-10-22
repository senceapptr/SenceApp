# Supabase Backend Entegrasyon Rehberi

## 📋 İçindekiler

1. [Kurulum Özeti](#kurulum-özeti)
2. [Dosya Yapısı](#dosya-yapısı)
3. [Backend Hazırlık](#backend-hazırlık)
4. [Frontend Entegrasyonu](#frontend-entegrasyonu)
5. [Örnek Kullanım](#örnek-kullanım)
6. [Real-time Özellikler](#real-time-özellikler)
7. [Hata Ayıklama](#hata-ayıklama)

---

## Kurulum Özeti

### ✅ Tamamlananlar:

1. **Paketler yüklendi**
   - @supabase/supabase-js
   - expo-constants
   - dotenv

2. **Backend yapısı oluşturuldu**
   - Supabase client (`lib/supabase.ts`)
   - Auth Context (`app/SenceFinal/contexts/AuthContext.tsx`)
   - 9 adet servis dosyası (`services/`)

3. **Database şeması hazır**
   - 18 tablo yapısı
   - RLS politikaları
   - Seed data

---

## Dosya Yapısı

```
SenceApp-main/
├── lib/
│   ├── supabase.ts              # Supabase client
│   ├── supabase-storage.ts      # AsyncStorage adapter
│   └── database.types.ts        # TypeScript types
│
├── services/
│   ├── auth.service.ts          # Authentication
│   ├── questions.service.ts     # Sorular
│   ├── predictions.service.ts   # Tahminler
│   ├── coupons.service.ts       # Kuponlar
│   ├── leagues.service.ts       # Ligler
│   ├── profile.service.ts       # Profil
│   ├── tasks.service.ts         # Görevler
│   ├── notifications.service.ts # Bildirimler
│   ├── market.service.ts        # Market
│   └── index.ts                 # Export all
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_row_level_security.sql
│   │   └── 003_seed_data.sql
│   └── DATABASE_SETUP.md
│
├── app/SenceFinal/contexts/
│   └── AuthContext.tsx          # Auth state yönetimi
│
└── .env.local                   # Environment variables
```

---

## Backend Hazırlık

### 1. Supabase Projesi Oluştur

1. https://supabase.com/dashboard adresine git
2. "New Project" ile proje oluştur
3. Settings > API sayfasından bilgileri al

### 2. Environment Variables Ayarla

`.env.local` dosyasını düzenle:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. SQL Migration'ları Çalıştır

Supabase Dashboard > SQL Editor'de sırayla:

1. `001_initial_schema.sql` - Tabloları oluşturur
2. `002_row_level_security.sql` - Güvenlik politikaları
3. `003_seed_data.sql` - Başlangıç verileri

### 4. Storage Bucket'larını Oluştur

Storage bölümünden:
- `avatars` (Public)
- `covers` (Public)
- `questions` (Public)

### 5. TypeScript Tiplerini Generate Et

```bash
npx supabase gen types typescript --project-id "YOUR_PROJECT_ID" --schema public > lib/database.types.ts
```

---

## Frontend Entegrasyonu

### 1. App.tsx'e AuthProvider Ekle

```tsx
// app/SenceFinal/App.tsx
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            {/* Mevcut kodunuz */}
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
```

### 2. Auth Hook Kullan

```tsx
import { useAuth } from './contexts/AuthContext';

function HomePage() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <View>
      <Text>Hoşgeldin, {profile?.username}!</Text>
      <Text>Kredin: {profile?.credits}</Text>
    </View>
  );
}
```

### 3. Servis Kullanımı

```tsx
import { questionsService } from '@/services';

async function loadQuestions() {
  const { data, error } = await questionsService.getActiveQuestions();
  
  if (error) {
    console.error('Error:', error);
    return;
  }

  setQuestions(data);
}
```

---

## Örnek Kullanım

### Login/Signup

```tsx
import { useAuth } from './contexts/AuthContext';

function LoginScreen() {
  const { signIn, signUp } = useAuth();

  const handleLogin = async () => {
    const { error } = await signIn(email, password);
    if (error) {
      Alert.alert('Hata', error.message);
    }
  };

  const handleSignup = async () => {
    const { error } = await signUp(email, password, username);
    if (error) {
      Alert.alert('Hata', error.message);
    }
  };
}
```

### Sorular Listesi

```tsx
import { questionsService } from '@/services';

function QuestionsPage() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const { data, error } = await questionsService.getTrendingQuestions();
    if (!error && data) {
      setQuestions(data);
    }
  };

  return (
    <FlatList
      data={questions}
      renderItem={({ item }) => <QuestionCard question={item} />}
    />
  );
}
```

### Tahmin Yapma

```tsx
import { predictionsService } from '@/services';

async function makePrediction(questionId, vote, odds, amount) {
  const { data, error } = await predictionsService.createPrediction({
    question_id: questionId,
    vote: vote,
    odds: odds,
    amount: amount,
  });

  if (error) {
    Alert.alert('Hata', 'Tahmin oluşturulamadı');
    return;
  }

  Alert.alert('Başarılı', 'Tahmin oluşturuldu!');
}
```

### Kupon Oluşturma

```tsx
import { couponsService } from '@/services';

async function createCoupon(selections, stakeAmount) {
  const { data, error } = await couponsService.createCoupon({
    selections: selections.map(s => ({
      question_id: s.questionId,
      vote: s.vote,
      odds: s.odds,
      is_boosted: s.boosted,
    })),
    stake_amount: stakeAmount,
  });

  if (error) {
    Alert.alert('Hata', 'Kupon oluşturulamadı');
    return;
  }

  Alert.alert('Başarılı', `Kupon kodu: ${data.coupon_code}`);
}
```

---

## Real-time Özellikler

### Soru Güncellemelerini Dinle

```tsx
import { questionsService } from '@/services';
import { useEffect } from 'react';

function QuestionDetail({ questionId }) {
  useEffect(() => {
    const channel = questionsService.subscribeToQuestion(
      questionId,
      (payload) => {
        console.log('Question updated:', payload);
        // State'i güncelle
      }
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [questionId]);
}
```

### Bildirimleri Dinle

```tsx
import { notificationsService } from '@/services';

function NotificationsListener() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = notificationsService.subscribeToNotifications(
      user.id,
      (payload) => {
        console.log('New notification:', payload.new);
        // Bildirim göster
      }
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
}
```

---

## Hata Ayıklama

### Yaygın Hatalar

1. **"Invalid API key"**
   - `.env.local` dosyasını kontrol edin
   - Uygulama yeniden başlatın: `npx expo start -c`

2. **"Row Level Security policy violation"**
   - RLS politikalarını kontrol edin
   - Kullanıcı giriş yapmış mı?

3. **"Function not found"**
   - Database function'larını oluşturun
   - Migration dosyalarını kontrol edin

### Debug Modu

```tsx
// Supabase client'a debug ekle
import { supabase } from '@/lib/supabase';

// Tüm query'leri logla
supabase.channel('debug')
  .on('*', (payload) => {
    console.log('Supabase event:', payload);
  })
  .subscribe();
```

---

## Sonraki Adımlar

### Component Entegrasyonu

Her sayfayı sırayla backend'e bağlayın:

1. ✅ **HomePage** → `questionsService.getTrendingQuestions()`
2. ✅ **ProfilePage** → `profileService.getProfile()`
3. ✅ **CouponsPage** → `couponsService.getUserCoupons()`
4. ✅ **LeaguePage** → `leaguesService.getUserLeagues()`
5. ✅ **TasksPage** → `tasksService.getUserTasks()`
6. ✅ **NotificationsPage** → `notificationsService.getUserNotifications()`
7. ✅ **MarketPage** → `marketService.getMarketItems()`

### İyileştirmeler

- [ ] Loading states ekle
- [ ] Error handling geliştir
- [ ] Offline support (React Query/SWR)
- [ ] Image optimization
- [ ] Push notifications
- [ ] Analytics entegrasyonu

---

## 📞 Yardım

Sorun yaşarsanız:
1. `SUPABASE_SETUP.md` dosyasını inceleyin
2. Supabase Dashboard > Logs bölümünü kontrol edin
3. Console logları kontrol edin

**Hazırsınız! 🚀**




