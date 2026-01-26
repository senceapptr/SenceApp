-- ================================================
-- SORU EKLEME SQL KODU - HAZIR
-- ================================================
-- Kullanım: Bu kodu Supabase SQL Editor'da çalıştır
-- Hiçbir şey doldurmana gerek yok, direkt çalıştır!
-- ================================================

DO $$
DECLARE
  -- Kategori ID'leri (otomatik alınacak)
  teknoloji_id UUID;
  finans_id UUID;
  spor_id UUID;
  politika_id UUID;
  sinema_id UUID;
  muzik_id UUID;
  sosyal_medya_id UUID;
  magazin_id UUID;
  global_id UUID;
BEGIN
  -- Kategori ID'lerini otomatik al (slug'lara göre)
  SELECT id INTO teknoloji_id FROM public.categories WHERE slug = 'teknoloji';
  SELECT id INTO finans_id FROM public.categories WHERE slug = 'finans';
  SELECT id INTO spor_id FROM public.categories WHERE slug = 'spor';
  SELECT id INTO politika_id FROM public.categories WHERE slug = 'politika';
  SELECT id INTO sinema_id FROM public.categories WHERE slug = 'sinema';
  SELECT id INTO muzik_id FROM public.categories WHERE slug = 'eglence';
  SELECT id INTO sosyal_medya_id FROM public.categories WHERE slug = 'sosyal-medya';
  SELECT id INTO magazin_id FROM public.categories WHERE slug = 'magazin';
  SELECT id INTO global_id FROM public.categories WHERE slug = 'global';

  -- Soruları ekle
  INSERT INTO public.questions (
    title, 
    description, 
    category_id, 
    image_url, 
    yes_odds, 
    no_odds, 
    end_date, 
    status,
    is_featured,
    is_trending
  ) VALUES
    -- SORU 1: Teknoloji
    (
      'Apple 2025''te yeni bir iPhone modeli çıkaracak mı?',
      'Apple 2025 yılında yeni bir iPhone modeli tanıtacak mı? iPhone 16 veya daha yeni bir model çıkacak mı?',
      teknoloji_id,
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
      1.3,
      3.2,
      NOW() + INTERVAL '90 days',
      'active',
      true,
      true
    ),

    -- SORU 2: Finans
    (
      'Dolar/TL kuru 2025''te 40 TL''yi aşacak mı?',
      'Dolar/TL kuru 2025 yılı sonuna kadar 40 TL seviyesini geçecek mi?',
      finans_id,
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop',
      2.2,
      1.7,
      NOW() + INTERVAL '365 days',
      'active',
      true,
      true
    ),

    -- SORU 3: Spor
    (
      'Türkiye 2026 Dünya Kupası''na katılacak mı?',
      'Türkiye Milli Takımı 2026 Dünya Kupası''na katılma hakkı kazanacak mı?',
      spor_id,
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=600&fit=crop',
      1.8,
      2.2,
      NOW() + INTERVAL '180 days',
      'active',
      true,
      true
    ),

    -- SORU 4: Teknoloji
    (
      'ChatGPT 2025''te ücretsiz olacak mı?',
      'OpenAI ChatGPT''yi 2025 yılında tamamen ücretsiz hale getirecek mi?',
      teknoloji_id,
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
      2.8,
      1.4,
      NOW() + INTERVAL '120 days',
      'active',
      false,
      true
    ),

    -- SORU 5: Finans
    (
      'Bitcoin 2025''te 100.000$ üzerine çıkar mı?',
      'Bitcoin fiyatı 2025 yılında 100.000 doların üzerine çıkacak mı?',
      finans_id,
      'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=600&fit=crop',
      3.2,
      1.3,
      NOW() + INTERVAL '365 days',
      'active',
      true,
      true
    ),

    -- SORU 6: Spor
    (
      'Fenerbahçe 2024-2025 sezonunda şampiyon olacak mı?',
      'Fenerbahçe 2024-2025 Süper Lig sezonunda şampiyon olacak mı?',
      spor_id,
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
      2.3,
      1.6,
      NOW() + INTERVAL '200 days',
      'active',
      false,
      true
    ),

    -- SORU 7: Politika
    (
      '2025''te genel seçim yapılacak mı?',
      'Türkiye''de 2025 yılında genel seçim yapılacak mı?',
      politika_id,
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=600&fit=crop',
      1.9,
      2.1,
      NOW() + INTERVAL '365 days',
      'active',
      false,
      false
    ),

    -- SORU 8: Sinema
    (
      'Yeni bir Marvel filmi 2025''te çıkacak mı?',
      'Marvel Studios 2025 yılında yeni bir sinema filmi yayınlayacak mı?',
      sinema_id,
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop',
      1.3,
      3.0,
      NOW() + INTERVAL '180 days',
      'active',
      true,
      false
    ),

    -- SORU 9: Teknoloji
    (
      'Tesla 2025''te $400''ı aşacak mı?',
      'Tesla hisse senedi fiyatı 2025 yılı sonuna kadar $400 seviyesini aşıp aşmayacağı konusunda tahminini paylaş.',
      teknoloji_id,
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop',
      2.4,
      1.6,
      NOW() + INTERVAL '365 days',
      'active',
      true,
      true
    ),

    -- SORU 10: Sosyal Medya
    (
      'Instagram 2025''te yeni bir özellik ekleyecek mi?',
      'Instagram 2025 yılında önemli bir yeni özellik duyuracak mı?',
      sosyal_medya_id,
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
      1.4,
      2.6,
      NOW() + INTERVAL '120 days',
      'active',
      false,
      false
    ),

    -- SORU 11: Finans
    (
      'Altın fiyatı 2025''te 3000 TL''yi geçecek mi?',
      'Altın fiyatı 2025 yılında 3000 TL seviyesini aşacak mı?',
      finans_id,
      'https://images.unsplash.com/photo-1579613832125-5d34acbee352?w=800&h=600&fit=crop',
      2.5,
      1.6,
      NOW() + INTERVAL '365 days',
      'active',
      false,
      false
    ),

    -- SORU 12: Spor
    (
      'Galatasaray Şampiyonlar Ligi''nde çeyrek finale kalır mı?',
      'Galatasaray Şampiyonlar Ligi''nde çeyrek final oynayacak mı?',
      spor_id,
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
      2.1,
      1.8,
      NOW() + INTERVAL '45 days',
      'active',
      false,
      true
    ),

    -- SORU 13: Müzik
    (
      'Spotify 2025''te Türkiye''de fiyat artışı yapacak mı?',
      'Spotify 2025 yılında Türkiye''de abonelik fiyatlarını artıracak mı?',
      muzik_id,
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      1.6,
      2.4,
      NOW() + INTERVAL '180 days',
      'active',
      false,
      false
    ),

    -- SORU 14: Global
    (
      '2025''te yeni bir salgın çıkacak mı?',
      '2025 yılında dünya çapında yeni bir salgın başlayacak mı?',
      global_id,
      'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&h=600&fit=crop',
      2.7,
      1.4,
      NOW() + INTERVAL '365 days',
      'active',
      false,
      false
    ),

    -- SORU 15: Magazin
    (
      '2025''te ünlü bir çift evlenecek mi?',
      '2025 yılında Türkiye''de ünlü bir çift evlenme kararı alacak mı?',
      magazin_id,
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
      1.5,
      2.5,
      NOW() + INTERVAL '365 days',
      'active',
      false,
      false
    );

  -- Her soru için istatistik kaydı oluştur (otomatik)
  INSERT INTO public.question_statistics (question_id, total_predictions, unique_users)
  SELECT id, 0, 0 FROM public.questions 
  WHERE id NOT IN (SELECT question_id FROM public.question_statistics WHERE question_id IS NOT NULL);

END $$;
