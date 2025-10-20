# QuestionDetailPage Component

## 📱 Component Özeti

`QuestionDetailPage`, Figma tasarımından React Native'e tam olarak dönüştürülmüş, profesyonel ve kullanıcı dostu bir soru detay sayfası komponentidir.

## ✨ Özellikler

### 1. 🖼️ Sticky Header Image
- Tam ekran header görsel
- Gradient overlay efekti
- Sticky positioning ile scroll sırasında görünür kalır
- Kategori badge'i (sağ alt köşede)

### 2. 🔄 Navigation
- **Geri Butonu**: Ana sayfaya/önceki sayfaya dönüş
- **Paylaş Butonu**: Native share API ile paylaşım
- **Favori Butonu**: Soruyu favorilere ekleme/çıkarma
- Tüm butonlar glassmorphism efektli

### 3. ⏱️ Countdown Timer
- Gerçek zamanlı geri sayım
- Gün, saat, dakika gösterimi
- Pulse animasyonu
- Gradient arkaplan
- Otomatik güncelleme (her dakika)

### 4. 📑 Tab Sistemi
3 farklı tab ile içerik organizasyonu:

#### 📝 Soru Detay Tab
- **Tam Açıklama**: Sorunun detaylı açıklaması
- **Soru Sahibi Kartı**: 
  - Avatar
  - Kullanıcı adı
  - Takip et butonu
- **Oy Dağılımı**:
  - EVET/HAYIR yüzdeleri
  - Animasyonlu progress bar'lar
  - Oran bilgisi
  - Toplam yatırım miktarı
- **Oy Verme Butonları**:
  - Gradient arkaplanda EVET/HAYIR
  - Shadow efektli
  - Odds bilgisi
- **Benzer Sorular**:
  - Horizontal scroll
  - Görsel kartlar
  - Rating ve oy sayısı
  - Favori butonu

#### 💬 Yorumlar Tab
- **Yorum Yazma Alanı**:
  - Multi-line text input
  - Avatar gösterimi
  - Gönder butonu (gradient)
  - Devre dışı kalma özelliği (boş ise)
- **Yorum Listesi**:
  - Kullanıcı avatarı
  - Kullanıcı adı
  - Zaman gösterimi (relatif)
  - Yorum metni
  - Beğeni sayısı
  - Yanıtla butonu

#### 📊 İstatistikler Tab
- **Toplam Ödül Havuzu Kartı**:
  - Gradient arkaplan
  - Animated icon
  - Büyük font ile tutar
  - EVET/HAYIR yatırım ayrımı
- **Oran Değişimi Grafiği**:
  - Line chart (react-native-chart-kit)
  - EVET ve HAYIR çizgileri
  - Zaman bazlı değişim
  - Legend ile renk açıklaması
  - Açıklama metni
- **En Çok Yatırım Yapanlar**:
  - Top 4 investor
  - Sıralama badge'leri (altın, gümüş, bronz)
  - Avatar
  - Yatırım tutarı
  - EVET/HAYIR badge'i
- **Oy Dağılımı Özeti**:
  - Yüzde gösterimi
  - Tutar gösterimi
  - Renkli kartlar

### 5. 🎨 Animasyonlar
- **Pulse Animation**: Countdown timer
- **Progress Bar Animation**: Oy dağılımı
- **Fade In/Out**: Tab geçişleri
- **Scale Animation**: Buton tıklamaları
- **Smooth Scroll**: ScrollView

### 6. 📐 Responsive Tasarım
- Ekran genişliğine göre uyarlanan layout
- SafeAreaView ile güvenli alanlar
- Platform-specific shadow/elevation
- Dimensions API kullanımı

## 🎯 Kullanım Senaryoları

### Senaryo 1: Ana Sayfadan Soru Detayına Geçiş
```typescript
// NewHomePage.tsx içinde
<TouchableOpacity onPress={() => handleQuestionDetail(question.id)}>
  <QuestionCard {...question} />
</TouchableOpacity>

// App.tsx içinde
const handleQuestionDetail = (questionId: number) => {
  setSelectedQuestionId(questionId);
  setCurrentPage('questionDetail');
};
```

### Senaryo 2: Keşfet Sayfasından Geçiş
```typescript
// AlternativeSearchPage.tsx içinde
<QuestionItem 
  question={question}
  onPress={() => navigation.navigate('QuestionDetail', { questionId: question.id })}
/>
```

### Senaryo 3: Bildirimlerden Geçiş
```typescript
// NotificationsPage.tsx içinde
<NotificationItem 
  notification={notification}
  onPress={() => {
    if (notification.type === 'question_result') {
      handleQuestionDetail(notification.questionId);
    }
  }}
/>
```

## 🔧 Özelleştirme Örnekleri

### Tema Renkleri Değiştirme

```typescript
// Styles içinde renkleri değiştirin
const customStyles = StyleSheet.create({
  ...styles,
  countdownGradient: {
    ...styles.countdownGradient,
    // Kendi gradient renkleriniz
  }
});
```

### Farklı Grafik Tipi Kullanma

```typescript
// LineChart yerine BarChart
import { BarChart } from 'react-native-chart-kit';

<BarChart
  data={oddsChartData}
  width={SCREEN_WIDTH - 64}
  height={250}
  chartConfig={chartConfig}
/>
```

