-- Soru kategorileri sistemini düzelt

-- 1. question_categories tablosunu oluştur
CREATE TABLE IF NOT EXISTS question_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  category_type VARCHAR(20) NOT NULL DEFAULT 'primary' CHECK (category_type IN ('primary', 'secondary', 'third')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(question_id, category_id)
);

-- 2. RLS policy'lerini etkinleştir
ALTER TABLE question_categories ENABLE ROW LEVEL SECURITY;

-- 3. RLS policy'leri oluştur
DROP POLICY IF EXISTS "Enable read access for all users" ON question_categories;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON question_categories;
DROP POLICY IF EXISTS "Enable update for users based on question owner" ON question_categories;
DROP POLICY IF EXISTS "Enable delete for users based on question owner" ON question_categories;

CREATE POLICY "Enable read access for all users" ON question_categories
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON question_categories
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for users based on question owner" ON question_categories
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT created_by FROM questions WHERE id = question_id
        )
    );

CREATE POLICY "Enable delete for users based on question owner" ON question_categories
    FOR DELETE USING (
        auth.uid() IN (
            SELECT created_by FROM questions WHERE id = question_id
        )
    );

-- 4. Mevcut questions tablosundaki category_id'yi question_categories tablosuna taşı
-- Önce primary kategori olarak ekle
INSERT INTO question_categories (question_id, category_id, category_type)
SELECT id, category_id, 'primary'
FROM questions 
WHERE category_id IS NOT NULL
ON CONFLICT (question_id, category_id) DO NOTHING;

-- 5. Index'leri oluştur
CREATE INDEX IF NOT EXISTS idx_question_categories_question_id ON question_categories(question_id);
CREATE INDEX IF NOT EXISTS idx_question_categories_category_id ON question_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_question_categories_type ON question_categories(category_type);

-- 6. Mevcut sorular için secondary ve third kategoriler ekle (örnek)
-- Bu kısım manuel olarak düzenlenebilir veya otomatik algoritma ile yapılabilir

-- 7. Foreign key constraint'leri kontrol et
ALTER TABLE question_categories 
ADD CONSTRAINT fk_question_categories_question_id 
FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE;

ALTER TABLE question_categories 
ADD CONSTRAINT fk_question_categories_category_id 
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;
