# Component'leri Backend'e Bağlama - Detaylı Örnekler

## 🎯 Genel Prensip

Her component için aynı 5 adımı takip edin:

1. ✅ Mock data'yı kaldır
2. ✅ Servisleri import et
3. ✅ Loading & error state ekle
4. ✅ Veri yükleme fonksiyonu yaz
5. ✅ useEffect'te çağır

---

## 📱 Örnek 1: HomePage - Trending Questions

### Önce (Mock Data ile):

```tsx
// app/SenceFinal/components/HomePage/index.tsx
import React, { useState } from 'react';

export function HomePage() {
  // Mock data
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "Tesla 2024'te $300'ı aşacak mı?",
      yesOdds: 2.4,
      noOdds: 1.6,
      // ...
    },
    {
      id: 2,
      title: "Bitcoin 100k olacak mı?",
      yesOdds: 3.2,
      noOdds: 1.3,
      // ...
    }
  ]);

  return (
    <View>
      {questions.map(q => <QuestionCard key={q.id} question={q} />)}
    </View>
  );
}
```

### Sonra (Backend ile):

```tsx
// app/SenceFinal/components/HomePage/index.tsx
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { questionsService } from '@/services';

export function HomePage() {
  // State tanımlamaları
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Veri yükleme fonksiyonu
  const loadQuestions = async () => {
    try {
      setLoading(true);
      
      // Backend'den veri çek
      const { data, error } = await questionsService.getTrendingQuestions();
      
      if (error) {
        throw new Error(error.message);
      }

      // State'i güncelle
      setQuestions(data || []);
      setError(null);
      
    } catch (err) {
      console.error('Questions load error:', err);
      setError(err.message);
      Alert.alert('Hata', 'Sorular yüklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde veriyi çek
  useEffect(() => {
    loadQuestions();
  }, []);

  // Pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadQuestions();
    setRefreshing(false);
  };

  // Loading durumu
  if (loading && questions.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <QuestionCard question={item} onVote={handleVote} />
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
}
```

---

## 👤 Örnek 2: ProfilePage - Kullanıcı Profili

```tsx
// app/SenceFinal/components/ProfilePage/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/app/SenceFinal/contexts/AuthContext';
import { profileService, predictionsService } from '@/services';

export function ProfilePage() {
  const { user, profile } = useAuth(); // Auth context'ten kullanıcı bilgisi
  
  const [stats, setStats] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profil verilerini yükle
  const loadProfileData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Paralel olarak tüm verileri yükle
      const [statsResult, predictionsResult] = await Promise.all([
        profileService.getUserStats(user.id),
        predictionsService.getUserPredictions(user.id),
      ]);

      if (statsResult.error) throw statsResult.error;
      if (predictionsResult.error) throw predictionsResult.error;

      setStats(statsResult.data);
      setPredictions(predictionsResult.data || []);
      
    } catch (err) {
      console.error('Profile data load error:', err);
      Alert.alert('Hata', 'Profil verileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [user]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      {/* Profil Bilgileri */}
      <View>
        <Text>{profile?.username}</Text>
        <Text>{profile?.credits} Kredi</Text>
      </View>

      {/* İstatistikler */}
      <View>
        <Text>Toplam Tahmin: {stats?.total_predictions || 0}</Text>
        <Text>Doğru Tahmin: {stats?.correct_predictions || 0}</Text>
        <Text>Başarı Oranı: %{stats?.accuracy_rate || 0}</Text>
      </View>

      {/* Tahminler */}
      <FlatList
        data={predictions}
        renderItem={({ item }) => <PredictionCard prediction={item} />}
      />
    </View>
  );
}
```

---

## 🎫 Örnek 3: CouponsPage - Kupon Listesi

```tsx
// app/SenceFinal/components/CouponsPage/index.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/app/SenceFinal/contexts/AuthContext';
import { couponsService } from '@/services';

export function CouponsPage() {
  const { user } = useAuth();
  
  const [activeCoupons, setActiveCoupons] = useState([]);
  const [completedCoupons, setCompletedCoupons] = useState([]);
  const [selectedTab, setSelectedTab] = useState('active'); // 'active' | 'completed'
  const [loading, setLoading] = useState(true);

  // Kuponları yükle
  const loadCoupons = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Tüm kuponları al
      const { data, error } = await couponsService.getUserCoupons(user.id);

      if (error) throw error;

      // Aktif ve tamamlanmış olarak ayır
      const active = data?.filter(c => c.status === 'pending') || [];
      const completed = data?.filter(c => c.status !== 'pending') || [];

      setActiveCoupons(active);
      setCompletedCoupons(completed);
      
    } catch (err) {
      console.error('Coupons load error:', err);
      Alert.alert('Hata', 'Kuponlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, [user]);

  const displayedCoupons = selectedTab === 'active' ? activeCoupons : completedCoupons;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View>
      {/* Tab Selector */}
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => setSelectedTab('active')}>
          <Text>Aktif ({activeCoupons.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('completed')}>
          <Text>Tamamlanan ({completedCoupons.length})</Text>
        </TouchableOpacity>
      </View>

      {/* Kupon Listesi */}
      <FlatList
        data={displayedCoupons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CouponCard coupon={item} />}
        ListEmptyComponent={<EmptyState />}
      />
    </View>
  );
}
```

