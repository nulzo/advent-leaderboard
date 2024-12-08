import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { MainErrorFallback } from '@/components/errors/main';
import { LoaderCircle } from 'lucide-react';
import { queryConfig } from '@/lib/react-query';
import { LeaderboardProvider } from '@/features/leaderboard/context/leaderboard-context';
import { ThemeProvider } from '@/components/theme-provider';


type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  return (
    <React.Suspense
      fallback={
        <div className="flex justify-center items-center w-screen h-screen">
          <LoaderCircle className='animate-spin size-6' />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <HelmetProvider>
          <ThemeProvider>
            <QueryClientProvider client={queryClient}>
              <LeaderboardProvider>
                {import.meta.env.DEV && <ReactQueryDevtools />}
                {children}
              </LeaderboardProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};