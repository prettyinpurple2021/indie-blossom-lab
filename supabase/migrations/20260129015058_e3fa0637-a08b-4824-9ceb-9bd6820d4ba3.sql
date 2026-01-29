-- Allow authenticated users to view all gamification data for leaderboard
CREATE POLICY "Authenticated users can view all gamification for leaderboard"
ON public.user_gamification
FOR SELECT
USING (auth.uid() IS NOT NULL);