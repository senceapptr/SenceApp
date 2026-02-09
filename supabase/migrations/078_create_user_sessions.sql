-- =====================================================
-- USER SESSIONS TABLE
-- Kullanıcı giriş günlerini takip eder (Görevler için)
-- =====================================================

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Her kullanıcı günde bir kez kayıt
  UNIQUE(user_id, session_date)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_date ON public.user_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_date ON public.user_sessions(user_id, session_date);

-- Enable RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own sessions
CREATE POLICY "Users can read own sessions"
  ON public.user_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own sessions
CREATE POLICY "Users can insert own sessions"
  ON public.user_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- FUNCTION: Record user session on login
-- =====================================================
CREATE OR REPLACE FUNCTION public.record_user_session()
RETURNS TRIGGER AS $$
BEGIN
  -- Kullanıcı giriş yaptığında otomatik session kaydı
  INSERT INTO public.user_sessions (user_id, session_date)
  VALUES (NEW.id, CURRENT_DATE)
  ON CONFLICT (user_id, session_date) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- HELPER FUNCTION: Get user login days for a month
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_login_days(
  p_user_id UUID,
  p_year INTEGER,
  p_month INTEGER
)
RETURNS INTEGER[] AS $$
DECLARE
  login_days INTEGER[];
BEGIN
  SELECT ARRAY_AGG(EXTRACT(DAY FROM session_date)::INTEGER ORDER BY session_date)
  INTO login_days
  FROM public.user_sessions
  WHERE user_id = p_user_id
    AND EXTRACT(YEAR FROM session_date) = p_year
    AND EXTRACT(MONTH FROM session_date) = p_month;
  
  RETURN COALESCE(login_days, ARRAY[]::INTEGER[]);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- HELPER FUNCTION: Count user login days this month
-- =====================================================
CREATE OR REPLACE FUNCTION public.count_user_login_days_this_month(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.user_sessions
    WHERE user_id = p_user_id
      AND EXTRACT(YEAR FROM session_date) = EXTRACT(YEAR FROM CURRENT_DATE)
      AND EXTRACT(MONTH FROM session_date) = EXTRACT(MONTH FROM CURRENT_DATE)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
