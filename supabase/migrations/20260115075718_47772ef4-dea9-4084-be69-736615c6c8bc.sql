-- Provide safe, public player listings without exposing PINs and without SECURITY DEFINER views

-- List non-admin players
CREATE OR REPLACE FUNCTION public.list_public_players()
RETURNS TABLE(id uuid, name text, has_pin boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.name, (p.pin IS NOT NULL) AS has_pin
  FROM public.players p
  WHERE p.is_admin = false
$$;

-- List admin players
CREATE OR REPLACE FUNCTION public.list_admin_players()
RETURNS TABLE(id uuid, name text, has_pin boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.name, (p.pin IS NOT NULL) AS has_pin
  FROM public.players p
  WHERE p.is_admin = true
$$;

-- Ensure anon/authenticated can call the functions
GRANT EXECUTE ON FUNCTION public.list_public_players() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.list_admin_players() TO anon, authenticated;

-- Recreate views as SECURITY INVOKER, selecting from the safe functions
DROP VIEW IF EXISTS public.players_public;
CREATE VIEW public.players_public
WITH (security_invoker = true)
AS
  SELECT * FROM public.list_public_players();

DROP VIEW IF EXISTS public.players_admin;
CREATE VIEW public.players_admin
WITH (security_invoker = true)
AS
  SELECT * FROM public.list_admin_players();

GRANT SELECT ON public.players_public TO anon, authenticated;
GRANT SELECT ON public.players_admin TO anon, authenticated;