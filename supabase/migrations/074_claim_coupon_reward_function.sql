-- Create claim_coupon_reward function
-- Allows users to claim their won coupon rewards once

CREATE OR REPLACE FUNCTION claim_coupon_reward(coupon_id_param UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  coupon_record RECORD;
  current_user_id UUID;
BEGIN
  -- Get current user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Oturum açmanız gerekiyor');
  END IF;

  -- Get coupon details
  SELECT id, user_id, potential_win, status, COALESCE(is_claimed, false) as is_claimed
  INTO coupon_record 
  FROM coupons 
  WHERE id = coupon_id_param;
  
  -- Validate coupon exists
  IF coupon_record IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Kupon bulunamadı');
  END IF;
  
  -- Validate ownership
  IF coupon_record.user_id != current_user_id THEN
    RETURN json_build_object('success', false, 'error', 'Bu kupon size ait değil');
  END IF;
  
  -- Validate coupon is won
  IF coupon_record.status != 'won' THEN
    RETURN json_build_object('success', false, 'error', 'Kupon kazanılmamış');
  END IF;
  
  -- Check if already claimed
  IF coupon_record.is_claimed THEN
    RETURN json_build_object('success', false, 'error', 'Ödül zaten alınmış');
  END IF;
  
  -- Increase user credits
  UPDATE profiles 
  SET credits = COALESCE(credits, 0) + coupon_record.potential_win
  WHERE id = coupon_record.user_id;
  
  -- Mark coupon as claimed
  UPDATE coupons 
  SET is_claimed = TRUE 
  WHERE id = coupon_id_param;
  
  -- Log the transaction
  INSERT INTO credit_transactions (
    user_id,
    transaction_type,
    amount,
    description
  ) VALUES (
    coupon_record.user_id,
    'increase',
    coupon_record.potential_win,
    'Kupon ödülü - Ticket #' || coupon_id_param::text
  );
  
  RETURN json_build_object(
    'success', true, 
    'amount', coupon_record.potential_win,
    'message', 'Tebrikler! ' || coupon_record.potential_win || ' kredi hesabınıza eklendi.'
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION claim_coupon_reward(UUID) TO authenticated;

COMMENT ON FUNCTION claim_coupon_reward(UUID) IS 'Kazanan kupon ödülünü kullanıcı hesabına aktarır. Tek seferlik kullanılabilir.';
