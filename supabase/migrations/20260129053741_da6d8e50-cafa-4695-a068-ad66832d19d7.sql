-- Fix security definer view issue by using security_invoker
-- This ensures the view uses the permissions of the querying user

-- Drop the existing view
DROP VIEW IF EXISTS public.profiles_public;

-- Recreate the view with security_invoker=on
-- This means the view will use the RLS policies of the querying user
CREATE VIEW public.profiles_public 
WITH (security_invoker = on) AS
  SELECT id, display_name, avatar_url
  FROM public.profiles;

-- Grant SELECT to authenticated users only (not anon/public)
REVOKE ALL ON public.profiles_public FROM anon;
REVOKE ALL ON public.profiles_public FROM public;
GRANT SELECT ON public.profiles_public TO authenticated;