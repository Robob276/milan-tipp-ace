-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can view predictions" ON public.predictions;
DROP POLICY IF EXISTS "Anyone can insert predictions" ON public.predictions;
DROP POLICY IF EXISTS "Anyone can update predictions" ON public.predictions;
DROP POLICY IF EXISTS "Anyone can delete predictions" ON public.predictions;

-- Create function to get current player from session
CREATE OR REPLACE FUNCTION public.current_player_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.current_player_id', true), '')::uuid
$$;

-- Create secure RLS policies using session variable
CREATE POLICY "Anyone can view all predictions" 
ON public.predictions 
FOR SELECT 
USING (true);

CREATE POLICY "Players can insert own predictions" 
ON public.predictions 
FOR INSERT 
WITH CHECK (user_id = public.current_player_id());

CREATE POLICY "Players can update own predictions" 
ON public.predictions 
FOR UPDATE 
USING (user_id = public.current_player_id());

CREATE POLICY "Players can delete own predictions" 
ON public.predictions 
FOR DELETE 
USING (user_id = public.current_player_id());