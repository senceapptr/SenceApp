-- ================================================
-- SEED DATA (Başlangıç Verileri)
-- ================================================

-- ================================================
-- KATEGORİLER
-- ================================================

INSERT INTO public.categories (name, slug, icon, color, description) VALUES
  ('Teknoloji', 'teknoloji', '💻', '#3B82F6', 'Teknoloji ve yazılım dünyası'),
  ('Finans', 'finans', '💰', '#10B981', 'Ekonomi, borsa ve kripto'),
  ('Spor', 'spor', '⚽', '#EF4444', 'Spor müsabakaları ve sonuçları'),
  ('Politika', 'politika', '🏛️', '#8B5CF6', 'Siyaset ve güncel olaylar'),
  ('Eğlence', 'eglence', '🎬', '#F59E0B', 'Sinema, dizi ve müzik'),
  ('Bilim', 'bilim', '🔬', '#06B6D4', 'Bilim ve araştırma'),
  ('Sosyal Medya', 'sosyal-medya', '📱', '#EC4899', 'Sosyal medya trendleri'),
  ('Genel', 'genel', '🌍', '#6B7280', 'Diğer konular');

-- ================================================
-- GÖREVLER (TASKS)
-- ================================================

-- Günlük görevler
INSERT INTO public.tasks (title, description, type, requirement_type, requirement_value, reward_credits, reward_experience, icon, reset_period) VALUES
  ('İlk Tahmin', 'İlk tahminini yap', 'daily', 'prediction_count', 1, 1000, 50, '🎯', 'daily'),
  ('5 Tahmin Yap', '5 farklı soruya tahmin yap', 'daily', 'prediction_count', 5, 5000, 100, '🔥', 'daily'),
  ('Günlük Giriş', 'Her gün uygulamaya giriş yap', 'daily', 'login_streak', 1, 500, 25, '📅', 'daily'),
  ('Doğru Tahmin', 'En az 1 doğru tahmin yap', 'daily', 'correct_predictions', 1, 2000, 75, '✅', 'daily');

-- Haftalık görevler
INSERT INTO public.tasks (title, description, type, requirement_type, requirement_value, reward_credits, reward_experience, icon, reset_period) VALUES
  ('Haftalık Uzman', '20 tahmin yap', 'weekly', 'prediction_count', 20, 10000, 250, '🏆', 'weekly'),
  ('Kupon Ustası', '3 kupon oluştur', 'weekly', 'coupon_count', 3, 7500, 200, '🎫', 'weekly'),
  ('Lig Kahramanı', 'Bir lige katıl', 'weekly', 'custom', 1, 5000, 150, '👥', 'weekly');

-- Başarımlar (achievements)
INSERT INTO public.tasks (title, description, type, requirement_type, requirement_value, reward_credits, reward_experience, icon, reset_period) VALUES
  ('İlk Adım', 'İlk tahminini yap', 'achievement', 'prediction_count', 1, 500, 100, '🎯', 'never'),
  ('Tahmin Ustası', '100 tahmin yap', 'achievement', 'prediction_count', 100, 50000, 1000, '🎖️', 'never'),
  ('Doğruluk Kralı', '50 doğru tahmin yap', 'achievement', 'correct_predictions', 50, 75000, 1500, '👑', 'never'),
  ('Kupon Koleksiyoncusu', '10 kupon oluştur', 'achievement', 'coupon_count', 10, 25000, 500, '📋', 'never');

-- ================================================
-- MARKET ÖĞELERİ
-- ================================================

-- Boostlar
INSERT INTO public.market_items (name, description, type, price, icon, effect_data) VALUES
  ('2x Kazanç Boost', '1 saatliğine kazançlarınızı 2 katına çıkarır', 'boost', 5000, '⚡', '{"multiplier": 2, "duration": 3600}'),
  ('Doğru Tahmin Sigortası', 'Bir tahmininiz yanlış olsa bile kredi kaybetmezsiniz', 'powerup', 10000, '🛡️', '{"protection": true}'),
  ('Oran Boost', 'Seçtiğiniz bir sorunun oranını %20 artırır', 'boost', 7500, '📈', '{"odds_increase": 0.2}');

-- Avatarlar
INSERT INTO public.market_items (name, description, type, price, icon, stock) VALUES
  ('Premium Avatar 1', 'Özel tasarım avatar', 'avatar', 15000, '👤', 1),
  ('Premium Avatar 2', 'Özel tasarım avatar', 'avatar', 15000, '👤', 1),
  ('Premium Avatar 3', 'Özel tasarım avatar', 'avatar', 15000, '👤', 1);

-- Rozetler
INSERT INTO public.market_items (name, description, type, price, icon) VALUES
  ('Altın Rozet', 'Profilinizde görünen altın rozet', 'badge', 25000, '🏅'),
  ('Uzman Rozeti', 'Tahmin uzmanı rozeti', 'badge', 20000, '🎯'),
  ('VIP Rozeti', 'VIP üye rozeti', 'badge', 50000, '💎');

-- ================================================
-- ÖRNEK SORULAR (Test için)
-- ================================================

-- Not: Gerçek uygulamada bu sorular admin panel üzerinden eklenecek
-- Burada sadece test amaçlı birkaç örnek ekliyoruz

DO $$
DECLARE
  tech_category_id UUID;
  finance_category_id UUID;
  sport_category_id UUID;
BEGIN
  -- Kategori ID'lerini al
  SELECT id INTO tech_category_id FROM public.categories WHERE slug = 'teknoloji';
  SELECT id INTO finance_category_id FROM public.categories WHERE slug = 'finans';
  SELECT id INTO sport_category_id FROM public.categories WHERE slug = 'spor';

  -- Örnek sorular
  INSERT INTO public.questions (title, description, category_id, image_url, yes_odds, no_odds, end_date, is_featured, is_trending) VALUES
    (
      'Tesla 2025 yılında $400''ı aşacak mı?',
      'Tesla hisse senedi fiyatının 2025 yılı sonuna kadar $400 seviyesini aşıp aşmayacağı konusunda tahminini paylaş.',
      tech_category_id,
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89',
      2.4,
      1.6,
      NOW() + INTERVAL '30 days',
      true,
      true
    ),
    (
      'Bitcoin 2025''te 100.000$ üzerine çıkar mı?',
      'Bitcoin fiyatının 2025 yılında 100.000 doların üzerine çıkıp çıkmayacağını tahmin et.',
      finance_category_id,
      'https://images.unsplash.com/photo-1518546305927-5a555bb7020d',
      3.2,
      1.3,
      NOW() + INTERVAL '60 days',
      true,
      true
    ),
    (
      'Galatasaray Şampiyonlar Ligi''nde çeyrek finale kalır mı?',
      'Galatasaray Şampiyonlar Ligi''nde çeyrek final oynayacak mı?',
      sport_category_id,
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20',
      2.1,
      1.8,
      NOW() + INTERVAL '45 days',
      false,
      true
    );

  -- Her soru için istatistik kayıtları oluştur
  INSERT INTO public.question_statistics (question_id, total_predictions, unique_users)
  SELECT id, 0, 0 FROM public.questions;
END $$;

