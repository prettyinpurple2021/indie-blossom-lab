import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  totalXp: number;
  badgeCount: number;
  level: number;
}

async function fetchLeaderboard(type: 'xp' | 'badges', limit: number): Promise<LeaderboardEntry[]> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Authentication required');
  }

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-leaderboard?type=${type}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch leaderboard' }));
    throw new Error(error.error || 'Failed to fetch leaderboard');
  }

  return response.json();
}

export function useXPLeaderboard(limit = 10) {
  return useQuery({
    queryKey: ['leaderboard', 'xp', limit],
    queryFn: () => fetchLeaderboard('xp', limit),
  });
}

export function useBadgeLeaderboard(limit = 10) {
  return useQuery({
    queryKey: ['leaderboard', 'badges', limit],
    queryFn: () => fetchLeaderboard('badges', limit),
  });
}

// Note: Streak leaderboard removed for privacy - it exposed user activity patterns
// XP and badge leaderboards provide sufficient gamification without privacy concerns
