-- =====================================================
-- USER DAILY GAMES TABLE
-- Game Hub için günlük oyun durumlarını takip eder
-- =====================================================

-- Drop if exists (for development)
DROP TABLE IF EXISTS user_daily_games;

-- Create user_daily_games table
CREATE TABLE user_daily_games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  
  -- Daily Spin State
  daily_spin_used BOOLEAN DEFAULT FALSE,
  daily_spin_reward INTEGER DEFAULT 0,
  
  -- Zip Game State
  zip_completed BOOLEAN DEFAULT FALSE,
  zip_reward INTEGER DEFAULT 0,
  
  -- Higher/Lower Game State
  higher_lower_completed BOOLEAN DEFAULT FALSE,
  higher_lower_reward INTEGER DEFAULT 0,
  
  -- Daily Progress (0-3)
  daily_progress INTEGER DEFAULT 0 CHECK (daily_progress >= 0 AND daily_progress <= 3),
  
  -- Daily Bonus (when 3/3 completed)
  daily_bonus_claimed BOOLEAN DEFAULT FALSE,
  daily_bonus_amount INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Unique constraint: one record per user per day
  UNIQUE(user_id, date)
);

-- Create indexes for faster queries
CREATE INDEX idx_user_daily_games_user_id ON user_daily_games(user_id);
CREATE INDEX idx_user_daily_games_date ON user_daily_games(date);
CREATE INDEX idx_user_daily_games_user_date ON user_daily_games(user_id, date);

-- Enable RLS
ALTER TABLE user_daily_games ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own daily game records
CREATE POLICY "Users can read own daily games"
  ON user_daily_games FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own daily game records
CREATE POLICY "Users can insert own daily games"
  ON user_daily_games FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own daily game records
CREATE POLICY "Users can update own daily games"
  ON user_daily_games FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger to update updated_at on row update
CREATE OR REPLACE FUNCTION update_user_daily_games_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_daily_games_updated_at
  BEFORE UPDATE ON user_daily_games
  FOR EACH ROW
  EXECUTE FUNCTION update_user_daily_games_updated_at();

-- =====================================================
-- GAME HUB REWARD CONSTANTS
-- Oyun ödül değerlerini saklayan tablo (opsiyonel, config için)
-- =====================================================

-- Comment for reference (values used in gamehub.service.ts):
-- Daily Spin: 50-500 random coins
-- Zip Complete: 100 coins
-- Higher/Lower Complete: 100 coins
-- Daily Bonus (3/3): 200 coins extra
