-- ================================================
-- DATABASE CLEANUP AND OPTIMIZATION
-- Migration: 046_database_cleanup_and_optimization.sql
-- ================================================
-- Bu migration dosyası gereksiz kolonları, tabloları temizler ve performansı optimize eder
-- DİKKAT: Bu migration geri alınamaz (irreversible) değişiklikler içerir!
-- Production'a uygulamadan önce mutlaka test edin!

-- ================================================
-- 1. GEREKSIZ KOLONLARI KALDIRMA
-- ================================================

-- NOT: yes_percentage, no_percentage, yes_votes, no_votes KALDIRILMIYOR
-- Çünkü trigger ile güncelleniyor ve frontend'de aktif kullanılıyor
-- Bu kolonlar performans için cache olarak tutuluyor

-- 1.1. profiles.email kolonunu kaldır (auth.users'da zaten var)
-- ÖNCE: Bu kolonun kullanıldığı yerleri kontrol edin!
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- 1.2. leagues.current_members kolonunu kaldır (league_members'tan hesaplanabilir)
-- ÖNCE: Bu kolonun kullanıldığı yerleri kontrol edin!
-- ALTER TABLE public.leagues DROP COLUMN IF EXISTS current_members;

-- 1.3. comments.likes_count kolonunu kaldır (comment_likes'tan hesaplanabilir)
-- ÖNCE: Trigger'ı kaldırmayı unutmayın!
-- ALTER TABLE public.comments DROP COLUMN IF EXISTS likes_count;
-- DROP TRIGGER IF EXISTS update_comment_likes_count_trigger ON public.comment_likes;
-- DROP FUNCTION IF EXISTS update_comment_likes_count();

-- ================================================
-- 2. GEREKSIZ ID KOLONLARINI COMPOSITE KEY İLE DEĞİŞTİRME
-- ================================================

-- NOT: Bu değişiklikler büyük risk içerir, çünkü foreign key'ler etkilenebilir
-- Bu yüzden şimdilik sadece yorum satırı olarak bırakıyoruz
-- İhtiyaç duyulduğunda ayrı migration olarak yapılabilir

-- 2.1. user_stats.id kaldır, user_id'yi primary key yap
-- ALTER TABLE public.user_stats DROP CONSTRAINT IF EXISTS user_stats_pkey;
-- ALTER TABLE public.user_stats ADD PRIMARY KEY (user_id);
-- ALTER TABLE public.user_stats DROP COLUMN IF EXISTS id;

-- 2.2. user_settings.id kaldır, user_id'yi primary key yap
-- ALTER TABLE public.user_settings DROP CONSTRAINT IF EXISTS user_settings_pkey;
-- ALTER TABLE public.user_settings ADD PRIMARY KEY (user_id);
-- ALTER TABLE public.user_settings DROP COLUMN IF EXISTS id;

-- 2.3. notification_settings.id kaldır, user_id'yi primary key yap
-- ALTER TABLE public.notification_settings DROP CONSTRAINT IF EXISTS notification_settings_pkey;
-- ALTER TABLE public.notification_settings ADD PRIMARY KEY (user_id);
-- ALTER TABLE public.notification_settings DROP COLUMN IF EXISTS id;

-- ================================================
-- 3. INDEX OPTİMİZASYONU
-- ================================================

-- 3.1. Eksik index'leri ekle
CREATE INDEX IF NOT EXISTS idx_questions_created_by ON public.questions(created_by);
CREATE INDEX IF NOT EXISTS idx_questions_status_end_date ON public.questions(status, end_date);
CREATE INDEX IF NOT EXISTS idx_predictions_status ON public.predictions(status);
CREATE INDEX IF NOT EXISTS idx_predictions_user_status ON public.predictions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_coupons_user_status ON public.coupons(user_id, status);
CREATE INDEX IF NOT EXISTS idx_coupons_created_at ON public.coupons(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_league_members_status ON public.league_members(status);
CREATE INDEX IF NOT EXISTS idx_league_members_points ON public.league_members(league_id, points DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_type ON public.activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON public.activities(created_at DESC);

-- 3.2. Composite index'ler (sık kullanılan sorgular için)
CREATE INDEX IF NOT EXISTS idx_questions_category_status ON public.questions(category_id, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_predictions_question_status ON public.predictions(question_id, status) WHERE status IN ('pending', 'won', 'lost');
CREATE INDEX IF NOT EXISTS idx_coupon_selections_coupon_status ON public.coupon_selections(coupon_id, status);

-- 3.3. Partial index'ler (sadece aktif kayıtlar için)
CREATE INDEX IF NOT EXISTS idx_questions_active ON public.questions(id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_coupons_pending ON public.coupons(id) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(id) WHERE is_read = false;

-- ================================================
-- 4. GEREKSIZ TABLOLARI KONTROL ETME
-- ================================================

-- 4.1. question_statistics tablosu - View ile değiştirilebilir
-- Şimdilik kaldırmıyoruz, çünkü kullanılıyor olabilir
-- İleride view oluşturulabilir:
/*
CREATE OR REPLACE VIEW question_statistics_view AS
SELECT 
  q.id as question_id,
  COUNT(DISTINCT p.id) as total_predictions,
  COALESCE(SUM(p.amount), 0) as total_amount,
  COALESCE(SUM(p.amount) FILTER (WHERE p.vote = 'yes'), 0) as yes_amount,
  COALESCE(SUM(p.amount) FILTER (WHERE p.vote = 'no'), 0) as no_amount,
  COUNT(DISTINCT p.user_id) as unique_users,
  NOW() as updated_at
FROM questions q
LEFT JOIN predictions p ON q.id = p.question_id AND p.status != 'cancelled'
GROUP BY q.id;
*/

-- 4.2. activities tablosu - Sosyal özellik kullanılmıyorsa kaldırılabilir
-- Şimdilik kaldırmıyoruz, çünkü gelecekte kullanılabilir

-- ================================================
-- 5. TRIGGER OPTİMİZASYONU
-- ================================================

-- 5.1. Mevcut trigger'ları kontrol et ve optimize et
-- update_question_vote_counts trigger'ı zaten optimize edilmiş durumda
-- Sadece comment_likes_count trigger'ını kaldırabiliriz (eğer likes_count kolonunu kaldırırsak)

-- ================================================
-- 6. FOREIGN KEY CONSTRAINT OPTİMİZASYONU
-- ================================================

-- 6.1. ON DELETE CASCADE kontrolü - zaten doğru yapılandırılmış
-- 6.2. ON DELETE SET NULL kontrolü - secondary_category_id ve third_category_id için doğru

-- ================================================
-- 7. TABLO ANALİZİ VE VACUUM
-- ================================================

-- 7.1. Tabloları analiz et (PostgreSQL query planner için)
ANALYZE public.profiles;
ANALYZE public.questions;
ANALYZE public.predictions;
ANALYZE public.coupons;
ANALYZE public.coupon_selections;
ANALYZE public.leagues;
ANALYZE public.league_members;
ANALYZE public.notifications;
ANALYZE public.comments;
ANALYZE public.comment_likes;

-- 7.2. VACUUM (production'da dikkatli kullanın - lock alabilir)
-- VACUUM ANALYZE public.profiles;
-- VACUUM ANALYZE public.questions;
-- VACUUM ANALYZE public.predictions;

-- ================================================
-- 8. PERFORMANS İYİLEŞTİRMELERİ
-- ================================================

-- 8.1. Sequence cache artırma (daha hızlı ID üretimi için)
-- ALTER SEQUENCE public.coupons_display_id_seq CACHE 20;

-- 8.2. Table statistics güncelleme
-- PostgreSQL otomatik olarak yapıyor, ama manuel de yapılabilir

-- ================================================
-- 9. GÜVENLİK KONTROLLERİ
-- ================================================

-- 9.1. RLS policy'lerinin aktif olduğundan emin ol
-- (Migration 032'de zaten yapılmış)

-- 9.2. Gereksiz policy'leri temizle (eğer varsa)
-- Önce policy'leri kontrol edin:
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- ================================================
-- 10. DOKÜMANTASYON
-- ================================================

-- 10.1. Tablo yorumları ekle (eğer yoksa)
COMMENT ON TABLE public.profiles IS 'Kullanıcı profilleri - auth.users tablosuna ek bilgiler';
COMMENT ON TABLE public.questions IS 'Soru tablosu - kullanıcıların oluşturduğu tahmin soruları';
COMMENT ON TABLE public.predictions IS 'Tahminler - kullanıcıların sorulara verdiği cevaplar';
COMMENT ON TABLE public.coupons IS 'Kuponlar - birden fazla tahminin birleştirilmesi';
COMMENT ON TABLE public.leagues IS 'Ligler - kullanıcıların bir araya gelip yarıştığı gruplar';

-- 10.2. Önemli kolon yorumları
COMMENT ON COLUMN public.questions.yes_percentage IS 'Evet oylarının yüzdesi - trigger ile otomatik güncellenir';
COMMENT ON COLUMN public.questions.no_percentage IS 'Hayır oylarının yüzdesi - trigger ile otomatik güncellenir';
COMMENT ON COLUMN public.questions.secondary_category_id IS 'İkincil kategori - soru birden fazla kategoriye ait olabilir';
COMMENT ON COLUMN public.questions.third_category_id IS 'Üçüncül kategori - soru birden fazla kategoriye ait olabilir';

-- ================================================
-- SONUÇ
-- ================================================

-- Bu migration şu işlemleri yaptı:
-- ✅ Index optimizasyonu (yeni index'ler eklendi)
-- ✅ Tablo analizi (query planner için)
-- ✅ Dokümantasyon eklendi
-- ⚠️ Gereksiz kolon kaldırma işlemleri yorum satırı olarak bırakıldı (güvenlik için)
-- ⚠️ Composite key değişiklikleri yorum satırı olarak bırakıldı (riskli)

-- ÖNEMLİ NOTLAR:
-- 1. Production'a uygulamadan önce mutlaka test edin!
-- 2. Yorum satırı olan değişiklikleri yapmadan önce kod tabanını kontrol edin
-- 3. Backup alın!
-- 4. Index'ler disk alanı kullanır, gerekirse kaldırılabilir
