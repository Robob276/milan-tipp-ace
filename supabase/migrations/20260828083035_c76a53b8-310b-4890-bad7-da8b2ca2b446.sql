-- 1) Identitäts-Spoofing-Funktion entfernen
DROP FUNCTION IF EXISTS public.set_config(text, text, boolean);

-- 2) Ungenutzte Views entfernen (RLS-Bypass)
DROP VIEW IF EXISTS public.players_public;
DROP VIEW IF EXISTS public.players_admin;

-- 3) Predictions: offene Schreibrechte entfernen (Schreiben nur noch via SECURITY DEFINER RPCs)
DROP POLICY IF EXISTS "Public can insert predictions" ON public.predictions;
DROP POLICY IF EXISTS "Public can update predictions" ON public.predictions;
DROP POLICY IF EXISTS "Public can delete predictions" ON public.predictions;
REVOKE INSERT, UPDATE, DELETE ON public.predictions FROM anon, authenticated;

-- 4) Players: direktes PIN-Setzen unterbinden
DROP POLICY IF EXISTS "Players can set PIN when null" ON public.players;
REVOKE INSERT, UPDATE, DELETE ON public.players FROM anon, authenticated;

-- 5) Brute-Force-Schutz für PIN-Login
ALTER TABLE public.players
  ADD COLUMN IF NOT EXISTS failed_pin_attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pin_locked_until timestamptz;

CREATE OR REPLACE FUNCTION public.verify_player_pin(player_id uuid, pin_attempt text)
RETURNS TABLE(id uuid, name text, is_admin boolean, valid boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_player RECORD;
  v_valid boolean;
BEGIN
  SELECT p.id, p.name, p.is_admin, p.pin_hash, p.pin_locked_until, p.failed_pin_attempts
    INTO v_player
  FROM public.players p
  WHERE p.id = player_id;

  IF v_player IS NULL THEN
    RETURN;
  END IF;

  -- Gesperrt?
  IF v_player.pin_locked_until IS NOT NULL AND v_player.pin_locked_until > now() THEN
    RETURN QUERY SELECT v_player.id, v_player.name, v_player.is_admin, false;
    RETURN;
  END IF;

  v_valid := v_player.pin_hash IS NOT NULL
             AND v_player.pin_hash = extensions.crypt(pin_attempt, v_player.pin_hash);

  IF v_valid THEN
    UPDATE public.players
      SET failed_pin_attempts = 0, pin_locked_until = NULL
      WHERE players.id = player_id;
  ELSE
    UPDATE public.players
      SET failed_pin_attempts = COALESCE(players.failed_pin_attempts, 0) + 1,
          pin_locked_until = CASE
            WHEN COALESCE(players.failed_pin_attempts, 0) + 1 >= 5
            THEN now() + interval '15 minutes'
            ELSE players.pin_locked_until
          END
      WHERE players.id = player_id;
  END IF;

  RETURN QUERY SELECT v_player.id, v_player.name, v_player.is_admin, v_valid;
END;
$function$;

-- 6) PIN-Ersteinrichtung absichern (atomar, keine Übernahme bei gesetztem PIN)
CREATE OR REPLACE FUNCTION public.setup_player_pin(player_id uuid, new_pin text)
RETURNS TABLE(success boolean, player_name text, player_is_admin boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_row RECORD;
BEGIN
  IF new_pin !~ '^\d{4}$' THEN
    RETURN QUERY SELECT false, NULL::text, NULL::boolean;
    RETURN;
  END IF;

  UPDATE public.players p
     SET pin_hash = extensions.crypt(new_pin, extensions.gen_salt('bf', 10)),
         pin = NULL
   WHERE p.id = player_id
     AND p.pin_hash IS NULL
  RETURNING p.name, p.is_admin INTO v_row;

  IF v_row IS NULL THEN
    SELECT p.name, p.is_admin INTO v_row FROM public.players p WHERE p.id = player_id;
    RETURN QUERY SELECT false, v_row.name, v_row.is_admin;
    RETURN;
  END IF;

  RETURN QUERY SELECT true, v_row.name, v_row.is_admin;
END;
$function$;