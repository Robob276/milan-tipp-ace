-- Restore non-permissive RLS policies for predictions and results

-- Predictions: keep public read, restrict write to current_player_id()
DROP POLICY IF EXISTS "Public can read predictions" ON public.predictions;
DROP POLICY IF EXISTS "Public can insert predictions" ON public.predictions;
DROP POLICY IF EXISTS "Public can update predictions" ON public.predictions;
DROP POLICY IF EXISTS "Public can delete predictions" ON public.predictions;

CREATE POLICY "Anyone can view predictions"
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

-- Results: public read, admin-only write
DROP POLICY IF EXISTS "Public can read results" ON public.results;
DROP POLICY IF EXISTS "Public can insert results" ON public.results;
DROP POLICY IF EXISTS "Public can update results" ON public.results;
DROP POLICY IF EXISTS "Public can delete results" ON public.results;

CREATE POLICY "Anyone can view results"
ON public.results
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert results"
ON public.results
FOR INSERT
WITH CHECK (public.is_current_player_admin());

CREATE POLICY "Admins can update results"
ON public.results
FOR UPDATE
USING (public.is_current_player_admin());

CREATE POLICY "Admins can delete results"
ON public.results
FOR DELETE
USING (public.is_current_player_admin());