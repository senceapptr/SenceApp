# Soru Detay Sayfası - UI Yeniden Tasarım Planı (Güncel)

## Önemli: Orijinal Dosya Korunacak

- **Mevcut dosya**: `components/SenceFinal/QuestionDetailPage.tsx` — **DEĞİŞTİRİLMEYECEK**
- **Yeni implementasyon**: Tamamen yeni klasörde, sıfırdan oluşturulacak
- **Geçiş**: Tamamlandığında `App.tsx` import path'i yeni bileşene yönlendirilecek

---

## Yeni Klasör Yapısı

```
components/SenceFinal/
├── QuestionDetailPage.tsx          # ORİJİNAL - DOKUNULMAYACAK
├── QuestionDetailSkeleton.tsx      # ORİJİNAL - DOKUNULMAYACAK
└── QuestionDetailPageV2/           # YENİ - Tüm redesign burada
    ├── index.tsx                   # Ana export
    ├── QuestionDetailPageV2.tsx    # Ana layout (or index içinde)
    ├── components/
    │   ├── QuestionDetailHeader.tsx
    │   ├── QuestionDetailTabs.tsx
    │   ├── VoteActionBar.tsx
    │   ├── DetailsTab/
    │   │   ├── index.tsx
    │   │   ├── CreatorCard.tsx
    │   │   ├── VoteStatsSection.tsx
    │   │   └── RelatedQuestionsSection.tsx
    │   ├── CommentsTab/
    │   │   ├── index.tsx
    │   │   ├── CommentInput.tsx
    │   │   └── CommentCard.tsx
    │   ├── StatsTab/
    │   │   ├── index.tsx
    │   │   ├── TotalPoolCard.tsx
    │   │   ├── OddsChart.tsx
    │   │   └── TopInvestorsList.tsx
    │   ├── TicketModal.tsx
    │   └── SuccessModal.tsx
    ├── QuestionDetailSkeletonV2.tsx
    ├── types.ts
    └── styles.ts
```

---

## Geliştirme Stratejisi

1. **Orijinalden referans**: Yeni bileşenler yazılırken mevcut `QuestionDetailPage.tsx` sadece **okunacak** (API çağrıları, state yapısı, props interface referansı)
2. **Kopyalama yok**: Kod kopyalanmayacak; mantık ve API aynı kalacak, sadece UI ve bileşen yapısı yeniden yazılacak
3. **Props uyumu**: `QuestionDetailPageV2` aynı props'u kabul edecek (`onBack`, `onMenuToggle`, `question`, `onVote`, `sourceCategory`) — App.tsx'de sadece import değişecek

---

## Uygulama Sırası

| Sıra | Adım | Açıklama |
|------|------|----------|
| 1 | `QuestionDetailPageV2/` klasörü + types.ts | Tip tanımları (mevcut interfaces) |
| 2 | styles.ts | Theme-aware ortak stiller |
| 3 | Ana layout (index.tsx) | ScrollView, container, state yönetimi |
| 4 | QuestionDetailHeader | Header, nav, image, category badge |
| 5 | VoteActionBar | Alt EVET/HAYIR bar (FeaturedCard benzeri animasyon) |
| 6 | QuestionDetailTabs + DetailsTab | Tab bar + detay sekmesi bileşenleri |
| 7 | CommentsTab | Yorum girişi + liste |
| 8 | StatsTab | Ödül havuzu, grafik, yatırımcılar |
| 9 | TicketModal + SuccessModal | Modaller |
| 10 | QuestionDetailSkeletonV2 | Yeni layout'a uygun skeleton |
| 11 | App.tsx geçişi | Import'u `QuestionDetailPageV2` olarak değiştir |

---

## Geçiş Sonrası

- Eski `QuestionDetailPage.tsx` silinmeyecek; gerekirse `QuestionDetailPage_backup.tsx` olarak yeniden adlandırılabilir veya olduğu gibi bırakılır
- Sorun çıkarsa App.tsx'de tek satır değişiklikle eski bileşene dönülebilir
