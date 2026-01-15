-- Create helper function to check if current player is admin
CREATE OR REPLACE FUNCTION public.is_current_player_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.players
    WHERE id = current_player_id()
      AND is_admin = true
  )
$$;

-- =====================
-- PREDICTIONS TABLE
-- =====================

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can insert predictions" ON public.predictions;
DROP POLICY IF EXISTS "Anyone can update predictions" ON public.predictions;
DROP POLICY IF EXISTS "Anyone can delete predictions" ON public.predictions;

-- Players can only insert predictions for themselves
CREATE POLICY "Players can insert own predictions" 
ON public.predictions 
FOR INSERT 
WITH CHECK (user_id = current_player_id());

-- Players can only update their own predictions
CREATE POLICY "Players can update own predictions" 
ON public.predictions 
FOR UPDATE 
USING (user_id = current_player_id());

-- Players can only delete their own predictions
CREATE POLICY "Players can delete own predictions" 
ON public.predictions 
FOR DELETE 
USING (user_id = current_player_id());

-- =====================
-- RESULTS TABLE
-- =====================

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can insert results" ON public.results;
DROP POLICY IF EXISTS "Anyone can update results" ON public.results;
DROP POLICY IF EXISTS "Anyone can delete results" ON public.results;

-- Only admins can insert results
CREATE POLICY "Admins can insert results" 
ON public.results 
FOR INSERT 
WITH CHECK (is_current_player_admin());

-- Only admins can update results
CREATE POLICY "Admins can update results" 
ON public.results 
FOR UPDATE 
USING (is_current_player_admin());

-- Only admins can delete results
CREATE POLICY "Admins can delete results" 
ON public.results 
FOR DELETE 
USING (is_current_player_admin());

-- =====================
-- CHAT_MESSAGES TABLE
-- =====================

-- Drop overly permissive insert policy
DROP POLICY IF EXISTS "Anyone can insert chat messages" ON public.chat_messages;

-- Players can only insert messages as themselves
CREATE POLICY "Players can insert own chat messages" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (user_id = current_player_id());