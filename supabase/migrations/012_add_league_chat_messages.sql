-- ================================================
-- LEAGUE CHAT MESSAGES TABLE
-- ================================================

-- Lig chat mesajları tablosu
CREATE TABLE public.league_chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID REFERENCES public.leagues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_league_chat_messages_league_id ON public.league_chat_messages(league_id);
CREATE INDEX idx_league_chat_messages_user_id ON public.league_chat_messages(user_id);
CREATE INDEX idx_league_chat_messages_created_at ON public.league_chat_messages(created_at DESC);

-- RLS Policies
ALTER TABLE public.league_chat_messages ENABLE ROW LEVEL SECURITY;

-- Chat messages policies
CREATE POLICY "League chat messages are viewable by league members" ON public.league_chat_messages
  FOR SELECT USING (
    -- Sadece lig üyeleri chat mesajlarını görebilir
    EXISTS (
      SELECT 1 FROM public.league_members lm
      WHERE lm.league_id = league_chat_messages.league_id
      AND lm.user_id = auth.uid()
      AND lm.status = 'active'
    )
  );

CREATE POLICY "League members can insert chat messages" ON public.league_chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.league_members lm
      WHERE lm.league_id = league_chat_messages.league_id
      AND lm.user_id = auth.uid()
      AND lm.status = 'active'
    )
  );

CREATE POLICY "Users can update their own chat messages" ON public.league_chat_messages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat messages" ON public.league_chat_messages
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_league_chat_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE TRIGGER update_league_chat_messages_updated_at_trigger
  BEFORE UPDATE ON public.league_chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_league_chat_messages_updated_at();

-- Add some test chat messages
WITH test_leagues AS (
  SELECT id, name FROM public.leagues 
  WHERE name IN ('Futbol Ligi 2024', 'Basketbol Şampiyonası')
  LIMIT 2
),
test_users AS (
  SELECT id, username FROM public.profiles 
  LIMIT 3
)
INSERT INTO public.league_chat_messages (
  id,
  league_id,
  user_id,
  message,
  created_at
)
SELECT 
  gen_random_uuid(),
  tl.id,
  tu.id,
  CASE 
    WHEN tu.username IS NOT NULL THEN 'Merhaba! Bu ligde nasıl başarılı olabiliriz?'
    ELSE 'Hoş geldiniz! Başarılar dilerim.'
  END,
  now() - (random() * interval '1 hour')
FROM test_leagues tl
CROSS JOIN test_users tu
WHERE tu.id IS NOT NULL
LIMIT 6;
