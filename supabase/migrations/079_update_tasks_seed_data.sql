-- =====================================================
-- UPDATE TASKS SEED DATA
-- Günlük ve Aylık görevleri güncelle
-- =====================================================

-- Önce constraint'i kaldır (yeni değerleri ekleyebilmek için)
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_requirement_type_check;

-- Yeni değerleri içeren constraint ekle
ALTER TABLE public.tasks ADD CONSTRAINT tasks_requirement_type_check 
  CHECK (requirement_type IN (
    'prediction_count', 
    'correct_predictions', 
    'coupon_count', 
    'login_streak', 
    'referral', 
    'custom',
    'daily_games',
    'league_prediction',
    'league_complete',
    'daily_games_bonus'
  ));

-- Mevcut görevleri deaktif et
UPDATE public.tasks SET is_active = false;

-- =====================================================
-- GÜNLÜK GÖREVLER (Daily Tasks) - Toplam ~100 kredi
-- =====================================================

INSERT INTO public.tasks (title, description, type, requirement_type, requirement_value, reward_credits, reward_experience, icon, is_active, reset_period) VALUES
  (
    'Bir kupon yap',
    'Bugün 1 kupon oluştur',
    'daily',
    'coupon_count',
    1,
    25,
    15,
    '🎫',
    true,
    'daily'
  ),
  (
    '5 farklı soruya tahmin yap',
    'Bugün 5 farklı soruya tahmin yap',
    'daily',
    'prediction_count',
    5,
    30,
    20,
    '🎯',
    true,
    'daily'
  ),
  (
    'Günlük oyunlarını tamamla',
    'Spin, Zip ve Higher/Lower oyunlarını oyna',
    'daily',
    'daily_games',
    3,
    20,
    10,
    '🎮',
    true,
    'daily'
  ),
  (
    'Bir tahminin doğru sonuçlansın',
    'En az 1 tahminin bugün doğru çıksın',
    'daily',
    'correct_predictions',
    1,
    15,
    10,
    '✅',
    true,
    'daily'
  ),
  (
    'Lig''de soru tahmini yap',
    'Herhangi bir ligde 1 soru tahmini yap',
    'daily',
    'league_prediction',
    1,
    10,
    5,
    '🏆',
    true,
    'daily'
  );

-- =====================================================
-- AYLIK GÖREVLER (Monthly Tasks) - Toplam ~1000 kredi
-- =====================================================

INSERT INTO public.tasks (title, description, type, requirement_type, requirement_value, reward_credits, reward_experience, icon, is_active, reset_period) VALUES
  (
    '20 gün giriş yap',
    'Bu ay 20 gün uygulamaya giriş yap',
    'monthly',
    'login_streak',
    20,
    300,
    150,
    '📅',
    true,
    'monthly'
  ),
  (
    '30 kupon yap',
    'Bu ay toplamda 30 kupon oluştur',
    'monthly',
    'coupon_count',
    30,
    200,
    100,
    '🎫',
    true,
    'monthly'
  ),
  (
    '100 soruya tahmin yap',
    'Bu ay toplamda 100 soruya tahmin yap',
    'monthly',
    'prediction_count',
    100,
    250,
    125,
    '🎯',
    true,
    'monthly'
  ),
  (
    'Ligi tamamla',
    'Bir ligi başından sonuna kadar tamamla',
    'monthly',
    'league_complete',
    1,
    150,
    75,
    '🏅',
    true,
    'monthly'
  ),
  (
    '10 kere günlük oyun ödülü al',
    'Günlük 3/3 oyun bonusunu 10 kez al',
    'monthly',
    'daily_games_bonus',
    10,
    100,
    50,
    '🎁',
    true,
    'monthly'
  );
