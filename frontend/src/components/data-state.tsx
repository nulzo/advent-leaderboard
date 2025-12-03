import { LoaderCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRefreshLeaderboard } from '@/features/leaderboard/hooks/use-leaderboard';

interface DataStateProps {
  isLoading: boolean;
  error: Error | null;
  children: React.ReactNode;
}

export function DataState({ isLoading, error, children }: DataStateProps) {
  const { refresh } = useRefreshLeaderboard();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground uppercase tracking-wider">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 p-8 border border-destructive/50 bg-destructive/5">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold">Failed to load leaderboard data</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {error.message || 'An unexpected error occurred. Please check your session cookie and try again.'}
          </p>
        </div>
        <Button onClick={refresh} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}


