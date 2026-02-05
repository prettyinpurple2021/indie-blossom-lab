-- Fix Error Level Security Issues

-- 1. Fix profiles table exposure - remove overly broad SELECT policy
-- Keep only the policy for users viewing their own profile
DROP POLICY IF EXISTS "Authenticated users can view all profiles public data" ON public.profiles;

-- The profiles_public view already exists with security_invoker=on
-- It only exposes id, display_name, avatar_url (non-sensitive fields)
-- Add RLS policy to profiles that allows viewing ONLY the public fields for other users via the view
-- Since profiles_public uses security_invoker, access goes through base table RLS

-- Create a function to check if request is for leaderboard/public profile context
-- For now, we keep users viewing only their own full profile
-- Other users can access limited data via the profiles_public view

-- 2. Fix user_gamification leaderboard exposure
-- Create a secure leaderboard view that only exposes ranking data, not activity patterns
DROP POLICY IF EXISTS "Authenticated users can view all gamification for leaderboard" ON public.user_gamification;

-- Create a secure leaderboard view that excludes sensitive activity data
CREATE OR REPLACE VIEW public.leaderboard_view
WITH (security_invoker = on)
AS
SELECT 
  ug.user_id,
  ug.total_xp,
  pp.display_name,
  pp.avatar_url,
  RANK() OVER (ORDER BY ug.total_xp DESC) as rank
FROM public.user_gamification ug
LEFT JOIN public.profiles pp ON pp.id = ug.user_id;

-- Add comment explaining the view purpose
COMMENT ON VIEW public.leaderboard_view IS 'Secure leaderboard view that only exposes XP totals and ranks, not activity patterns like streaks and last activity dates';

-- Grant access to authenticated users via the view
-- Since it uses security_invoker, we need a policy on the base tables
-- The profiles table already allows users to view their own data
-- For gamification, users should only see their own full record

-- For the leaderboard to work, we need to allow limited access
-- Create a function to check if this is a leaderboard query context
-- Actually, the safer approach is to query leaderboard via edge function

-- Keep the simple policy: users can only see their own gamification data
-- Leaderboard queries should go through an edge function that uses service role