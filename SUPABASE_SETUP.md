# Supabase Kurulum Rehberi

## 1. Supabase Projesi Oluşturma

1. [Supabase Dashboard](https://supabase.com/dashboard)'a gidin
2. "New Project" butonuna tıklayın
3. Proje adı ve şifre belirleyin
4. Bölge seçin (yakın bölge = daha hızlı)

## 2. Environment Variables Ayarlama

1. Proje root dizininde `.env.local` dosyası oluşturun:
```bash
cp .env.local.example .env.local
```

2. Supabase Dashboard'da: **Settings > API** sayfasına gidin

3. `.env.local` dosyasını düzenleyin:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Önemli:** `.env.local` dosyası Git'e commit edilmemelidir (.gitignore'da tanımlı)

## 3. Dosya Yapısı

```
lib/
├── supabase.ts              # Supabase client
├── supabase-storage.ts      # AsyncStorage adapter
└── database.types.ts        # TypeScript tip tanımlamaları
```

## 4. Kullanım

```typescript
import { supabase } from '@/lib/supabase';

// Örnek sorgu
const { data, error } = await supabase
  .from('users')
  .select('*');
```

## 5. TypeScript Tip Oluşturma

Veritabanı şemanız hazır olduğunda:

```bash
npx supabase gen types typescript --project-id "your-project-id" --schema public > lib/database.types.ts
```

## Sonraki Adımlar

- ✅ Supabase paketi yüklendi
- ✅ Environment variables yapılandırıldı
- ✅ Client oluşturuldu
- ⏳ Veritabanı şeması oluşturulacak
- ⏳ Auth sistemi entegre edilecek
- ⏳ Servis katmanı yazılacak




