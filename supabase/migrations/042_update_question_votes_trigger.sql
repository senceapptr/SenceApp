-- Trigger ve function oluştur: predictions tablosuna insert/update/delete olduğunda questions tablosundaki oy sayılarını güncelle

-- Function: Oy sayılarını ve yüzdeleri güncelle
CREATE OR REPLACE FUNCTION update_question_vote_counts()
RETURNS TRIGGER AS $$
DECLARE
  v_total_votes BIGINT;
  v_yes_votes BIGINT;
  v_no_votes BIGINT;
  v_yes_percentage NUMERIC;
  v_no_percentage NUMERIC;
  v_total_amount BIGINT;
BEGIN
  -- Hangi question_id için güncelleme yapılacak?
  DECLARE
    target_question_id UUID;
  BEGIN
    -- INSERT veya UPDATE için NEW kullan
    IF (TG_OP = 'DELETE') THEN
      target_question_id := OLD.question_id;
    ELSE
      target_question_id := NEW.question_id;
    END IF;

    -- İlgili soruya ait tüm predictions'ları say ve topla
    SELECT 
      COUNT(*),
      COUNT(*) FILTER (WHERE vote = 'yes'),
      COUNT(*) FILTER (WHERE vote = 'no'),
      COALESCE(SUM(amount), 0)
    INTO 
      v_total_votes,
      v_yes_votes,
      v_no_votes,
      v_total_amount
    FROM predictions
    WHERE question_id = target_question_id
    AND status != 'cancelled'; -- İptal edilmiş tahminler sayılmasın

    -- Yüzdeleri hesapla
    IF v_total_votes > 0 THEN
      v_yes_percentage := ROUND((v_yes_votes::NUMERIC / v_total_votes::NUMERIC) * 100, 2);
      v_no_percentage := ROUND((v_no_votes::NUMERIC / v_total_votes::NUMERIC) * 100, 2);
    ELSE
      v_yes_percentage := 0;
      v_no_percentage := 0;
    END IF;

    -- Questions tablosunu güncelle
    UPDATE questions
    SET 
      total_votes = v_total_votes,
      yes_votes = v_yes_votes,
      no_votes = v_no_votes,
      yes_percentage = v_yes_percentage,
      no_percentage = v_no_percentage,
      total_amount = v_total_amount,
      updated_at = NOW()
    WHERE id = target_question_id;

  END;

  -- Trigger için return değeri
  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger: predictions tablosunda INSERT olduğunda
DROP TRIGGER IF EXISTS trigger_prediction_insert_update_votes ON predictions;
CREATE TRIGGER trigger_prediction_insert_update_votes
  AFTER INSERT ON predictions
  FOR EACH ROW
  EXECUTE FUNCTION update_question_vote_counts();

-- Trigger: predictions tablosunda UPDATE olduğunda
DROP TRIGGER IF EXISTS trigger_prediction_update_update_votes ON predictions;
CREATE TRIGGER trigger_prediction_update_update_votes
  AFTER UPDATE ON predictions
  FOR EACH ROW
  EXECUTE FUNCTION update_question_vote_counts();

-- Trigger: predictions tablosunda DELETE olduğunda
DROP TRIGGER IF EXISTS trigger_prediction_delete_update_votes ON predictions;
CREATE TRIGGER trigger_prediction_delete_update_votes
  AFTER DELETE ON predictions
  FOR EACH ROW
  EXECUTE FUNCTION update_question_vote_counts();

-- Helper function: Belirli bir soru için oy sayılarını güncelle
CREATE OR REPLACE FUNCTION update_question_vote_counts_for_question(target_question_id UUID)
RETURNS VOID AS $$
DECLARE
  v_total_votes BIGINT;
  v_yes_votes BIGINT;
  v_no_votes BIGINT;
  v_yes_percentage NUMERIC;
  v_no_percentage NUMERIC;
  v_total_amount BIGINT;
BEGIN
  -- İlgili soruya ait tüm predictions'ları say ve topla
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE vote = 'yes'),
    COUNT(*) FILTER (WHERE vote = 'no'),
    COALESCE(SUM(amount), 0)
  INTO 
    v_total_votes,
    v_yes_votes,
    v_no_votes,
    v_total_amount
  FROM predictions
  WHERE question_id = target_question_id
  AND status != 'cancelled';

  -- Yüzdeleri hesapla
  IF v_total_votes > 0 THEN
    v_yes_percentage := ROUND((v_yes_votes::NUMERIC / v_total_votes::NUMERIC) * 100, 2);
    v_no_percentage := ROUND((v_no_votes::NUMERIC / v_total_votes::NUMERIC) * 100, 2);
  ELSE
    v_yes_percentage := 0;
    v_no_percentage := 0;
  END IF;

  -- Questions tablosunu güncelle
  UPDATE questions
  SET 
    total_votes = v_total_votes,
    yes_votes = v_yes_votes,
    no_votes = v_no_votes,
    yes_percentage = v_yes_percentage,
    no_percentage = v_no_percentage,
    total_amount = v_total_amount,
    updated_at = NOW()
  WHERE id = target_question_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION update_question_vote_counts_for_question(UUID) TO authenticated;

-- Mevcut predictions'ları kullanarak tüm soruların oy sayılarını güncelle
DO $$
DECLARE
  question_record RECORD;
BEGIN
  FOR question_record IN SELECT DISTINCT question_id FROM predictions
  LOOP
    PERFORM update_question_vote_counts_for_question(question_record.question_id);
  END LOOP;
  
  RAISE NOTICE 'Vote counts updated for all questions with predictions';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error updating vote counts: %', SQLERRM;
END $$;

-- Comment
COMMENT ON FUNCTION update_question_vote_counts() IS 'Automatically updates vote counts and percentages in questions table when predictions are inserted/updated/deleted';
COMMENT ON FUNCTION update_question_vote_counts_for_question(UUID) IS 'Manually updates vote counts for a specific question';

