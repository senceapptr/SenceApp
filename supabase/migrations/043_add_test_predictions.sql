-- Test için bazı predictions ekle (sadece active sorular için)
-- Bu sayede vote counts gerçek verilerle görünecek

DO $$
DECLARE
  v_question RECORD;
  v_user_id UUID;
  v_prediction_count INT;
BEGIN
  -- İlk kullanıcıyı al (veya admin kullanıcısını)
  SELECT id INTO v_user_id FROM profiles LIMIT 1;
  
  -- Eğer hiç kullanıcı yoksa, devam etme
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'No users found, skipping test predictions';
    RETURN;
  END IF;

  -- Her active soru için random predictions ekle
  FOR v_question IN 
    SELECT id FROM questions WHERE status = 'active' LIMIT 20
  LOOP
    -- Her soru için 50-500 arası random prediction sayısı
    v_prediction_count := 50 + floor(random() * 450)::int;
    
    -- Predictions ekle
    FOR i IN 1..v_prediction_count LOOP
      BEGIN
        INSERT INTO predictions (
          user_id,
          question_id,
          vote,
          odds,
          amount,
          potential_win,
          status,
          created_at
        ) VALUES (
          v_user_id,
          v_question.id,
          CASE WHEN random() < 0.5 THEN 'yes' ELSE 'no' END,
          1.5 + (random() * 2.5), -- 1.5 - 4.0 arası odds
          10 + floor(random() * 990)::int, -- 10 - 1000 arası miktar
          50 + floor(random() * 2950)::int, -- 50 - 3000 arası kazanç
          'pending',
          NOW() - (random() * interval '30 days') -- Son 30 gün içinde random tarih
        );
      EXCEPTION
        WHEN OTHERS THEN
          -- Hata olursa devam et
          CONTINUE;
      END;
    END LOOP;
    
    RAISE NOTICE 'Added % predictions for question %', v_prediction_count, v_question.id;
  END LOOP;
  
  RAISE NOTICE 'Test predictions added successfully';
END $$;

-- Vote counts'ları manuel olarak güncelle (trigger otomatik yapacak ama emin olalım)
SELECT update_question_vote_counts_for_question(id) FROM questions WHERE status = 'active';

-- Sonuçları göster
SELECT 
  id,
  title,
  total_votes,
  yes_votes,
  no_votes,
  yes_percentage,
  no_percentage
FROM questions 
WHERE status = 'active' AND total_votes > 0
ORDER BY total_votes DESC
LIMIT 10;

