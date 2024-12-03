// src/features/leaderboard/hooks/use-leaderboard.ts
import { useQuery } from '@tanstack/react-query';
import { getLeaderboard } from '../api/get-leaderboard';

export const LEADERBOARD_QUERY_KEY = ['leaderboard'];

export function useLeaderboard() {
  return useQuery({
    queryKey: LEADERBOARD_QUERY_KEY,
    queryFn: getLeaderboard,
    staleTime: 1000 * 60 * 20, // 20 minutes
    refetchInterval: 1000 * 60 * 20, // 20 minutes
  });
}