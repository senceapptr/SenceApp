-- Soru kategorileri sistemini düzelt (V2 - questions tablosuna sütunlar ekleme)

-- 1. questions tablosuna secondary ve third kategori sütunları ekle
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS secondary_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS third_category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- 2. Index'leri oluştur
CREATE INDEX IF NOT EXISTS idx_questions_secondary_category_id ON questions(secondary_category_id);
CREATE INDEX IF NOT EXISTS idx_questions_third_category_id ON questions(third_category_id);

-- 3. Mevcut verileri güncelle (eğer question_categories tablosundan veri varsa)
-- Bu kısım opsiyonel - eğer question_categories tablosu varsa verileri taşı
-- UPDATE questions SET 
--   secondary_category_id = (SELECT category_id FROM question_categories WHERE question_id = questions.id AND category_type = 'secondary' LIMIT 1),
--   third_category_id = (SELECT category_id FROM question_categories WHERE question_id = questions.id AND category_type = 'third' LIMIT 1)
-- WHERE EXISTS (SELECT 1 FROM question_categories WHERE question_id = questions.id);

-- 4. question_categories tablosunu kaldır (eğer varsa)
-- DROP TABLE IF EXISTS question_categories;
