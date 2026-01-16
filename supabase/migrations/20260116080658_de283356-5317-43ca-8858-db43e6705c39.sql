-- Relax security for predictions/results so the app can save tips and admin results reliably
-- WARNING: This makes these tables writable by anyone with client access.

-- 1) Disable Row Level Security
ALTER TABLE public.predictions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.results DISABLE ROW LEVEL SECURITY;

-- 2) Drop existing policies (cleanup)
DROP POLICY IF EXISTS "Anyone can view predictions" ON public.predictions;
DROP POLICY IF EXISTS "Players can delete own predictions" ON public.predictions;
DROP POLICY IF EXISTS "Players can insert own predictions" ON public.predictions;
DROP POLICY IF EXISTS "Players can update own predictions" ON public.predictions;

DROP POLICY IF EXISTS "Anyone can view results" ON public.results;
DROP POLICY IF EXISTS "Admins can insert results" ON public.results;
DROP POLICY IF EXISTS "Admins can update results" ON public.results;
DROP POLICY IF EXISTS "Admins can delete results" ON public.results;

-- 3) Ensure API roles can access the tables via PostgREST
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.predictions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.results TO anon, authenticated;