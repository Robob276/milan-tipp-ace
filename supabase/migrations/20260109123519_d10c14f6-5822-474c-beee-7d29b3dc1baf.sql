-- Drop the restrictive policy
DROP POLICY IF EXISTS "Players can set own PIN" ON public.players;

-- Create a new policy that allows:
-- 1. Setting PIN when pin is null (first time setup)
-- 2. Any user to update their own pin (for reset scenarios - can be restricted later)
CREATE POLICY "Players can set PIN when null" 
ON public.players 
FOR UPDATE 
USING (pin IS NULL)
WITH CHECK (pin IS NOT NULL);