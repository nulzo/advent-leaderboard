import { ProgressChart } from "@/features/analytics/components/progress-chart";
import { PerformanceScatter } from "@/features/analytics/components/performance-scatter";
import { DifficultyAnalysis } from "@/features/analytics/components/difficulty-analysis";
import { useLeaderboard } from "@/features/leaderboard/hooks/use-leaderboard";
import { DataState } from "@/components/data-state";

export function PointsRoute() {
  const { data, isLoading, error } = useLeaderboard();

  return (
    <article className="max-w-6xl">
      {/* Title Block */}
      <header className="mb-16">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Section 1
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-6">
          Performance<br />Metrics
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          A quantitative examination of participant progress, solve times, and puzzle difficulty. 
          This analysis explores temporal patterns and performance correlations across the competition.
        </p>
      </header>

      <DataState isLoading={isLoading} error={error}>
        {data && (
          <div className="space-y-24">
            {/* Section 1.1: Progress Over Time */}
            <section>
              <div className="border-l-4 border-foreground pl-6 mb-8">
                <h2 className="text-2xl font-bold mb-2">1.1 Cumulative Progress</h2>
                <p className="text-muted-foreground">
                  Star accumulation over time for top performers, showing competitive dynamics and pace of completion.
                </p>
              </div>
              <ProgressChart data={data} figureNumber="1.1" />
            </section>

            {/* Section 1.2: Performance Correlation */}
            <section>
              <div className="border-l-4 border-foreground pl-6 mb-8">
                <h2 className="text-2xl font-bold mb-2">1.2 Score-Stars Correlation</h2>
                <p className="text-muted-foreground">
                  Relationship between total stars earned and local score, with solve time as a tertiary dimension.
                </p>
              </div>
              <PerformanceScatter data={data} figureNumber="1.2" />
            </section>

            {/* Section 1.3: Difficulty Analysis */}
            <section>
              <div className="border-l-4 border-foreground pl-6 mb-8">
                <h2 className="text-2xl font-bold mb-2">1.3 Puzzle Difficulty</h2>
                <p className="text-muted-foreground">
                  Median solve times by day, indicating relative puzzle complexity based on participant performance.
                </p>
              </div>
              <DifficultyAnalysis data={data} figureNumber="1.3" />
            </section>

            {/* Methodology */}
            <footer className="border-t-2 border-foreground pt-8">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Methodology</h3>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Performance metrics are calculated from raw completion timestamps. Solve time is defined as 
                the duration between first and second star acquisition. Difficulty scores combine completion 
                rate and median solve time to provide a normalized measure of puzzle complexity.
              </p>
            </footer>
          </div>
        )}
      </DataState>
    </article>
  );
}
