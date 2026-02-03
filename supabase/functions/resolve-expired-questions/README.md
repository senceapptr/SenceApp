# resolve-expired-questions

Süresi bitimine **15 dakika kala** RSS+AI ile öneri üretir (soru **süre bitene kadar active kalır**); süre dolunca soruyu `closed` yapıp admin panele düşürür. Admin sonucu (süre bitmeden veya sonra) `result` alanına yazar; süre bitince **finalize** adımı ile `status = resolved` yapılır ve uygulamada sonuç gösterilir (kullanıcıya sonuç sadece süre bittikten sonra gösterilir).

## Tetikleme

- **Supabase Cron (pg_cron):** Migration `071_supabase_cron_resolve_expired_questions.sql` ile her 10 dakikada bir tetiklenir. **Önce Vault secret'larını ekleyin** (aşağıdaki “Supabase Cron kurulumu” bölümüne bakın).
- **Harici cron:** GitHub Actions, Vercel Cron vb. ile **en az 15 dakikada bir** (tercihen **her 5–10 dakika**) çağrılmalı.
- **Manuel:** `GET` veya `POST` ile Edge Function URL’ine istek atılabilir.

### Supabase Cron kurulumu (migration 071)

1. **Dashboard’dan extension’ları açın:** Database → Extensions → `pg_cron` ve `pg_net` etkinleştirin.
2. **Migration’ı uygulayın:** `npx supabase db push` (veya mevcut migration komutunuz).
3. **Vault secret’larını ekleyin** (SQL Editor’da çalıştırın; `PROJECT_REF` ve `ANON_KEY` yerine kendi değerlerinizi yazın):

```sql
SELECT vault.create_secret('https://PROJECT_REF.supabase.co', 'project_url');
SELECT vault.create_secret('ANON_KEY_BURAYA', 'anon_key');
```

- `project_url`: Supabase proje URL’iniz (örn. `https://abcdefgh.supabase.co`).
- `anon_key`: Dashboard → Settings → API → Project API keys → `anon` public key.

Cron job her 10 dakikada bir `resolve-expired-questions` Edge Function’ını tetikler.

## Ortam değişkenleri (Supabase Secrets)

- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — Supabase tarafından otomatik verilir.
- `RSS_FEED_URLS` — Opsiyonel. Virgülle ayrılmış RSS feed URL listesi.
- `OPENAI_API_KEY` — Opsiyonel. RSS sonuç vermezse AI ile öneri üretmek için.

## 15 dakika kala otomatik mi, manuel mi?

Edge function **sadece tetiklendiğinde** çalışır (cron veya manuel). “15 dakika kala” penceresine giren sorular, fonksiyon o an çağrıldığında RSS+AI’dan geçer; **soru süre bitene kadar active kalır**, uygulamada süre geçmiş gibi görünmez. Admin panel “Sonuç Onayı” listesinde hem **süre dolmamış (15 dk kala)** hem **süresi dolmuş** sorular gösterilir; admin ön onay verebilir.

## Akış

1. **Süresi geçmiş sorular:** `status = 'active'` ve `end_date <= NOW()` olanlar `status = 'closed'` yapılır → Admin panel “Sonuç Onayı” listesinde “Süre doldu” olarak görünür.
2. **15 dakika kala penceresi:** `status = 'active'`, `end_date` 15 dk içinde bitecek sorular alınır. Sadece RSS+AI (varsa) ile **öneri yazılır**; **status değiştirilmez** (soru active kalır, uygulamada süre dolmamış görünür). Admin panel listesinde “Süre dolmadı — ön onay verilebilir” olarak görünür.
3. **Finalize:** `status = 'closed'` ve `result` dolu olan sorularda `end_date <= NOW()` ise → `status = 'resolved'`, `resolved_at` güncellenir (sonuç zaten `result` alanında). Admin süre bitmeden sonuç yazdıysa süre bitince bu adımda soru resolved olur. **Bu adım fonksiyon tetiklenince çalışır** — cron’u 5–10 dk aralıklarla çalıştırın ki süre bitince bir sonraki çalışmada finalize olsun.
4. **Fallback:** Zaten closed ama `suggested_result` boş kalan sorular için yine RSS+AI denenir.

## Özet

- **15 dk kala:** Soru kapatılmaz; sadece öneri yazılır, admin panelde listelenir, uygulamada süre dolmamış görünür.
- **Süre bitince:** Adım 1 ile soru closed olur; adım 3 ile result doluysa status resolved yapılır. Cron’u 5–10 dk aralıklarla çalıştırın.
- RSS ve AI key’leri opsiyonel; yokken sadece öneri üretilmez.

## Hata ayıklama (500 close_expired_questions failed)

Fonksiyon 500 döndürüyorsa yanıt gövdesindeki **tüm JSON alanlarına** bakın: **closeError** / **closeErrorCode** (RPC hatası), **directUpdateError** / **directUpdateCode** (doğrudan UPDATE hatası). Migrations 062, 063, 066 uygulandığından emin olun (`npx supabase db push`); ardından fonksiyonu yeniden deploy edin.
