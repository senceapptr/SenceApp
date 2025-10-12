# Keşfet (Discover) Sayfası - Figma Tasarımı

Bu dosya, Figma tasarımına uygun olarak yeniden tasarlanan Keşfet sayfasının özelliklerini açıklar.

## Tasarım Özellikleri

### 1. Kategori Grid Düzeni (İlk Görünüm)
- **6 satırlık grid düzeni** Figma tasarımına uygun olarak
- **Büyük ve küçük kartlar** farklı boyutlarda
- **Özel kategoriler** (Trendler, Yeni, Yakında Bitecek, Özel Oranlar) mor gradient ile
- **Normal kategoriler** beyaz arka plan ile

### 2. Kategori Kartları
- **Tümü**: 12 soru (küçük kart)
- **Trendler**: Popüler sorular (büyük kart, mor gradient)
- **Spor, Müzik, Finans**: 3 küçük kart
- **Yeni**: Popüler yeni sorular (büyük kart, mor gradient)
- **Magazin**: Küçük kart
- **Politika**: Küçük kart
- **Yakında Bitecek**: Popüler, yakında bitecek sorular (büyük kart, mor gradient)
- **Teknoloji, Dizi&Film, Sosyal Medya**: 3 küçük kart
- **Özel Oranlar**: Yüksek oranlı sorular (büyük kart, mor gradient)
- **Dünya**: Küçük kart

### 3. Animasyonlar
- **Fade-in animasyonu** kategori seçildiğinde
- **Smooth scroll** sorular bölümüne
- **Hover efektleri** kartlarda

### 4. Soru Listesi (İkinci Görünüm)
- **2 sütunlu grid** düzeni
- **Mevcut QuestionCard bileşeni** kullanılıyor
- **Kategori bilgisi** seçilen kategori için
- **Temizle butonu** kategori seçimini sıfırlamak için

## Teknik Detaylar

### Bileşen Yapısı
```typescript
interface SearchPageProps {
  questions: any[];
  onQuestionClick: (id: number) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
  showHeader?: boolean;
  gameCredits: number;
  setProfileDrawerOpen: (open: boolean) => void;
  hasNotifications: boolean;
}
```

### Kategori Filtreleme
- **Trendler**: 1000+ oy alan sorular
- **Yeni**: ID'si 15'ten büyük olan sorular
- **Yakında Bitecek**: "saat" kelimesi içeren sorular
- **Özel Oranlar**: 2.5x'den yüksek oranlı sorular
- **Diğer kategoriler**: Doğrudan kategori eşleştirmesi

### Stil Özellikleri
- **Renk paleti**: Mor gradient (#432870, #5A3A8B)
- **Gölgeler**: Soft shadow efektleri
- **Border radius**: 24px yuvarlak köşeler
- **Typography**: Bold ve regular font ağırlıkları

## Kullanım

1. **Ana sayfa** → **Keşfet** sekmesine tıklayın
2. **Kategori seçimi** → İstediğiniz kategoriye tıklayın
3. **Soru listesi** → Otomatik olarak görünür
4. **Temizle** → Kategori seçimini sıfırlar

## Figma Uyumluluğu

Bu implementasyon, verilen Figma tasarımının birebir kopyasıdır:
- ✅ Kategori grid düzeni
- ✅ Renk şeması ve gradientler
- ✅ Kart boyutları ve yerleşimi
- ✅ İkonlar ve metinler
- ✅ Animasyonlar ve geçişler
- ✅ Soru listesi görünümü

## Geliştirme Notları

- Mevcut `QuestionCard` bileşeni `isCompact` prop'u ile kullanılıyor
- `LinearGradient` bileşeni mor gradient efektleri için
- `Animated` API smooth geçişler için
- Responsive tasarım farklı ekran boyutları için 