-- ================================================
-- FIX LEAGUES INFINITE RECURSION
-- ================================================

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Public leagues are viewable by everyone" ON public.leagues;
DROP POLICY IF EXISTS "Members can view their leagues" ON public.leagues;

-- Create a single consolidated policy that avoids circular references
CREATE POLICY "Leagues access policy"
  ON public.leagues FOR SELECT
  USING (
    -- Public leagues are viewable by everyone
    type = 'public' 
    -- Creator can view their own leagues
    OR creator_id = auth.uid()
    -- Members can view leagues they're part of (direct check without circular reference)
    OR EXISTS (
      SELECT 1 FROM public.league_members lm
      WHERE lm.league_id = leagues.id
      AND lm.user_id = auth.uid()
      AND lm.status = 'active'
    )
  );

-- Also fix the league_members policy to avoid circular reference
DROP POLICY IF EXISTS "Users can view league members" ON public.league_members;

CREATE POLICY "League members access policy"
  ON public.league_members FOR SELECT
  USING (
    -- Users can view their own membership
    user_id = auth.uid()
    -- Or if they're the creator of the league
    OR EXISTS (
      SELECT 1 FROM public.leagues l
      WHERE l.id = league_members.league_id
      AND l.creator_id = auth.uid()
    )
    -- Or if the league is public
    OR EXISTS (
      SELECT 1 FROM public.leagues l
      WHERE l.id = league_members.league_id
      AND l.type = 'public'
    )
  );
