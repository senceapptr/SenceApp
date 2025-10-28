-- Create credit_transactions table to track credit changes
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('increase', 'decrease')),
  amount BIGINT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at);

-- Enable RLS
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for users to see their own transactions (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'credit_transactions' 
    AND policyname = 'Users can view their own credit transactions'
  ) THEN
    CREATE POLICY "Users can view their own credit transactions" ON credit_transactions
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create RLS policy for service role to insert transactions (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'credit_transactions' 
    AND policyname = 'Service role can insert credit transactions'
  ) THEN
    CREATE POLICY "Service role can insert credit transactions" ON credit_transactions
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;
