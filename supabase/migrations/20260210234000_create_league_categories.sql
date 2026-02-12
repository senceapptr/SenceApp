CREATE TABLE IF NOT EXISTS public.league_categories (
  league_id UUID NOT NULL REFERENCES public.leagues(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT league_categories_unique UNIQUE (league_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_league_categories_league_id
ON public.league_categories (league_id);

CREATE INDEX IF NOT EXISTS idx_league_categories_category_id
ON public.league_categories (category_id);