---

## 👥 Örnek 4: LeaguePage - Lig Sistemi

```tsx
// app/SenceFinal/components/LeaguePage/index.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/app/SenceFinal/contexts/AuthContext';
import { leaguesService } from '@/services';

export function LeaguePage() {
  const { user } = useAuth();
  
  const [myLeagues, setMyLeagues] = useState([]);
  const [publicLeagues, setPublicLeagues] = useState([]);
  const [currentTab, setCurrentTab] = useState('my'); // 'my' | 'discover'
  const [loading, setLoading] = useState(true);

  // Ligleri yükle
  const loadLeagues = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const [myLeaguesResult, publicLeaguesResult] = await Promise.all([
        leaguesService.getUserLeagues(user.id),
        leaguesService.getPublicLeagues(),
      ]);

      if (myLeaguesResult.error) throw myLeaguesResult.error;
      if (publicLeaguesResult.error) throw publicLeaguesResult.error;

      setMyLeagues(myLeaguesResult.data || []);
      setPublicLeagues(publicLeaguesResult.data || []);
      
    } catch (err) {
      console.error('Leagues load error:', err);
      Alert.alert('Hata', 'Ligler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Lige katıl
  const handleJoinLeague = async (leagueId: string) => {
    try {
      const { error } = await leaguesService.joinLeague(leagueId);

      if (error) {
        Alert.alert('Hata', error.message);
        return;
      }

      Alert.alert('Başarılı', 'Lige katıldınız!');
      
      // Ligleri yeniden yükle
      await loadLeagues();
      
    } catch (err) {
      console.error('Join league error:', err);
      Alert.alert('Hata', 'Lige katılınamadı');
    }
  };

  useEffect(() => {
    loadLeagues();
  }, [user]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  const displayedLeagues = currentTab === 'my' ? myLeagues : publicLeagues;

  return (
    <View>
      <FlatList
        data={displayedLeagues}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LeagueCard 
            league={item} 
            onJoin={() => handleJoinLeague(item.id)}
          />
        )}
      />
    </View>
  );
}
```

---

## ✅ Örnek 5: TasksPage - Görevler

```tsx
// app/SenceFinal/components/TasksPage/index.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/app/SenceFinal/contexts/AuthContext';
import { tasksService } from '@/services';

export function TasksPage() {
  const { user, refreshProfile } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(null); // Ödül talep edilen task ID

  // Görevleri yükle
  const loadTasks = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Kullanıcı için eksik görevleri oluştur
      await tasksService.initializeUserTasks(user.id);

      // Görevleri getir
      const { data, error } = await tasksService.getUserTasks(user.id);

      if (error) throw error;

      setTasks(data || []);
      
    } catch (err) {
      console.error('Tasks load error:', err);
      Alert.alert('Hata', 'Görevler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Ödül talep et
  const handleClaimReward = async (taskId: string) => {
    try {
      setClaiming(taskId);

      const { error } = await tasksService.claimTaskReward(user.id, taskId);

      if (error) {
        Alert.alert('Hata', error.message);
        return;
      }

      Alert.alert('Tebrikler!', 'Ödülünüz hesabınıza eklendi! 🎉');
      
      // Görevleri ve profili yeniden yükle
      await loadTasks();
      await refreshProfile();
      
    } catch (err) {
      console.error('Claim reward error:', err);
      Alert.alert('Hata', 'Ödül alınamadı');
    } finally {
      setClaiming(null);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard 
            task={item} 
            onClaim={() => handleClaimReward(item.task_id)}
            claiming={claiming === item.task_id}
          />
        )}
      />
    </View>
  );
}
```

---

## 🔔 Örnek 6: NotificationsPage - Bildirimler

