import { CompletionMatrix } from "@/features/analytics/components/completion-matrix";
import { useLeaderboard } from "@/features/leaderboard/hooks/use-leaderboard";
import { DataState } from "@/components/data-state";

export function LeaderboardHeatmapRoute() {
  const { data, isLoading, error } = useLeaderboard();

  return (
    <article className="max-w-6xl">
      {/* Title Block */}
      <header className="mb-16">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Section 2
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-6">
          Completion<br />Matrix
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          A comprehensive visualization of star completion status across all participants and days. 
          This matrix reveals patterns in participation, persistence, and puzzle engagement.
        </p>
      </header>

      <DataState isLoading={isLoading} error={error}>
        {data && (
          <div className="space-y-16">
            {/* Section 2.1: Matrix */}
            <section>
              <div className="border-l-4 border-foreground pl-6 mb-8">
                <h2 className="text-2xl font-bold mb-2">2.1 Star Completion Status</h2>
                <p className="text-muted-foreground">
                  Each cell represents a participant's progress on a given day. Hover for detailed timestamps.
                </p>
              </div>
              <CompletionMatrix data={data} figureNumber="2.1" />
            </section>

            {/* Observations */}
            <section className="border-t-2 border-foreground pt-8">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Observations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-bold text-foreground mb-2">Participation Patterns</h4>
                  <p className="leading-relaxed">
                    The matrix reveals drop-off patterns as the competition progresses, with early days 
                    showing higher completion rates. Vertical gaps indicate particularly challenging puzzles.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">Completion Consistency</h4>
                  <p className="leading-relaxed">
                    Top performers typically show dense completion patterns with few gaps, while 
                    casual participants may show sporadic engagement concentrated on weekends.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </DataState>
    </article>
  );
}
