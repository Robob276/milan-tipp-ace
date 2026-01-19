-- Enable pgcrypto extension for secure hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add a new column for hashed PINs
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS pin_hash TEXT;

-- Migrate existing PINs to hashed format (one-way hash with salt)
UPDATE public.players 
SET pin_hash = crypt(pin, gen_salt('bf', 10))
WHERE pin IS NOT NULL AND pin_hash IS NULL;

-- Update the SELECT policy to deny access to the table directly
-- (users should only access through views)
DROP POLICY IF EXISTS "Players can view own record" ON public.players;

-- Create a restrictive SELECT policy that blocks direct access
CREATE POLICY "No direct table access"
  ON public.players FOR SELECT
  USING (false);

-- Update verify_player_pin to use hashed comparison
CREATE OR REPLACE FUNCTION public.verify_player_pin(player_id uuid, pin_attempt text)
 RETURNS TABLE(id uuid, name text, is_admin boolean, valid boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.is_admin,
    (p.pin_hash IS NOT NULL AND p.pin_hash = crypt(pin_attempt, p.pin_hash)) as valid
  FROM public.players p
  WHERE p.id = player_id;
END;
$function$;

-- Update setup_player_pin to hash the PIN
CREATE OR REPLACE FUNCTION public.setup_player_pin(player_id uuid, new_pin text)
 RETURNS TABLE(success boolean, player_name text, player_is_admin boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_player RECORD;
BEGIN
  -- Get player and check if PIN already set
  SELECT id, name, is_admin, pin_hash INTO v_player
  FROM public.players
  WHERE id = player_id;
  
  IF v_player IS NULL THEN
    RETURN QUERY SELECT false, NULL::text, NULL::boolean;
    RETURN;
  END IF;
  
  IF v_player.pin_hash IS NOT NULL THEN
    RETURN QUERY SELECT false, v_player.name, v_player.is_admin;
    RETURN;
  END IF;
  
  -- Set the hashed PIN
  UPDATE public.players 
  SET pin_hash = crypt(new_pin, gen_salt('bf', 10)),
      pin = NULL -- Remove plain text PIN
  WHERE id = player_id;
  
  RETURN QUERY SELECT true, v_player.name, v_player.is_admin;
END;
$function$;

-- Update check_player_has_pin to use pin_hash
CREATE OR REPLACE FUNCTION public.check_player_has_pin(player_id uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT (pin_hash IS NOT NULL) FROM public.players WHERE id = player_id
$function$;

-- Update the views to use pin_hash for has_pin
DROP VIEW IF EXISTS public.players_public;
CREATE VIEW public.players_public
WITH (security_invoker=on) AS
  SELECT p.id, p.name, (p.pin_hash IS NOT NULL) AS has_pin
  FROM public.players p
  WHERE p.is_admin = false;

DROP VIEW IF EXISTS public.players_admin;
CREATE VIEW public.players_admin
WITH (security_invoker=on) AS
  SELECT p.id, p.name, (p.pin_hash IS NOT NULL) AS has_pin
  FROM public.players p
  WHERE p.is_admin = true;

-- Update list functions to use pin_hash
CREATE OR REPLACE FUNCTION public.list_public_players()
 RETURNS TABLE(id uuid, name text, has_pin boolean)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT p.id, p.name, (p.pin_hash IS NOT NULL) AS has_pin
  FROM public.players p
  WHERE p.is_admin = false
$function$;

CREATE OR REPLACE FUNCTION public.list_admin_players()
 RETURNS TABLE(id uuid, name text, has_pin boolean)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT p.id, p.name, (p.pin_hash IS NOT NULL) AS has_pin
  FROM public.players p
  WHERE p.is_admin = true
$function$;

-- Update is_current_player_admin to work with the new policy
CREATE OR REPLACE FUNCTION public.is_current_player_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.players
    WHERE id = current_player_id()
      AND is_admin = true
  )
$function$;

-- Clean up: Remove plain text PINs after migration is complete
-- (keeping it commented until verified, admin can run this manually later)
-- UPDATE public.players SET pin = NULL WHERE pin_hash IS NOT NULL;