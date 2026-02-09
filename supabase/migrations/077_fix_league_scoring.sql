-- Fix ambiguous column reference in get_unanswered_league_questions function
-- Re-applying the function definition with explicit table aliases

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
    -- If league has no category (is null), show all questions (NOT EXISTS returns true)
    NOT EXISTS (SELECT 1 FROM public.leagues l WHERE l.id = p_league_id AND l.category_id IS NOT NULL)
    -- OR matches the specific category
    OR q.category_id = (SELECT l2.category_id FROM public.leagues l2 WHERE l2.id = p_league_id)
  )
  ORDER BY q.is_trending DESC, q.total_votes DESC, q.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
