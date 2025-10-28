-- Create function to get user coupons with selections (RLS bypass)
CREATE OR REPLACE FUNCTION get_user_coupons_with_selections(user_id_param UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  coupon_code TEXT,
  total_odds NUMERIC,
  stake_amount INTEGER,
  potential_win INTEGER,
  status TEXT,
  selections_count INTEGER,
  correct_selections INTEGER,
  created_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  display_id BIGINT,
  coupon_selections JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER -- RLS bypass
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.user_id,
    c.coupon_code,
    c.total_odds,
    c.stake_amount,
    c.potential_win,
    c.status,
    c.selections_count,
    c.correct_selections,
    c.created_at,
    c.resolved_at,
    c.display_id,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', cs.id,
            'question_id', cs.question_id,
            'vote', cs.vote,
            'odds', cs.odds,
            'status', cs.status,
            'questions', jsonb_build_object(
              'id', q.id,
              'title', q.title,
              'category_id', q.category_id,
              'status', q.status,
              'result', q.result,
              'categories', jsonb_build_object(
                'id', cat.id,
                'name', cat.name
              )
            )
          )
        )
        FROM coupon_selections cs
        LEFT JOIN questions q ON cs.question_id = q.id
        LEFT JOIN categories cat ON q.category_id = cat.id
        WHERE cs.coupon_id = c.id
      ),
      '[]'::jsonb
    ) as coupon_selections
  FROM coupons c
  WHERE c.user_id = user_id_param
  ORDER BY c.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_coupons_with_selections(UUID) TO authenticated;
