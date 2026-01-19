-- Drop overly permissive policies on results table
-- This is SAFE because admin_upsert_result and admin_delete_result 
-- use SECURITY DEFINER which bypasses RLS entirely

DROP POLICY IF EXISTS "Public can insert results" ON public.results;
DROP POLICY IF EXISTS "Public can update results" ON public.results;
DROP POLICY IF EXISTS "Public can delete results" ON public.results;