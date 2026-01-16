-- Add RPC functions to persist predictions/results without relying on per-request session GUCs

CREATE OR REPLACE FUNCTION public.upsert_prediction(
  player_id uuid,
  event_id integer,
  gold text,
  silver text,
  bronze text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Basic validation
  IF player_id IS NULL THEN
    RAISE EXCEPTION 'player_id is required';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.players p WHERE p.id = player_id) THEN
    RAISE EXCEPTION 'player not found';
  END IF;

  IF event_id IS NULL THEN
    RAISE EXCEPTION 'event_id is required';
  END IF;

  IF gold IS NULL OR silver IS NULL OR bronze IS NULL THEN
    RAISE EXCEPTION 'gold/silver/bronze are required';
  END IF;

  INSERT INTO public.predictions (user_id, event_id, gold, silver, bronze)
  VALUES (player_id, event_id, gold, silver, bronze)
  ON CONFLICT (user_id, event_id)
  DO UPDATE SET
    gold = EXCLUDED.gold,
    silver = EXCLUDED.silver,
    bronze = EXCLUDED.bronze,
    updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_prediction(
  player_id uuid,
  event_id integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF player_id IS NULL THEN
    RAISE EXCEPTION 'player_id is required';
  END IF;

  IF event_id IS NULL THEN
    RAISE EXCEPTION 'event_id is required';
  END IF;

  DELETE FROM public.predictions
  WHERE user_id = player_id
    AND predictions.event_id = delete_prediction.event_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_upsert_result(
  admin_player_id uuid,
  event_id integer,
  gold text,
  silver text,
  bronze text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF admin_player_id IS NULL THEN
    RAISE EXCEPTION 'admin_player_id is required';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.players p
    WHERE p.id = admin_player_id
      AND p.is_admin = true
  ) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  IF event_id IS NULL THEN
    RAISE EXCEPTION 'event_id is required';
  END IF;

  IF gold IS NULL OR silver IS NULL OR bronze IS NULL THEN
    RAISE EXCEPTION 'gold/silver/bronze are required';
  END IF;

  INSERT INTO public.results (event_id, gold, silver, bronze)
  VALUES (event_id, gold, silver, bronze)
  ON CONFLICT (event_id)
  DO UPDATE SET
    gold = EXCLUDED.gold,
    silver = EXCLUDED.silver,
    bronze = EXCLUDED.bronze,
    updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_result(
  admin_player_id uuid,
  event_id integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF admin_player_id IS NULL THEN
    RAISE EXCEPTION 'admin_player_id is required';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.players p
    WHERE p.id = admin_player_id
      AND p.is_admin = true
  ) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  IF event_id IS NULL THEN
    RAISE EXCEPTION 'event_id is required';
  END IF;

  DELETE FROM public.results
  WHERE results.event_id = admin_delete_result.event_id;
END;
$$;

-- Allow the frontend (anon) to call these RPCs
GRANT EXECUTE ON FUNCTION public.upsert_prediction(uuid, integer, text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.upsert_prediction(uuid, integer, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_prediction(uuid, integer) TO anon;
GRANT EXECUTE ON FUNCTION public.delete_prediction(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_upsert_result(uuid, integer, text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_upsert_result(uuid, integer, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_result(uuid, integer) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_result(uuid, integer) TO authenticated;