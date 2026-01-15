-- Drop existing views
DROP VIEW IF EXISTS public.players_admin;
DROP VIEW IF EXISTS public.players_public;

-- Recreate players_admin view with SECURITY INVOKER
CREATE VIEW public.players_admin 
WITH (security_invoker = true)
AS
SELECT 
    id,
    name,
    (pin IS NOT NULL) AS has_pin
FROM public.players
WHERE is_admin = true;

-- Recreate players_public view with SECURITY INVOKER
CREATE VIEW public.players_public 
WITH (security_invoker = true)
AS
SELECT 
    id,
    name,
    (pin IS NOT NULL) AS has_pin
FROM public.players
WHERE is_admin = false;

-- Grant appropriate permissions on the views
GRANT SELECT ON public.players_admin TO anon, authenticated;
GRANT SELECT ON public.players_public TO anon, authenticated;