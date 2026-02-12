CREATE OR REPLACE FUNCTION public.recalculate_league_prize_pool(p_league_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.leagues
  SET prize_pool = COALESCE(entry_fee, 0) * (
    SELECT COUNT(*)
    FROM public.league_members
    WHERE league_id = p_league_id
      AND status = 'active'
  )
  WHERE id = p_league_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.sync_league_member_ranks(p_league_id UUID)
RETURNS VOID AS $$
BEGIN
  WITH ranked AS (
    SELECT
      id,
      ROW_NUMBER() OVER (
        ORDER BY points DESC, correct_predictions DESC, joined_at ASC, id ASC
      ) AS calculated_rank
    FROM public.league_members
    WHERE league_id = p_league_id
      AND status = 'active'
  )
  UPDATE public.league_members lm
  SET rank = ranked.calculated_rank
  FROM ranked
  WHERE lm.id = ranked.id;

  UPDATE public.league_members
  SET rank = NULL
  WHERE league_id = p_league_id
    AND status <> 'active';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_league_membership_changes()
RETURNS TRIGGER AS $$
DECLARE
  target_league_id UUID;
BEGIN
  target_league_id := COALESCE(NEW.league_id, OLD.league_id);

  PERFORM public.recalculate_league_prize_pool(target_league_id);
  PERFORM public.sync_league_member_ranks(target_league_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_league_members_insert ON public.league_members;
DROP TRIGGER IF EXISTS trg_sync_league_members_update ON public.league_members;
DROP TRIGGER IF EXISTS trg_sync_league_members_delete ON public.league_members;

CREATE TRIGGER trg_sync_league_members_insert
AFTER INSERT ON public.league_members
FOR EACH ROW
EXECUTE FUNCTION public.handle_league_membership_changes();

CREATE TRIGGER trg_sync_league_members_update
AFTER UPDATE ON public.league_members
FOR EACH ROW
WHEN (
  OLD.status IS DISTINCT FROM NEW.status
  OR OLD.points IS DISTINCT FROM NEW.points
  OR OLD.correct_predictions IS DISTINCT FROM NEW.correct_predictions
  OR OLD.joined_at IS DISTINCT FROM NEW.joined_at
  OR OLD.league_id IS DISTINCT FROM NEW.league_id
)
EXECUTE FUNCTION public.handle_league_membership_changes();

CREATE TRIGGER trg_sync_league_members_delete
AFTER DELETE ON public.league_members
FOR EACH ROW
EXECUTE FUNCTION public.handle_league_membership_changes();

CREATE OR REPLACE FUNCTION public.handle_league_entry_fee_changes()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.recalculate_league_prize_pool(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_league_prize_on_entry_fee_update ON public.leagues;

CREATE TRIGGER trg_sync_league_prize_on_entry_fee_update
AFTER UPDATE OF entry_fee ON public.leagues
FOR EACH ROW
WHEN (OLD.entry_fee IS DISTINCT FROM NEW.entry_fee)
EXECUTE FUNCTION public.handle_league_entry_fee_changes();

DO $$
DECLARE
  league_row RECORD;
BEGIN
  FOR league_row IN SELECT id FROM public.leagues LOOP
    PERFORM public.recalculate_league_prize_pool(league_row.id);
    PERFORM public.sync_league_member_ranks(league_row.id);
  END LOOP;
END;
$$;
