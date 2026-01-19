-- Recreate views WITHOUT security_invoker to allow public access
-- These views are safe because they only expose id, name, and has_pin

DROP VIEW IF EXISTS public.players_public;
DROP VIEW IF EXISTS public.players_admin;

-- Views default to SECURITY INVOKER = FALSE, which means they run as the view owner
-- This allows them to access the underlying table even with restrictive RLS
CREATE VIEW public.players_public AS
SELECT 
  p.id,
  p.name,
  (p.pin_hash IS NOT NULL) AS has_pin
FROM public.players p
WHERE p.is_admin = false;

CREATE VIEW public.players_admin AS
SELECT 
  p.id,
  p.name,
  (p.pin_hash IS NOT NULL) AS has_pin
FROM public.players p
WHERE p.is_admin = true;

-- Grant SELECT on these views to anon and authenticated roles
GRANT SELECT ON public.players_public TO anon, authenticated;
GRANT SELECT ON public.players_admin TO anon, authenticated;