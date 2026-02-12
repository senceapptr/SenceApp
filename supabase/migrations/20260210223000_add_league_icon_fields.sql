ALTER TABLE public.leagues
ADD COLUMN IF NOT EXISTS icon_name TEXT NOT NULL DEFAULT 'trophy',
ADD COLUMN IF NOT EXISTS icon_color TEXT NOT NULL DEFAULT '#FFD700';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'leagues_icon_name_check'
      AND conrelid = 'public.leagues'::regclass
  ) THEN
    ALTER TABLE public.leagues
    ADD CONSTRAINT leagues_icon_name_check
    CHECK (icon_name IN ('trophy', 'flame', 'rocket', 'star', 'diamond', 'football'));
  END IF;
END;
$$;
