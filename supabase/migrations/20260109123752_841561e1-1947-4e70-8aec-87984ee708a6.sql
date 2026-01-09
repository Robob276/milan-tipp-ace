-- Fix security definer views by setting security_invoker = true
ALTER VIEW public.players_public SET (security_invoker = true);
ALTER VIEW public.players_admin SET (security_invoker = true);