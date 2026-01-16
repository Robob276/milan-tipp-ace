-- Make predictions/results writable again (as requested) by allowing anon/auth roles.
-- This effectively removes write restrictions while keeping RLS enabled.

-- Predictions
DROP POLICY IF EXISTS "Players can insert own predictions" ON public.predictions;
DROP POLICY IF EXISTS "Players can update own predictions" ON public.predictions;
DROP POLICY IF EXISTS "Players can delete own predictions" ON public.predictions;

CREATE POLICY "Public can insert predictions"
ON public.predictions
FOR INSERT
WITH CHECK (auth.role() IN ('anon','authenticated'));

CREATE POLICY "Public can update predictions"
ON public.predictions
FOR UPDATE
USING (auth.role() IN ('anon','authenticated'))
WITH CHECK (auth.role() IN ('anon','authenticated'));

CREATE POLICY "Public can delete predictions"
ON public.predictions
FOR DELETE
USING (auth.role() IN ('anon','authenticated'));

-- Results
DROP POLICY IF EXISTS "Admins can insert results" ON public.results;
DROP POLICY IF EXISTS "Admins can update results" ON public.results;
DROP POLICY IF EXISTS "Admins can delete results" ON public.results;

CREATE POLICY "Public can insert results"
ON public.results
FOR INSERT
WITH CHECK (auth.role() IN ('anon','authenticated'));

CREATE POLICY "Public can update results"
ON public.results
FOR UPDATE
USING (auth.role() IN ('anon','authenticated'))
WITH CHECK (auth.role() IN ('anon','authenticated'));

CREATE POLICY "Public can delete results"
ON public.results
FOR DELETE
USING (auth.role() IN ('anon','authenticated'));