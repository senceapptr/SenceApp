-- Fix credit_transactions table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own credit transactions" ON credit_transactions;
DROP POLICY IF EXISTS "Service role can insert credit transactions" ON credit_transactions;

-- Create new policies
CREATE POLICY "Users can view their own credit transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert credit transactions" ON credit_transactions
  FOR INSERT WITH CHECK (true);
