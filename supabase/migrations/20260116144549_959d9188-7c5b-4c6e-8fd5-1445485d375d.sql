-- Fix ambiguous parameter name in prediction RPCs by renaming event_id -> p_event_id

-- Drop existing functions first (old signatures)
DROP FUNCTION IF EXISTS public.upsert_prediction(uuid, integer, text, text, text);
DROP FUNCTION IF EXISTS public.delete_prediction(uuid, integer);

-- Recreate upsert_prediction with renamed parameter
CREATE OR REPLACE FUNCTION public.upsert_prediction(
  player_id uuid,
  p_event_id integer,
  gold text,
  silver text,
  bronze text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF player_id IS NULL THEN
    RAISE EXCEPTION 'player_id is required';
  END IF;

  IF p_event_id IS NULL THEN
    RAISE EXCEPTION 'event_id is required';
  END IF;

  IF gold IS NULL OR silver IS NULL OR bronze IS NULL THEN
    RAISE EXCEPTION 'gold/silver/bronze are required';
  END IF;

  -- Make RLS policies that rely on current_player_id() pass in this transaction
  PERFORM set_config('app.current_player_id', player_id::text, true);

  INSERT INTO public.predictions (user_id, event_id, gold, silver, bronze)
  VALUES (player_id, p_event_id, gold, silver, bronze)
  ON CONFLICT (user_id, event_id)
  DO UPDATE SET
    gold = EXCLUDED.gold,
    silver = EXCLUDED.silver,
    bronze = EXCLUDED.bronze,
    updated_at = now();
END;
$function$;

-- Recreate delete_prediction with renamed parameter (for consistency)
CREATE OR REPLACE FUNCTION public.delete_prediction(
  player_id uuid,
  p_event_id integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF player_id IS NULL THEN
    RAISE EXCEPTION 'player_id is required';
  END IF;

  IF p_event_id IS NULL THEN
    RAISE EXCEPTION 'event_id is required';
  END IF;

  PERFORM set_config('app.current_player_id', player_id::text, true);

  DELETE FROM public.predictions
  WHERE user_id = player_id
    AND predictions.event_id = delete_prediction.p_event_id;
END;
$function$;