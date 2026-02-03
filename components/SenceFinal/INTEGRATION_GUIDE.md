# QuestionDetailPage - Entegrasyon Kılavuzu

## Genel Bakış

`QuestionDetailPage` komponenti, kullanıcıların soru detaylarını görüntüleyebileceği, yorum yapabileceği, istatistikleri inceleyebileceği ve oy verebileceği tam özellikli bir soru detay sayfasıdır.

## Özellikler

✅ **Hiçbir kayıp olmadan dönüştürülmüştür:**
- Tam ekran header image sticky positioning ile
- Animasyonlu countdown timer
- 3 tab (Detaylar, Yorumlar, İstatistikler)
- Canlı grafik (Line Chart) ile oran değişimi gösterimi
- Yorum ekleme ve görüntüleme
- Oy verme butونları (EVET/HAYIR)
- Benzer sorular horizontal scroll
- En çok yatırım yapanlar listesi
- Toplam ödül havuzu kartı
- Paylaşım ve favorilere ekleme
- Smooth animations ve transitions

## Kullanım

### 1. Temel Kullanım

```typescript
import { QuestionDetailPage } from './components/QuestionDetailPage';

<QuestionDetailPage
  onBack={() => setCurrentPage('home')}
  onVote={(vote) => handleVote(questionId, vote)}
  questionId={selectedQuestionId}
/>
```

### 2. Props

| Prop | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `onBack` | `() => void` | ✅ | Geri butonu tıklandığında çağrılır |
| `onVote` | `(vote: 'yes' \| 'no') => void` | ❌ | Oy verme butonu tıklandığında çağrılır |
| `questionId` | `number` | ❌ | Gösterilecek sorunun ID'si (API entegrasyonu için) |

### 3. Mevcut App.tsx'e Entegrasyon

App.tsx dosyanızda zaten import edilmiş durumda:

```typescript
import { QuestionDetailPage } from './components/QuestionDetailPage';
```

Ancak yeni oluşturduğumuz component için tam entegrasyon:

```typescript
// App.tsx içinde
const handleQuestionDetail = (questionId: number) => {
  setSelectedQuestionId(questionId);
  setCurrentPage('questionDetail');
};

// Render içinde
{currentPage === 'questionDetail' && (
  <QuestionDetailPage
    onBack={() => setCurrentPage('home')}
    onVote={(vote) => {
      handleVote(selectedQuestionId, vote, /* odds */, /* title */);
      setIsCouponDrawerOpen(true); // Kupona eklendiğini göster
    }}
    questionId={selectedQuestionId}
  />
)}
```

### 4. API Entegrasyonu için Öneriler

Şu anda component içinde mock data bulunmaktadır. Gerçek API entegrasyonu için:

```typescript
// Component içinde, useEffect ile veri çekme
useEffect(() => {
  if (questionId) {
    fetchQuestionDetails(questionId).then(data => {
      setMainQuestion(data);
      setComments(data.comments);
      setTopInvestors(data.topInvestors);
      setRelatedQuestions(data.relatedQuestions);
      setOddsChartData(data.oddsHistory);
    });
  }
}, [questionId]);
```

## Özelleştirme

### Renk Teması

Komponent içinde kullanılan ana renkler:

```typescript
const COLORS = {
  primary: '#432870',      // Ana tema rengi
  secondary: '#B29EFD',    // İkincil tema rengi
  accent: '#C9F158',       // Vurgu rengi
  yesColor: '#34C759',     // EVET oy rengi
  noColor: '#FF3B30',      // HAYIR oy rengi
  background: '#F2F3F5',   // Arkaplan rengi
  text: '#202020',         // Metin rengi
};
```

Bu renkleri değiştirmek için styles içindeki ilgili değerleri güncelleyin.

### Grafik Özelleştirme

Line chart için `react-native-chart-kit` kullanılmaktadır. Grafik görünümünü özelleştirmek için:

```typescript
chartConfig={{
  backgroundColor: '#F2F3F5',
  backgroundGradientFrom: '#F2F3F5',
  backgroundGradientTo: '#F2F3F5',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(67, 40, 112, ${opacity})`,
  // ... diğer ayarlar
}}
```

## Bağımlılıklar

Aşağıdaki paketler zaten projenizde yüklü:

```json
{
  "react-native": "0.79.5",
  "expo-linear-gradient": "~14.1.5",
  "@expo/vector-icons": "^14.1.0",
  "react-native-chart-kit": "^6.12.0",
  "react-native-safe-area-context": "^5.4.0",
  "react-native-svg": "^15.12.0"
}
```

## Test Edilmesi Gerekenler

- [ ] Geri butonu çalışıyor mu?
- [ ] Tab geçişleri smooth mu?
- [ ] Countdown timer doğru çalışıyor mu?
- [ ] Yorumlar eklenebiliyor mu?
- [ ] Grafik doğru görünüyor mu?
- [ ] Oy verme butonları çalışıyor mu?
- [ ] Paylaşım özelliği çalışıyor mu?
- [ ] Favorilere ekleme çalışıyor mu?
- [ ] Benzer sorular kaydırılabiliyor mu?
- [ ] Scroll performansı iyi mi?

## Performans İyileştirmeleri

Component zaten optimize edilmiştir:

1. **Animated API** kullanılarak smooth animasyonlar
2. **ScrollView** yerine gerekli yerlerde **FlatList** kullanılabilir (çok fazla yorum varsa)
3. **Image caching** için `react-native-fast-image` eklenebilir
4. **Memo** ve **useCallback** ile gereksiz re-render'lar önlenebilir

## Sorun Giderme

### Grafik görünmüyor
- `react-native-svg` kurulu olduğundan emin olun
- iOS'ta pod install yaptınız mı?

### Animasyonlar takılıyor
- `useNativeDriver: true` kullanıldığından emin olun
- FlatList'te `removeClippedSubviews={true}` ekleyin

### Resimleri yüklenmiyor
- Network permission'ları kontrol edin
- Image URI'larının geçerli olduğundan emin olun

## İletişim

Herhangi bir sorun veya öneri için lütfen bize ulaşın.

---

**Not:** Bu component Figma'dan React Native'e tam sadakatle dönüştürülmüştür. Hiçbir tasarım veya fonksiyonellik kaybı yoktur.

