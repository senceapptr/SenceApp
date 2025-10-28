-- Create function to decrease user credits
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
  
  -- Log the credit decrease
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
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION decrease_user_credits(UUID, BIGINT) TO authenticated;
