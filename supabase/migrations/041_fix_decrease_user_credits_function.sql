-- Fix decrease_user_credits function
DROP FUNCTION IF EXISTS decrease_user_credits(UUID, BIGINT);

CREATE OR REPLACE FUNCTION decrease_user_credits(
  user_id_param UUID,
  amount_param BIGINT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user has enough credits
  IF (SELECT credits FROM profiles WHERE id = user_id_param) < amount_param THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;
  
  -- Update user profile credits
  UPDATE profiles 
  SET credits = credits - amount_param
  WHERE id = user_id_param;
  
  -- Log the credit decrease (only if credit_transactions table exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'credit_transactions') THEN
    INSERT INTO credit_transactions (
      user_id,
      transaction_type,
      amount,
      description
    ) VALUES (
      user_id_param,
      'decrease',
      amount_param,
      'Kupon oluşturma'
    );
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION decrease_user_credits(UUID, BIGINT) TO authenticated;
