-- Fix RPCs to work with existing RLS by setting app.current_player_id inside the same transaction

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
  IF player_id IS NULL THEN
    RAISE EXCEPTION 'player_id is required';
  END IF;

  IF event_id IS NULL THEN
    RAISE EXCEPTION 'event_id is required';
  END IF;

  IF gold IS NULL OR silver IS NULL OR bronze IS NULL THEN
    RAISE EXCEPTION 'gold/silver/bronze are required';
  END IF;

  -- Make RLS policies that rely on current_player_id() pass in this transaction
  PERFORM set_config('app.current_player_id', player_id::text, true);

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

  PERFORM set_config('app.current_player_id', player_id::text, true);

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

  IF event_id IS NULL THEN
    RAISE EXCEPTION 'event_id is required';
  END IF;

  IF gold IS NULL OR silver IS NULL OR bronze IS NULL THEN
    RAISE EXCEPTION 'gold/silver/bronze are required';
  END IF;

  -- Make current_player_id() available for RLS checks
  PERFORM set_config('app.current_player_id', admin_player_id::text, true);

  -- Reuse existing admin check logic
  IF NOT public.is_current_player_admin() THEN
    RAISE EXCEPTION 'not authorized';
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

  IF event_id IS NULL THEN
    RAISE EXCEPTION 'event_id is required';
  END IF;

  PERFORM set_config('app.current_player_id', admin_player_id::text, true);

  IF NOT public.is_current_player_admin() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  DELETE FROM public.results
  WHERE results.event_id = admin_delete_result.event_id;
END;
$$;