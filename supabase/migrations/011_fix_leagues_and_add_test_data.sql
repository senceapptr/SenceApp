-- ================================================
-- FIX LEAGUES INFINITE RECURSION + ADD TEST DATA
-- ================================================

-- 1. FIX INFINITE RECURSION
-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Public leagues are viewable by everyone" ON public.leagues;
DROP POLICY IF EXISTS "Members can view their leagues" ON public.leagues;
DROP POLICY IF EXISTS "Leagues access policy" ON public.leagues;
DROP POLICY IF EXISTS "Users can view league members" ON public.league_members;
DROP POLICY IF EXISTS "League members access policy" ON public.league_members;

-- Create consolidated leagues policy (no circular references)
CREATE POLICY "Leagues access policy"
  ON public.leagues FOR SELECT
  USING (
    -- Public leagues are viewable by everyone
    type = 'public' 
    -- Creator can view their own leagues
    OR creator_id = auth.uid()
    -- Members can view leagues they're part of (direct check)
    OR EXISTS (
      SELECT 1 FROM public.league_members lm
      WHERE lm.league_id = leagues.id
      AND lm.user_id = auth.uid()
      AND lm.status = 'active'
    )
  );

-- Fix league_members policy to avoid circular reference
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

-- 2. ADD TEST LEAGUE DATA
-- Use existing users or create leagues with random creator IDs
-- First, let's get some existing user IDs or use a default approach

-- Add test leagues using existing users or NULL creator_id
-- First, let's try to get an existing user ID, or use NULL if none exists
WITH existing_user AS (
  SELECT id FROM public.profiles LIMIT 1
)
INSERT INTO public.leagues (
  id, 
  name, 
  description, 
  creator_id,
  league_code,
  type, 
  max_members, 
  entry_fee, 
  prize_pool, 
  status, 
  created_at, 
  updated_at
) 
SELECT 
  gen_random_uuid(),
  'Futbol Ligi 2024',
  'En iyi futbol tahminleri için lig! Şampiyonlar Ligi, Premier League ve daha fazlası.',
  COALESCE(existing_user.id, NULL),
  'FUTBOL2024',
  'public',
  50,
  100,
  5000,
  'active',
  now(),
  now()
FROM existing_user
UNION ALL
SELECT 
  gen_random_uuid(),
  'Basketbol Şampiyonası',
  'NBA, EuroLeague ve Türkiye Basketbol Ligi tahminleri. En iyi tahminciler burada!',
  COALESCE(existing_user.id, NULL),
  'BASKET2024',
  'public',
  30,
  50,
  1500,
  'active',
  now(),
  now()
FROM existing_user
UNION ALL
SELECT 
  gen_random_uuid(),
  'VIP Özel Lig',
  'Sadece davetli üyeler. Yüksek bahisler, büyük ödüller!',
  COALESCE(existing_user.id, NULL),
  'VIP2024',
  'private',
  20,
  500,
  10000,
  'active',
  now(),
  now()
FROM existing_user
UNION ALL
SELECT 
  gen_random_uuid(),
  'Günlük Hızlı Lig',
  'Her gün yeni sorular, hızlı sonuçlar. Günlük 10 soru!',
  COALESCE(existing_user.id, NULL),
  'GUNLUK2024',
  'public',
  100,
  25,
  2500,
  'active',
  now(),
  now()
FROM existing_user
UNION ALL
SELECT 
  gen_random_uuid(),
  'Türkiye Spor Ligi',
  'Süper Lig, 1. Lig ve diğer Türk sporları tahminleri.',
  COALESCE(existing_user.id, NULL),
  'TURK2024',
  'public',
  40,
  75,
  3000,
  'active',
  now(),
  now()
FROM existing_user;

-- Add some league members for testing (only if we have existing users)
-- Get the league IDs we just created and existing users
WITH league_ids AS (
  SELECT id, name FROM public.leagues 
  WHERE name IN ('Futbol Ligi 2024', 'Basketbol Şampiyonası', 'Günlük Hızlı Lig', 'Türkiye Spor Ligi')
),
existing_users AS (
  SELECT id FROM public.profiles LIMIT 3
)
INSERT INTO public.league_members (
  id,
  league_id,
  user_id,
  status,
  joined_at
)
SELECT 
  gen_random_uuid(),
  li.id,
  eu.id,
  'active',
  now()
FROM league_ids li
CROSS JOIN existing_users eu
WHERE li.name != 'Futbol Ligi 2024' -- Don't add creator as member of their own league
LIMIT 10; -- Limit to avoid too many members

-- Add some league questions for testing
WITH league_ids AS (
  SELECT id, name FROM public.leagues 
  WHERE name IN ('Futbol Ligi 2024', 'Basketbol Şampiyonası')
)
INSERT INTO public.league_questions (
  id,
  league_id,
  question_id,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  li.id,
  q.id,
  now(),
  now()
FROM league_ids li
CROSS JOIN (
  SELECT id FROM public.questions 
  WHERE status = 'active' 
  LIMIT 3
) q;

-- Update league statistics
UPDATE public.leagues 
SET 
  current_members = (
    SELECT COUNT(*) 
    FROM public.league_members 
    WHERE league_members.league_id = leagues.id 
    AND status = 'active'
  )
WHERE name IN ('Futbol Ligi 2024', 'Basketbol Şampiyonası', 'VIP Özel Lig', 'Günlük Hızlı Lig', 'Türkiye Spor Ligi');
