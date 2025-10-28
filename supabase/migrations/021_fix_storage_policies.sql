-- ================================================
-- FIX STORAGE POLICIES (Bucket already exists)
-- ================================================

-- Mevcut policy'leri sil (eğer varsa)
DROP POLICY IF EXISTS "Public read access for user-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to user-images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files in user-images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files in user-images" ON storage.objects;

-- Yeni policy'leri oluştur
CREATE POLICY "Public read access for user-images" ON storage.objects
FOR SELECT USING (bucket_id = 'user-images');

CREATE POLICY "Authenticated users can upload to user-images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'user-images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update own files in user-images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'user-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own files in user-images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'user-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
