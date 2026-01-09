-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Players can view own record" ON public.players;

-- Create a policy that only allows viewing own record after login
CREATE POLICY "Players can view own record" 
ON public.players 
FOR SELECT 
USING (id = public.current_player_id());

-- Update the views to use SECURITY INVOKER with proper access
-- The views need to bypass RLS to show player list for login dropdown
DROP VIEW IF EXISTS public.players_public;
DROP VIEW IF EXISTS public.players_admin;

-- Recreate views with SECURITY DEFINER to bypass RLS (they only expose safe fields)
CREATE VIEW public.players_public 
WITH (security_invoker = false)
AS
SELECT 
  id,
  name,
  (pin IS NOT NULL) as has_pin
FROM public.players
WHERE is_admin = false;

CREATE VIEW public.players_admin
WITH (security_invoker = false)  
AS
SELECT 
  id,
  name,
  (pin IS NOT NULL) as has_pin
FROM public.players
WHERE is_admin = true;

-- Grant access to views
GRANT SELECT ON public.players_public TO anon, authenticated;
GRANT SELECT ON public.players_admin TO anon, authenticated;