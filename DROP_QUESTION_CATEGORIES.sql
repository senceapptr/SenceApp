-- question_categories tablosunu kaldır

-- 1. Önce foreign key constraint'leri kaldır
ALTER TABLE question_categories DROP CONSTRAINT IF EXISTS fk_question_categories_question_id;
ALTER TABLE question_categories DROP CONSTRAINT IF EXISTS fk_question_categories_category_id;

-- 2. Tabloyu kaldır
DROP TABLE IF EXISTS question_categories;
