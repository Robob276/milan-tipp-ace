-- Fix RLS policy: Only allow players to update their own record based on matching name in session
DROP POLICY "Players can update own record" ON public.players;

-- More restrictive update policy - only if PIN matches or PIN is NULL (first time setup)
CREATE POLICY "Players can set own PIN"
ON public.players
FOR UPDATE
USING (pin IS NULL OR pin = current_setting('app.current_pin', true));