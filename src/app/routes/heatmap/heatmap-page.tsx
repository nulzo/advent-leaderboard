import { LeaderboardHeatmap } from "@/features/heatmap/components/heatmap"
import { StarSequenceHeatmap } from "@/features/heatmap/components/star-sequence-heatmap"
import { StarTimeMatrix } from "@/features/heatmap/components/star-time-matrix"
import { StarDensityHeatmap } from "@/features/heatmap/components/star-density-heatmap"
import { StarVelocityHeatmap } from "@/features/heatmap/components/star-velocity-heatmap"
import { data } from "@/data/true-data"

export function LeaderboardHeatmapRoute() {
  return (
    <div className="mx-auto px-4 py-12 font-sans container">
      {/* Header Section */}
      <header className="border-foreground mb-16 pb-8 border-b-4">
        <h1 className="mb-6 font-bold font-sans text-5xl md:text-7xl">Heatmap Analysis</h1>
        <p className="max-w-3xl text-lg md:text-xl leading-relaxed">
          A detailed visualization of completion patterns and temporal distributions in problem-solving behaviors. 
          This analysis explores density patterns, sequence relationships, and temporal clustering across participants.
        </p>
      </header>

      {/* Main Content */}
      <div className="space-y-24">
        {/* Section 1: Overview */}
        <section>
          <div className="gap-6 grid grid-cols-1 mb-8">
            <h2 className="font-bold text-3xl">Completion Patterns</h2>
            <p className="max-w-3xl text-lg leading-relaxed">
              The primary visualization shows the overall completion status across days,
              highlighting patterns in problem-solving progression and achievement rates.
            </p>
          </div>
          <LeaderboardHeatmap data={data} />
        </section>

        {/* Section 2: Sequence Analysis */}
        <section>
          <div className="gap-16 grid grid-cols-1 md:grid-cols-2">
            <div>
              <h2 className="mb-6 font-bold text-3xl">Sequence Patterns</h2>
              <p className="mb-8 text-lg leading-relaxed">
                Analysis of star completion sequences reveals patterns in 
                problem-solving approaches and solution strategies.
              </p>
              <StarSequenceHeatmap data={data} />
            </div>
            <div>
              <h2 className="mb-6 font-bold text-3xl">Temporal Matrix</h2>
              <p className="mb-8 text-lg leading-relaxed">
                Time-based distribution matrix showing completion clusters
                and temporal density patterns.
              </p>
              <StarTimeMatrix data={data} />
            </div>
          </div>
        </section>

        {/* Section 3: Density Analysis */}
        <section>
          <div className="gap-16 grid grid-cols-1 md:grid-cols-2">
            <div>
              <h2 className="mb-6 font-bold text-3xl">Density Distribution</h2>
              <p className="mb-8 text-lg leading-relaxed">
                Heat density visualization showing concentration of completions
                across different time windows and intervals.
              </p>
              <StarDensityHeatmap data={data} />
            </div>
            <div>
              <h2 className="mb-6 font-bold text-3xl">Velocity Patterns</h2>
              <p className="mb-8 text-lg leading-relaxed">
                Analysis of completion velocity reveals temporal patterns
                and speed variations across challenges.
              </p>
              <StarVelocityHeatmap data={data} />
            </div>
          </div>
        </section>

        {/* Footer / Methodology */}
        <footer className="border-foreground mt-16 pt-8 border-t-2">
          <h3 className="mb-4 font-bold text-xl">Methodology</h3>
          <p className="max-w-3xl text-lg leading-relaxed">
            Heatmap analysis conducted using normalized completion timestamps across 25 days.
            Temporal patterns are analyzed using multi-dimensional clustering and density estimation techniques.
          </p>
        </footer>
      </div>
    </div>
  );
}