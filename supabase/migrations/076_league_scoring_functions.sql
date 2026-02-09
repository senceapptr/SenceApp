-- ================================================
-- SENCE LEAGUES 2.0 - Scoring Functions
-- Fair scoring algorithm: High odds = High reward, Low penalty
-- ================================================

-- Calculate points for a vote based on odds
-- WIN: Points scale with odds (sürpriz bilmek = yüksek ödül)
-- LOSE: Penalty inversely scales with odds (cesur tahmin = düşük ceza)
CREATE OR REPLACE FUNCTION calculate_league_vote_points(
  p_vote TEXT,
  p_result TEXT,
  p_odds DECIMAL
) RETURNS INTEGER AS $$
DECLARE
  base_points INTEGER := 100;
  calculated INTEGER;
BEGIN
  -- Skip votes get 0 points
  IF p_vote = 'skip' THEN
    RETURN 0;
  END IF;

  IF p_vote = p_result THEN
    -- WIN: Points scale with odds
    -- 2.0x = 200 points, 6.0x = 600 points
    calculated := ROUND(base_points * p_odds);
  ELSE
    -- LOSE: Penalty inversely scales with odds
    -- 2.0x = -50 points, 6.0x = -17 points
    -- Higher odds = braver guess = lower penalty
    calculated := ROUND(-base_points / p_odds);
  END IF;

  RETURN calculated;
END;
$$ LANGUAGE plpgsql;

-- Resolve all pending votes for a question when it gets resolved
CREATE OR REPLACE FUNCTION resolve_league_votes_for_question(
  p_question_id UUID,
  p_result TEXT
) RETURNS INTEGER AS $$
DECLARE
  vote_record RECORD;
  points INTEGER;
  resolved_count INTEGER := 0;
BEGIN
  FOR vote_record IN 
    SELECT * FROM public.league_votes 
    WHERE question_id = p_question_id 
    AND status = 'pending'
    AND vote != 'skip'
  LOOP
    -- Calculate points
    points := calculate_league_vote_points(vote_record.vote, p_result, vote_record.odds_at_vote);
    
    -- Update the vote record
    UPDATE public.league_votes
    SET 
      status = CASE WHEN vote_record.vote = p_result THEN 'won' ELSE 'lost' END,
      points_earned = points,
      resolved_at = NOW()
    WHERE id = vote_record.id;

    -- Update league_members points and stats
    UPDATE public.league_members
    SET 
      points = GREATEST(0, points + points), -- Prevent negative total
      correct_predictions = correct_predictions + CASE WHEN vote_record.vote = p_result THEN 1 ELSE 0 END,
      total_predictions = total_predictions + 1
    WHERE league_id = vote_record.league_id 
    AND user_id = vote_record.user_id;

    resolved_count := resolved_count + 1;
  END LOOP;

  -- Also mark skipped votes as resolved
  UPDATE public.league_votes
  SET 
    status = 'skipped',
    resolved_at = NOW()
  WHERE question_id = p_question_id 
  AND status = 'pending'
  AND vote = 'skip';

  RETURN resolved_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-resolve league votes when a question is resolved
CREATE OR REPLACE FUNCTION auto_resolve_league_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'resolved' AND NEW.result IS NOT NULL THEN
    PERFORM resolve_league_votes_for_question(NEW.id, NEW.result);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists and create new one
DROP TRIGGER IF EXISTS trigger_resolve_league_votes ON public.questions;

CREATE TRIGGER trigger_resolve_league_votes
  AFTER UPDATE ON public.questions
  FOR EACH ROW
  WHEN (OLD.status != 'resolved' AND NEW.status = 'resolved')
  EXECUTE FUNCTION auto_resolve_league_votes();

-- Function to get unanswered questions for a user in a league
CREATE OR REPLACE FUNCTION get_unanswered_league_questions(
  p_league_id UUID,
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20
) RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  image_url TEXT,
  yes_odds DECIMAL,
  no_odds DECIMAL,
  total_votes INTEGER,
  yes_percentage DECIMAL,
  no_percentage DECIMAL,
  end_date TIMESTAMPTZ,
  category_name TEXT,
  category_icon TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    q.id,
    q.title,
    q.description,
    q.image_url,
    q.yes_odds,
    q.no_odds,
    q.total_votes,
    q.yes_percentage,
    q.no_percentage,
    q.end_date,
    c.name as category_name,
    c.icon as category_icon
  FROM public.questions q
  LEFT JOIN public.categories c ON q.category_id = c.id
  WHERE q.status = 'active'
  AND q.end_date > NOW()
  AND NOT EXISTS (
    SELECT 1 FROM public.league_votes lv
    WHERE lv.question_id = q.id
    AND lv.user_id = p_user_id
    AND lv.league_id = p_league_id
  )
  -- Only get questions that match league categories (if league has a category)
  AND (
    NOT EXISTS (SELECT 1 FROM public.leagues l WHERE l.id = p_league_id AND l.category_id IS NOT NULL)
    OR q.category_id = (SELECT category_id FROM public.leagues l2 WHERE l2.id = p_league_id)
  )
  ORDER BY q.is_trending DESC, q.total_votes DESC, q.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
