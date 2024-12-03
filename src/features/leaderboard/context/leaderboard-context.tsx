// src/features/leaderboard/context/leaderboard-provider.tsx
import * as React from 'react';
import { useLeaderboard } from '../hooks/use-leaderboard';
import { LeaderboardData } from '@/types/members';

type LeaderboardContextType = {
  data: LeaderboardData | undefined;
  isLoading: boolean;
  error: Error | null;
};

const LeaderboardContext = React.createContext<LeaderboardContextType | undefined>(undefined);

export function LeaderboardProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error } = useLeaderboard();

  return (
    <LeaderboardContext.Provider value={{ data, isLoading, error }}>
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboardContext() {
  const context = React.useContext(LeaderboardContext);
  if (context === undefined) {
    throw new Error('useLeaderboardContext must be used within a LeaderboardProvider');
  }
  return context;
}
