import { LeaderboardTable } from '@/features/leaderboard/components/leaderboard-table'
import { useLeaderboard } from '@/features/leaderboard/hooks/use-leaderboard';
import { DataState } from '@/components/data-state';

export function TableRoute() {
  const { data, isLoading, error } = useLeaderboard();

  return (
    <article className="max-w-6xl">
      {/* Title Block */}
      <header className="mb-8 md:mb-16">
        <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-muted-foreground mb-2 md:mb-4">
          Raw Data
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-[0.9] mb-4 md:mb-6">
          Participant<br />Data
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Complete tabular view of all participant statistics including scores, star counts, 
          and solve time metrics. Sortable and searchable for detailed analysis.
        </p>
      </header>

      <DataState isLoading={isLoading} error={error}>
        {data && <LeaderboardTable data={data} />}
      </DataState>
    </article>
  );
}
