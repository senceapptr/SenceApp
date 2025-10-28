-- Create function to increase user credits
CREATE OR REPLACE FUNCTION increase_user_credits(
  user_id_param UUID,
  amount_param BIGINT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update user profile credits
  UPDATE profiles 
  SET credits = credits + amount_param
  WHERE id = user_id_param;
  
  -- Log the credit increase
  INSERT INTO credit_transactions (
    user_id,
    transaction_type,
    amount,
    description
  ) VALUES (
    user_id_param,
    'increase',
    amount_param,
    'Kupon kazancı'
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increase_user_credits(UUID, BIGINT) TO authenticated;
