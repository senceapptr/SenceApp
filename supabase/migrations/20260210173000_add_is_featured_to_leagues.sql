-- Add featured flag for leagues discover feed
ALTER TABLE public.leagues
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

-- Speed up featured leagues lookup for Discover tab
CREATE INDEX IF NOT EXISTS idx_leagues_featured_public_active
ON public.leagues (created_at DESC)
WHERE type = 'public' AND status = 'active' AND is_featured = true;
