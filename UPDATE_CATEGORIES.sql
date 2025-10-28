-- Kategorileri güncelle: Bilim -> Sinema, Genel -> Global, Magazin ekle

-- 1. Bilim kategorisini Sinema ile değiştir
UPDATE categories 
SET 
  name = 'Sinema',
  slug = 'sinema',
  icon = '🎬',
  color = '#FF3B30',
  description = 'Sinema, dizi ve film dünyası'
WHERE slug = 'bilim';

-- 2. Genel kategorisini Global ile değiştir
UPDATE categories 
SET 
  name = 'Global',
  slug = 'global',
  icon = '🌍',
  color = '#4CD964',
  description = 'Global konular ve güncel olaylar'
WHERE slug = 'genel';

-- 3. Magazin kategorisi ekle (eğer yoksa)
INSERT INTO categories (id, name, slug, icon, color, description, is_active)
SELECT 
  gen_random_uuid(),
  'Magazin',
  'magazin',
  '📸',
  '#FF2D55',
  'Magazin ve eğlence haberleri',
  true
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'magazin');

-- 4. Kategorilerin sıralamasını güncelle
UPDATE categories SET name = 'Spor' WHERE slug = 'spor';
UPDATE categories SET name = 'Müzik' WHERE slug = 'eglence';
UPDATE categories SET name = 'Finans' WHERE slug = 'finans';
UPDATE categories SET name = 'Magazin' WHERE slug = 'magazin';
UPDATE categories SET name = 'Sosyal Medya' WHERE slug = 'sosyal-medya';
UPDATE categories SET name = 'Politika' WHERE slug = 'politika';
UPDATE categories SET name = 'Teknoloji' WHERE slug = 'teknoloji';
UPDATE categories SET name = 'Sinema' WHERE slug = 'sinema';
UPDATE categories SET name = 'Global' WHERE slug = 'global';

-- 5. Kategorilerin icon ve color'larını güncelle
UPDATE categories SET icon = '⚽', color = '#34C759' WHERE slug = 'spor';
UPDATE categories SET icon = '🎵', color = '#FF2D55' WHERE slug = 'eglence';
UPDATE categories SET icon = '💰', color = '#10B981' WHERE slug = 'finans';
UPDATE categories SET icon = '📸', color = '#FF2D55' WHERE slug = 'magazin';
UPDATE categories SET icon = '📱', color = '#007AFF' WHERE slug = 'sosyal-medya';
UPDATE categories SET icon = '🏛️', color = '#5856D6' WHERE slug = 'politika';
UPDATE categories SET icon = '💻', color = '#5AC8FA' WHERE slug = 'teknoloji';
UPDATE categories SET icon = '🎬', color = '#FF3B30' WHERE slug = 'sinema';
UPDATE categories SET icon = '🌍', color = '#4CD964' WHERE slug = 'global';
