-- Fix search_path for current_player_id function
CREATE OR REPLACE FUNCTION public.current_player_id()
RETURNS uuid
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT NULLIF(current_setting('app.current_player_id', true), '')::uuid
$$;