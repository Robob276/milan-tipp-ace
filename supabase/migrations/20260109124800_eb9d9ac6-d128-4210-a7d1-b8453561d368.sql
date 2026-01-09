-- Create a secure function to check if player has PIN set (without exposing PIN)
CREATE OR REPLACE FUNCTION public.check_player_has_pin(player_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (pin IS NOT NULL) FROM public.players WHERE id = player_id
$$;

-- Create a secure function to set PIN for first time (only if PIN is null)
CREATE OR REPLACE FUNCTION public.setup_player_pin(
  player_id uuid,
  new_pin text
)
RETURNS TABLE (
  success boolean,
  player_name text,
  player_is_admin boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_player RECORD;
BEGIN
  -- Get player and check if PIN already set
  SELECT id, name, is_admin, pin INTO v_player
  FROM public.players
  WHERE id = player_id;
  
  IF v_player IS NULL THEN
    RETURN QUERY SELECT false, NULL::text, NULL::boolean;
    RETURN;
  END IF;
  
  IF v_player.pin IS NOT NULL THEN
    RETURN QUERY SELECT false, v_player.name, v_player.is_admin;
    RETURN;
  END IF;
  
  -- Set the PIN
  UPDATE public.players SET pin = new_pin WHERE id = player_id;
  
  RETURN QUERY SELECT true, v_player.name, v_player.is_admin;
END;
$$;