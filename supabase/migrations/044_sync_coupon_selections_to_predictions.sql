-- Mevcut coupon_selections'ları predictions tablosuna senkronize et
-- Bu sayede eski kuponlar da vote counts'a dahil olur

DO $$
DECLARE
  selection_record RECORD;
  v_coupon RECORD;
  v_amount_per_question BIGINT;
BEGIN
  -- Her coupon_selection için
  FOR selection_record IN 
    SELECT 
      cs.*,
      c.user_id,
      c.stake_amount,
      c.selections_count
    FROM coupon_selections cs
    JOIN coupons c ON cs.coupon_id = c.id
    WHERE cs.status != 'cancelled'
  LOOP
    -- Her soru için payı hesapla
    v_amount_per_question := FLOOR(selection_record.stake_amount::NUMERIC / selection_record.selections_count::NUMERIC);
    
    -- Eğer bu prediction zaten yoksa ekle
    IF NOT EXISTS (
      SELECT 1 FROM predictions 
      WHERE user_id = selection_record.user_id 
      AND question_id = selection_record.question_id
      AND created_at = (SELECT created_at FROM coupon_selections WHERE id = selection_record.id)
    ) THEN
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
          selection_record.user_id,
          selection_record.question_id,
          selection_record.vote,
          selection_record.odds,
          v_amount_per_question,
          FLOOR(v_amount_per_question * selection_record.odds),
          selection_record.status,
          (SELECT created_at FROM coupon_selections WHERE id = selection_record.id)
        );
        
        RAISE NOTICE 'Added prediction for question % from coupon selection %', 
          selection_record.question_id, selection_record.id;
      EXCEPTION
        WHEN unique_violation THEN
          -- Zaten varsa geç
          RAISE NOTICE 'Prediction already exists for question %', selection_record.question_id;
        WHEN OTHERS THEN
          RAISE NOTICE 'Error adding prediction: %', SQLERRM;
      END;
    END IF;
  END LOOP;
  
  -- Tüm soruların vote counts'larını güncelle
  PERFORM update_question_vote_counts_for_question(id) 
  FROM questions 
  WHERE status = 'active';
  
  RAISE NOTICE 'Coupon selections synced to predictions successfully';
END $$;

-- Sonuçları göster
SELECT 
  q.id,
  q.title,
  q.total_votes,
  q.yes_votes,
  q.no_votes,
  q.total_amount
FROM questions q
WHERE q.status = 'active' AND q.total_votes > 0
ORDER BY q.total_votes DESC
LIMIT 10;

