import { SolveTimeChart } from '@/features/delta/components/solve-time-chart';
import { useLeaderboard } from '@/features/leaderboard/hooks/use-leaderboard';
import { DataState } from '@/components/data-state';

export function DeltaRoute() {
  const { data, isLoading, error } = useLeaderboard();

  return (
    <article className="max-w-6xl">
      {/* Title Block */}
      <header className="mb-16">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Section 3
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-6">
          Solve Time<br />Delta
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Analysis of the time interval between first and second star acquisition. 
          This metric reveals problem-solving efficiency and the relative difficulty of puzzle part two.
        </p>
      </header>

      <DataState isLoading={isLoading} error={error}>
        {data && (
          <div className="space-y-24">
            {/* Section 3.1: Solve Time by Day */}
            <section>
              <div className="border-l-4 border-foreground pl-6 mb-8">
                <h2 className="text-2xl font-bold mb-2">3.1 Individual Solve Times</h2>
                <p className="text-muted-foreground">
                  Time delta (in minutes) between first and second star for top performers across each day.
                </p>
              </div>
              <SolveTimeChart data={data} figureNumber="3.1" />
            </section>

            {/* Methodology */}
            <footer className="border-t-2 border-foreground pt-8">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Methodology</h3>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Delta time is calculated as the difference between second and first star timestamps. 
                This metric isolates the time spent on part two of each puzzle, which typically requires 
                extending or modifying the initial solution. Participants who only completed part one 
                are excluded from delta calculations.
              </p>
            </footer>
          </div>
        )}
      </DataState>
    </article>
  );
}
