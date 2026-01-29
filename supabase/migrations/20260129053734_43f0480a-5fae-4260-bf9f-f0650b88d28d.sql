-- Enable RLS on the profiles_public view
-- Views inherit RLS from their base table when using security_invoker
-- But we need to ensure the view itself is properly secured

-- The profiles_public view was created with security_invoker=on
-- This means it uses the permissions of the calling user, not the view owner
-- The base 'profiles' table only allows users to view their own profile
-- So we need to add a policy that allows authenticated users to view public profile data

-- First, we need to recreate the view with proper security settings
-- and ensure authenticated users can access it for leaderboards/discussions

-- Drop the existing view
DROP VIEW IF EXISTS public.profiles_public;

-- Recreate the view 
CREATE VIEW public.profiles_public 
WITH (security_barrier = true) AS
  SELECT id, display_name, avatar_url
  FROM public.profiles;

-- Grant SELECT to authenticated users only (not anon/public)
REVOKE ALL ON public.profiles_public FROM anon;
REVOKE ALL ON public.profiles_public FROM public;
GRANT SELECT ON public.profiles_public TO authenticated;