### Timer Format Değiştirme

```typescript
// Component içinde
const formatTimer = () => {
  if (timeLeft.days > 0) {
    return `${timeLeft.days} gün ${timeLeft.hours} saat`;
  }
  return `${timeLeft.hours}:${timeLeft.minutes.toString().padStart(2, '0')}`;
};
```

## 📊 State Yönetimi

Component içinde yönetilen state'ler:

```typescript
const [isFavorite, setIsFavorite] = useState(false);          // Favori durumu
const [activeTab, setActiveTab] = useState('details');        // Aktif tab
const [commentText, setCommentText] = useState('');           // Yorum metni
const [timeLeft, setTimeLeft] = useState({...});              // Geri sayım
const [comments, setComments] = useState([]);                 // Yorumlar
const [relatedQuestions, setRelatedQuestions] = useState([]); // Benzer sorular
```

## 🚀 Performans Optimizasyonları

### Uygulanmış Optimizasyonlar
1. ✅ `useNativeDriver: true` (animasyonlar için)
2. ✅ `Animated.Value` kullanımı
3. ✅ `scrollEventThrottle={16}` (scroll performansı)
4. ✅ `numberOfLines` prop'u (metin kırpma)
5. ✅ Conditional rendering (tab içerikleri)

### Önerilebilecek İyileştirmeler
```typescript
// 1. Image caching
import FastImage from 'react-native-fast-image';

// 2. Memo kullanımı
const CommentCard = React.memo(({ comment }) => {
  // ...
});

// 3. useCallback
const handleLikeComment = useCallback((commentId) => {
  // ...
}, []);

// 4. FlatList (çok fazla yorum varsa)
<FlatList
  data={comments}
  renderItem={({ item }) => <CommentCard comment={item} />}
  keyExtractor={item => item.id.toString()}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

## 🎨 Design System

### Typography
- **Title**: 24px, fontWeight: '900'
- **Subtitle**: 18px, fontWeight: '900'
- **Body**: 14-16px, fontWeight: '400'
- **Caption**: 12px, fontWeight: '700'

### Spacing
- **Padding**: 16, 20, 24px
- **Gap**: 8, 12, 16px
- **Border Radius**: 12, 16, 20, 24px

### Colors
```typescript
{
  primary: '#432870',
  secondary: '#B29EFD',
  accent: '#C9F158',
  success: '#34C759',
  error: '#FF3B30',
  background: '#F2F3F5',
  text: '#202020',
  textSecondary: '#202020CC',
  textTertiary: '#20202099',
}
```

## 📱 Platform Farklılıkları

### iOS
- `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` kullanılır
- SafeAreaView varsayılan olarak çalışır
- Haptic feedback eklenebilir

### Android
- `elevation` kullanılır
- StatusBar yönetimi farklı
- Ripple effect eklenebilir

```typescript
// Platform-specific styling örneği
...Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  android: {
    elevation: 8,
  },
}),
```

## 🧪 Test Edilmesi Gereken Durumlar

### Fonksiyonel Testler
- [ ] Geri butonu doğru sayfaya yönlendiriyor
- [ ] Paylaşım butonu native share'i açıyor
- [ ] Favori butonu state'i değiştiriyor
- [ ] Tab geçişleri çalışıyor
- [ ] Yorum gönderme çalışıyor
- [ ] Oy verme butonları callback'i tetikliyor
- [ ] Benzer sorulara tıklama çalışıyor
- [ ] Countdown timer güncelleniyor

### UI/UX Testler
- [ ] Tüm animasyonlar smooth
- [ ] Scroll performansı iyi
- [ ] Resimlerin yüklenme durumları
- [ ] Loading state'leri
- [ ] Error state'leri
- [ ] Empty state'ler (yorum yoksa)

### Edge Case'ler
- [ ] Çok uzun soru başlığı
- [ ] Çok fazla yorum
- [ ] Internet bağlantısı yok
- [ ] Süresi dolmuş soru
- [ ] Resim yüklenemezse

## 🐛 Bilinen Sınırlamalar

1. **Mock Data**: Şu anda component içinde mock data kullanılıyor. API entegrasyonu gerekli.
2. **Yorum Pagination**: Tüm yorumlar tek seferde yükleniyor. Pagination eklenebilir.
3. **Real-time Updates**: WebSocket ile canlı güncellemeler yok.
4. **Image Optimization**: Resimler optimize edilmiyor, caching yok.

## 🔮 Gelecek Geliştirmeler

- [ ] WebSocket ile real-time oy güncellemeleri
- [ ] Pull-to-refresh
- [ ] Infinite scroll (yorumlar için)
- [ ] Deep linking support
- [ ] Analytics integration
- [ ] Error boundary
- [ ] Skeleton loading
- [ ] Image zoom
- [ ] Video support
- [ ] Share screenshot özelliği

## 📚 Kaynaklar

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)
- [Victory Native](https://formidable.com/open-source/victory/docs/native/)

---

**Component Version**: 1.0.0  
**Last Updated**: Aralık 2024  
**Author**: Sence Development Team  
**Status**: ✅ Production Ready

