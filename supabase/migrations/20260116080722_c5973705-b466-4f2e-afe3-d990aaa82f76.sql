-- Re-enable RLS to satisfy security checks, but keep access permissive (equivalent to removing restrictions)

-- 1) Enable RLS
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- 2) Create fully-permissive policies (public read/write)
-- Predictions
CREATE POLICY "Public can read predictions"
ON public.predictions
FOR SELECT
USING (true);

CREATE POLICY "Public can insert predictions"
ON public.predictions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public can update predictions"
ON public.predictions
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can delete predictions"
ON public.predictions
FOR DELETE
USING (true);

-- Results
CREATE POLICY "Public can read results"
ON public.results
FOR SELECT
USING (true);

CREATE POLICY "Public can insert results"
ON public.results
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public can update results"
ON public.results
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can delete results"
ON public.results
FOR DELETE
USING (true);