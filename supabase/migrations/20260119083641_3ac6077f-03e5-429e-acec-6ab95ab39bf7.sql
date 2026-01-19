-- Fix verify_player_pin to use extensions.crypt
CREATE OR REPLACE FUNCTION public.verify_player_pin(player_id uuid, pin_attempt text)
 RETURNS TABLE(id uuid, name text, is_admin boolean, valid boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.is_admin,
    (p.pin_hash IS NOT NULL AND p.pin_hash = extensions.crypt(pin_attempt, p.pin_hash)) as valid
  FROM public.players p
  WHERE p.id = player_id;
END;
$function$;

-- Fix setup_player_pin to use extensions.crypt and extensions.gen_salt
CREATE OR REPLACE FUNCTION public.setup_player_pin(player_id uuid, new_pin text)
 RETURNS TABLE(success boolean, player_name text, player_is_admin boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_player RECORD;
BEGIN
  -- Get player and check if PIN already set
  SELECT p.id, p.name, p.is_admin, p.pin_hash INTO v_player
  FROM public.players p
  WHERE p.id = player_id;
  
  IF v_player IS NULL THEN
    RETURN QUERY SELECT false, NULL::text, NULL::boolean;
    RETURN;
  END IF;
  
  IF v_player.pin_hash IS NOT NULL THEN
    RETURN QUERY SELECT false, v_player.name, v_player.is_admin;
    RETURN;
  END IF;
  
  -- Set the hashed PIN using extensions schema
  UPDATE public.players 
  SET pin_hash = extensions.crypt(new_pin, extensions.gen_salt('bf', 10)),
      pin = NULL
  WHERE players.id = player_id;
  
  RETURN QUERY SELECT true, v_player.name, v_player.is_admin;
END;
$function$;