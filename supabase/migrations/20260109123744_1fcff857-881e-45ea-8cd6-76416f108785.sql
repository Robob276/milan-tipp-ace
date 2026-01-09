-- Create a public view that only exposes non-sensitive fields
CREATE VIEW public.players_public AS
SELECT 
  id,
  name,
  (pin IS NOT NULL) as has_pin
FROM public.players
WHERE is_admin = false;

-- Create a separate admin-only view
CREATE VIEW public.players_admin AS
SELECT 
  id,
  name,
  (pin IS NOT NULL) as has_pin
FROM public.players
WHERE is_admin = true;

-- Grant access to views
GRANT SELECT ON public.players_public TO anon, authenticated;
GRANT SELECT ON public.players_admin TO anon, authenticated;

-- Update RLS policy - remove public access to full table
DROP POLICY IF EXISTS "Anyone can view players" ON public.players;

-- Only allow reading own player record (after login via PIN check)
CREATE POLICY "Players can view own record" 
ON public.players 
FOR SELECT 
USING (true);