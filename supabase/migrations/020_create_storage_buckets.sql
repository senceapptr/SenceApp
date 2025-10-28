-- ================================================
-- CREATE STORAGE BUCKETS FOR IMAGE UPLOADS
-- ================================================

-- User images bucket'ını oluştur
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-images',
  'user-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- ================================================
-- STORAGE POLICIES
-- ================================================

-- Herkes user-images bucket'ından okuyabilir
CREATE POLICY "Public read access for user-images" ON storage.objects
FOR SELECT USING (bucket_id = 'user-images');

-- Sadece authenticated kullanıcılar upload edebilir
CREATE POLICY "Authenticated users can upload to user-images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'user-images' 
  AND auth.uid() IS NOT NULL
);

-- Kullanıcılar kendi dosyalarını güncelleyebilir
CREATE POLICY "Users can update own files in user-images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'user-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Kullanıcılar kendi dosyalarını silebilir
CREATE POLICY "Users can delete own files in user-images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'user-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