```tsx
// app/SenceFinal/components/NotificationsPage/index.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '@/app/SenceFinal/contexts/AuthContext';
import { notificationsService } from '@/services';
import { supabase } from '@/lib/supabase';

export function NotificationsPage() {
  const { user } = useAuth();
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Bildirimleri yükle
  const loadNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const [notificationsResult, countResult] = await Promise.all([
        notificationsService.getUserNotifications(user.id),
        notificationsService.getUnreadCount(user.id),
      ]);

      if (notificationsResult.error) throw notificationsResult.error;

      setNotifications(notificationsResult.data || []);
      setUnreadCount(countResult.count || 0);
      
    } catch (err) {
      console.error('Notifications load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Bildirimi okundu işaretle
  const handleMarkAsRead = async (notificationId: string) => {
    await notificationsService.markAsRead(notificationId);
    await loadNotifications(); // Yeniden yükle
  };

  // Tümünü okundu işaretle
  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    await notificationsService.markAllAsRead(user.id);
    await loadNotifications();
  };

  // Real-time bildirimler
  useEffect(() => {
    if (!user) return;

    const channel = notificationsService.subscribeToNotifications(
      user.id,
      (payload) => {
        console.log('New notification:', payload.new);
        // Yeni bildirim geldiğinde listeyi güncelle
        loadNotifications();
      }
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    loadNotifications();
  }, [user]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
        <Text>{unreadCount} okunmamış</Text>
        <TouchableOpacity onPress={handleMarkAllAsRead}>
          <Text>Tümünü okundu işaretle</Text>
        </TouchableOpacity>
      </View>

      {/* Bildirim Listesi */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationCard 
            notification={item}
            onPress={() => handleMarkAsRead(item.id)}
          />
        )}
      />
    </View>
  );
}
```

---

## 🛒 Örnek 7: MarketPage - Market

```tsx
// app/SenceFinal/components/MarketPage/index.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/app/SenceFinal/contexts/AuthContext';
import { marketService } from '@/services';

export function MarketPage() {
  const { user, profile, refreshProfile } = useAuth();
  
  const [items, setItems] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);

  // Market ürünlerini yükle
  const loadMarketData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const [itemsResult, purchasesResult] = await Promise.all([
        marketService.getMarketItems(),
        marketService.getUserPurchases(user.id),
      ]);

      if (itemsResult.error) throw itemsResult.error;
      if (purchasesResult.error) throw purchasesResult.error;

      setItems(itemsResult.data || []);
      setPurchases(purchasesResult.data || []);
      
    } catch (err) {
      console.error('Market data load error:', err);
      Alert.alert('Hata', 'Market verileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Ürün satın al
  const handlePurchase = async (itemId: string, price: number) => {
    // Kredi kontrolü
    if (!profile || profile.credits < price) {
      Alert.alert('Yetersiz Kredi', 'Yeterli krediniz yok');
      return;
    }

    Alert.alert(
      'Satın Al',
      `Bu ürünü ${price} krediye satın almak istiyor musunuz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Satın Al',
          onPress: async () => {
            try {
              setPurchasing(itemId);

              const { data, error } = await marketService.purchaseItem(itemId, 1);

              if (error) {
                Alert.alert('Hata', error.message);
                return;
              }

              Alert.alert('Başarılı', 'Ürün satın alındı! 🎉');
              
              // Verileri yeniden yükle
              await loadMarketData();
              await refreshProfile(); // Kredi güncellemesi için
              
            } catch (err) {
              console.error('Purchase error:', err);
              Alert.alert('Hata', 'Satın alma başarısız');
            } finally {
              setPurchasing(null);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadMarketData();
  }, [user]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      {/* Kredi Göstergesi */}
      <View style={{ padding: 16 }}>
        <Text>Kredin: {profile?.credits || 0} 💰</Text>
      </View>

      {/* Ürün Listesi */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MarketItemCard 
            item={item}
            onPurchase={() => handlePurchase(item.id, item.price)}
            purchasing={purchasing === item.id}
          />
        )}
      />
    </View>
  );
}
```

---

## 📝 Örnek 8: QuestionDetailPage - Tahmin Yapma

```tsx
// app/SenceFinal/components/QuestionDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/app/SenceFinal/contexts/AuthContext';
import { questionsService, predictionsService } from '@/services';
import { supabase } from '@/lib/supabase';

interface Props {
  questionId: string;
  onBack: () => void;
}

