-- Soruların birden fazla kategoriye sahip olabilmesi için güncelleme

-- 1. Mevcut question_categories tablosunu oluştur (eğer yoksa)
CREATE TABLE IF NOT EXISTS question_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
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
INSERT INTO question_categories (question_id, category_id)
SELECT id, category_id 
FROM questions 
WHERE category_id IS NOT NULL
ON CONFLICT (question_id, category_id) DO NOTHING;

-- 5. questions tablosundaki category_id sütununu kaldır (isteğe bağlı - şimdilik bırakalım)
-- ALTER TABLE questions DROP COLUMN IF EXISTS category_id;

-- 6. Index'leri oluştur
CREATE INDEX IF NOT EXISTS idx_question_categories_question_id ON question_categories(question_id);
CREATE INDEX IF NOT EXISTS idx_question_categories_category_id ON question_categories(category_id);
