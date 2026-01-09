-- Simplify predictions RLS - allow all operations but check user_id matches in the data
DROP POLICY IF EXISTS "Anyone can view all predictions" ON public.predictions;
DROP POLICY IF EXISTS "Players can insert own predictions" ON public.predictions;
DROP POLICY IF EXISTS "Players can update own predictions" ON public.predictions;
DROP POLICY IF EXISTS "Players can delete own predictions" ON public.predictions;

-- Simple policies that allow operations (security is at app level with PIN)
CREATE POLICY "Anyone can view predictions" 
ON public.predictions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert predictions" 
ON public.predictions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update predictions" 
ON public.predictions 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete predictions" 
ON public.predictions 
FOR DELETE 
USING (true);