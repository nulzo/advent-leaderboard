import { LeaderboardOverview } from "@/features/overview/components/overview";
import { useLeaderboard } from "@/features/leaderboard/hooks/use-leaderboard";
import { DataState } from "@/components/data-state";

export function LeaderboardRoute() {
  const { data, isLoading, error } = useLeaderboard();

  return (
    <article className="max-w-6xl">
      {/* Title Block */}
      <header className="mb-16">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-6">
          Competition<br />Overview
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Real-time analysis of participant performance in the Advent of Code challenge. 
          This dashboard presents key metrics, rankings, and score distributions.
        </p>
      </header>

      <DataState isLoading={isLoading} error={error}>
        {data && <LeaderboardOverview data={data} />}
      </DataState>
    </article>
  );
}