export function QuestionDetailPage({ questionId, onBack }: Props) {
  const { user } = useAuth();
  
  const [question, setQuestion] = useState(null);
  const [userPrediction, setUserPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  // Soru detayını yükle
  const loadQuestion = async () => {
    try {
      setLoading(true);

      const [questionResult, predictionResult] = await Promise.all([
        questionsService.getQuestionById(questionId),
        user ? predictionsService.checkUserPrediction(user.id, questionId) : { data: null },
      ]);

      if (questionResult.error) throw questionResult.error;

      setQuestion(questionResult.data);
      setUserPrediction(predictionResult.data);
      
    } catch (err) {
      console.error('Question load error:', err);
      Alert.alert('Hata', 'Soru yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Tahmin yap
  const handleVote = async (vote: 'yes' | 'no', odds: number, amount: number) => {
    if (!user) {
      Alert.alert('Giriş Gerekli', 'Tahmin yapmak için giriş yapmalısınız');
      return;
    }

    try {
      setVoting(true);

      const { data, error } = await predictionsService.createPrediction({
        question_id: questionId,
        vote: vote,
        odds: odds,
        amount: amount,
      });

      if (error) {
        Alert.alert('Hata', error.message);
        return;
      }

      Alert.alert('Başarılı', 'Tahmin oluşturuldu! 🎯');
      
      // Soruyu yeniden yükle
      await loadQuestion();
      
    } catch (err) {
      console.error('Vote error:', err);
      Alert.alert('Hata', 'Tahmin oluşturulamadı');
    } finally {
      setVoting(false);
    }
  };

  // Real-time soru güncellemeleri
  useEffect(() => {
    const channel = questionsService.subscribeToQuestion(
      questionId,
      (payload) => {
        console.log('Question updated:', payload);
        loadQuestion(); // Soruyu yeniden yükle
      }
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [questionId]);

  useEffect(() => {
    loadQuestion();
  }, [questionId, user]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!question) {
    return <Text>Soru bulunamadı</Text>;
  }

  return (
    <View>
      {/* Soru Detayları */}
      <Text>{question.title}</Text>
      <Text>{question.description}</Text>

      {/* Oran Göstergesi */}
      <View>
        <Text>Evet: {question.yes_odds}x ({question.yes_percentage}%)</Text>
        <Text>Hayır: {question.no_odds}x ({question.no_percentage}%)</Text>
      </View>

      {/* Tahmin Durumu */}
      {userPrediction ? (
        <View>
          <Text>Tahmin Yaptınız: {userPrediction.vote === 'yes' ? 'EVET' : 'HAYIR'}</Text>
          <Text>Miktar: {userPrediction.amount} kredi</Text>
          <Text>Potansiyel Kazanç: {userPrediction.potential_win} kredi</Text>
        </View>
      ) : (
        <View>
          <Button 
            title={`EVET (${question.yes_odds}x)`}
            onPress={() => handleVote('yes', question.yes_odds, 1000)}
            disabled={voting}
          />
          <Button 
            title={`HAYIR (${question.no_odds}x)`}
            onPress={() => handleVote('no', question.no_odds, 1000)}
            disabled={voting}
          />
        </View>
      )}
    </View>
  );
}
```

---

## 🎯 Entegrasyon Checklist

Her component için bu adımları takip edin:

### Başlamadan Önce:
- [ ] `.env.local` dosyası dolduruldu
- [ ] SQL migration'ları çalıştırıldı
- [ ] Supabase çalışıyor

### Component Başına:
- [ ] Mock data kaldırıldı
- [ ] Servis import edildi
- [ ] Loading state eklendi
- [ ] Error handling eklendi
- [ ] useEffect eklendi
- [ ] Pull-to-refresh eklendi (opsiyonel)
- [ ] Real-time subscription eklendi (opsiyonel)

### Test:
- [ ] Sayfa açılıyor mu?
- [ ] Veriler yükleniyor mu?
- [ ] Loading animasyonu çalışıyor mu?
- [ ] Hata durumları kontrol edildi mi?
- [ ] Kullanıcı aksiyonları çalışıyor mu?

---

## 💡 Best Practices

### 1. **Error Handling**
```tsx
try {
  // API call
} catch (err) {
  console.error('Error:', err);
  Alert.alert('Hata', 'İşlem başarısız');
}
```

### 2. **Loading States**
```tsx
if (loading && data.length === 0) {
  return <ActivityIndicator />;
}
```

### 3. **Empty States**
```tsx
<FlatList
  data={items}
  ListEmptyComponent={<EmptyState message="Henüz veri yok" />}
/>
```

### 4. **Pull to Refresh**
```tsx
<FlatList
  refreshing={refreshing}
  onRefresh={handleRefresh}
/>
```

### 5. **Optimistic UI Updates**
```tsx
// Önce UI'ı güncelle
setItems([...items, newItem]);

// Sonra backend'e gönder
await api.create(newItem);
```

---

## 🚀 Hızlı Başlangıç

1. **HomePage'den başlayın** (en basit)
2. **ProfilePage** (Auth context kullanımı)
3. **CouponsPage** (filtreleme)
4. **Diğer sayfalar**

Her sayfa için:
```bash
# Test et
npx expo start

# Hata varsa logları kontrol et
# Supabase Dashboard > Logs
```

Başarılar! 🎉




