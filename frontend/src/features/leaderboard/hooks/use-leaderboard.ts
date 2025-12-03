import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LeaderboardData } from '@/types/members';
import { AOC_API_PATH } from '@/config/env';

export const LEADERBOARD_QUERY_KEY = ['leaderboard'];

const TEN_MINUTES_MS = 10 * 60 * 1000;

/**
 * Fetches leaderboard data from Advent of Code API via Vite proxy.
 * React Query handles all caching - no need for separate localStorage cache.
 */
async function fetchLeaderboard(): Promise<LeaderboardData> {
  const response = await fetch(AOC_API_PATH, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch leaderboard: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Main hook for accessing leaderboard data.
 * - Caches data for 10 minutes (staleTime)
 * - Keeps data in memory for 20 minutes (gcTime)
 * - Refetches when user returns to tab (if stale)
 * - Persists across page refreshes via React Query's built-in persistence
 */
export function useLeaderboard() {
  return useQuery({
    queryKey: LEADERBOARD_QUERY_KEY,
    queryFn: fetchLeaderboard,
    staleTime: TEN_MINUTES_MS,
    gcTime: TEN_MINUTES_MS * 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook to manually refresh leaderboard data (bypasses cache)
 */
export function useRefreshLeaderboard() {
  const queryClient = useQueryClient();

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: LEADERBOARD_QUERY_KEY });
  };

  return { refresh };
}
