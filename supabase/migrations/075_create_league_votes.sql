-- ================================================
-- SENCE LEAGUES 2.0 - League Votes Table
-- Stores swipe-based predictions for leagues
-- ================================================

-- League Votes table
CREATE TABLE public.league_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID REFERENCES public.leagues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('yes', 'no', 'skip')),
  odds_at_vote DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'skipped')),
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  UNIQUE(league_id, user_id, question_id)
);

-- Indexes for performance
CREATE INDEX idx_league_votes_league ON public.league_votes(league_id);
CREATE INDEX idx_league_votes_user ON public.league_votes(user_id);
CREATE INDEX idx_league_votes_question ON public.league_votes(question_id);
CREATE INDEX idx_league_votes_status ON public.league_votes(status);
CREATE INDEX idx_league_votes_user_league ON public.league_votes(user_id, league_id);

-- RLS Policies
ALTER TABLE public.league_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own votes"
ON public.league_votes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view all votes in their leagues"
ON public.league_votes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.league_members
    WHERE league_members.league_id = league_votes.league_id
    AND league_members.user_id = auth.uid()
    AND league_members.status = 'active'
  )
);

CREATE POLICY "Users can insert their own votes"
ON public.league_votes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pending votes"
ON public.league_votes FOR DELETE
USING (auth.uid() = user_id AND status = 'pending');
