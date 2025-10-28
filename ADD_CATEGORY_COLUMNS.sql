-- Questions tablosuna secondary ve third kategori sütunları ekle

-- 1. Sütunları ekle
ALTER TABLE questions 
ADD COLUMN secondary_category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

ALTER TABLE questions 
ADD COLUMN third_category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- 2. Index'leri oluştur
CREATE INDEX idx_questions_secondary_category_id ON questions(secondary_category_id);
CREATE INDEX idx_questions_third_category_id ON questions(third_category_id);
