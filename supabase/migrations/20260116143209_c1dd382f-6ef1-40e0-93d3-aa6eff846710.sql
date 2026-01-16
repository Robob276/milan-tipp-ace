-- Drop existing functions first
DROP FUNCTION IF EXISTS public.admin_upsert_result(uuid,integer,text,text,text);
DROP FUNCTION IF EXISTS public.admin_delete_result(uuid,integer);

-- Recreate admin_upsert_result with renamed parameter to avoid ambiguity
CREATE OR REPLACE FUNCTION public.admin_upsert_result(admin_player_id uuid, p_event_id integer, gold text, silver text, bronze text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF admin_player_id IS NULL THEN
    RAISE EXCEPTION 'admin_player_id is required';
  END IF;

  IF p_event_id IS NULL THEN
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
  VALUES (p_event_id, gold, silver, bronze)
  ON CONFLICT (event_id)
  DO UPDATE SET
    gold = EXCLUDED.gold,
    silver = EXCLUDED.silver,
    bronze = EXCLUDED.bronze,
    updated_at = now();
END;
$function$;

-- Recreate admin_delete_result with renamed parameter to avoid ambiguity
CREATE OR REPLACE FUNCTION public.admin_delete_result(admin_player_id uuid, p_event_id integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF admin_player_id IS NULL THEN
    RAISE EXCEPTION 'admin_player_id is required';
  END IF;

  IF p_event_id IS NULL THEN
    RAISE EXCEPTION 'event_id is required';
  END IF;

  PERFORM set_config('app.current_player_id', admin_player_id::text, true);

  IF NOT public.is_current_player_admin() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  DELETE FROM public.results
  WHERE results.event_id = p_event_id;
END;
$function$;