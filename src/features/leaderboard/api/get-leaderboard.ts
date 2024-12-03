import { api } from '@/lib/api-client';
import { LeaderboardData } from '@/types/members';

export const getLeaderboard = async (): Promise<LeaderboardData> => {
  return api.get('');
};
