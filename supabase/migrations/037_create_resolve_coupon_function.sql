-- Create function to resolve coupon and award credits if won
CREATE OR REPLACE FUNCTION resolve_coupon(
  coupon_id_param UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  coupon_record RECORD;
  user_id_val UUID;
  potential_win_val BIGINT;
BEGIN
  -- Get coupon details
  SELECT user_id, potential_win, status
  INTO coupon_record
  FROM coupons
  WHERE id = coupon_id_param;
  
  -- Check if coupon exists and is won
  IF coupon_record IS NULL THEN
    RAISE EXCEPTION 'Coupon not found';
  END IF;
  
  IF coupon_record.status != 'won' THEN
    RAISE EXCEPTION 'Coupon is not won';
  END IF;
  
  -- Award credits to user
  user_id_val := coupon_record.user_id;
  potential_win_val := coupon_record.potential_win;
  
  -- Increase user credits
  UPDATE profiles 
  SET credits = credits + potential_win_val
  WHERE id = user_id_val;
  
  -- Log the credit increase
  INSERT INTO credit_transactions (
    user_id,
    transaction_type,
    amount,
    description
  ) VALUES (
    user_id_val,
    'increase',
    potential_win_val,
    'Kupon kazancı - Kupon #' || coupon_id_param
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION resolve_coupon(UUID) TO authenticated;
