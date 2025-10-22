-- ================================================
-- MARKET ÜRÜNLERİNE GEÇİCİ RESİMLER EKLE
-- ================================================

-- Market items tablosuna image_url kolonu ekle (eğer yoksa)
ALTER TABLE public.market_items 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Mevcut ürünlere geçici resimler ekle
UPDATE public.market_items 
SET image_url = CASE 
  -- Boostlar için resimler
  WHEN name = '2x Kazanç Boost' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&q=80'
  WHEN name = 'Doğru Tahmin Sigortası' THEN 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop&q=80'
  WHEN name = 'Oran Boost' THEN 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&q=80'
  
  -- Avatarlar için resimler
  WHEN name = 'Premium Avatar 1' THEN 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=300&fit=crop&q=80'
  WHEN name = 'Premium Avatar 2' THEN 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&q=80'
  WHEN name = 'Premium Avatar 3' THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&q=80'
  
  -- Rozetler için resimler
  WHEN name = 'Altın Rozet' THEN 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&q=80'
  WHEN name = 'Uzman Rozeti' THEN 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&q=80'
  WHEN name = 'VIP Rozeti' THEN 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&q=80'
  
  -- Diğer ürünler için varsayılan resim
  ELSE 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop&q=80'
END
WHERE image_url IS NULL;

-- Daha fazla market ürünü ekle (test için)
INSERT INTO public.market_items (name, description, type, price, icon, image_url, effect_data) VALUES
  ('Hızlı Tahmin Boost', 'Tahmin yapma sürenizi %50 azaltır', 'boost', 8000, '⚡', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80', '{"speed_boost": 0.5}'),
  ('Çifte Kazanç', 'Kazandığınızda ekstra %50 kredi alın', 'powerup', 12000, '💰', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop&q=80', '{"double_reward": true}'),
  ('Premium Tema', 'Özel uygulama teması', 'theme', 20000, '🎨', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop&q=80', '{"theme": "premium"}'),
  ('Gizli Avatar', 'Özel gizli avatar', 'avatar', 25000, '👤', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop&q=80', NULL),
  ('Şampiyon Rozeti', 'Şampiyon rozeti', 'badge', 30000, '🏆', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&q=80', NULL);
