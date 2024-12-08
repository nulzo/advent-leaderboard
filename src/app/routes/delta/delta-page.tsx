import { DeltaFocusedStats } from '@/features/delta/components/delta-stats';
import { TimeEfficiency } from '@/features/delta/components/time-efficiency';
import { TimeDistribution } from '@/features/delta/components/time-distribution';
import { TimeHeatmap } from '@/features/delta/components/time-heatmap';
import { TimeProgress } from '@/features/delta/components/time-progress';
import {TimeComparison} from '@/features/delta/components/time-comparison';
import { data } from '@/data/true-data'

export function DeltaRoute() {
  return (
    <div className="mx-auto px-4 py-12 font-sans container">
      {/* Header Section */}
      <header className="border-foreground mb-16 pb-8 border-b-4">
        <h1 className="mb-6 font-bold font-sans text-5xl md:text-7xl">Delta Analysis</h1>
        <p className="max-w-3xl text-lg md:text-xl leading-relaxed">
          A comprehensive analysis of problem-solving patterns and completion times in algorithmic challenges. 
          This study examines temporal distributions, efficiency metrics, and comparative performance across participants.
        </p>
      </header>

      {/* Main Content */}
      <div className="space-y-24">
        {/* Section 1: Overview */}
        <section>
          <div className="gap-6 grid grid-cols-1 mb-8">
            <h2 className="font-bold text-3xl">Temporal Distribution</h2>
            <p className="max-w-3xl text-lg leading-relaxed">
              The primary analysis examines the time delta between first and second star achievements, 
              revealing patterns in problem-solving approaches and efficiency improvements over time.
            </p>
          </div>
          <div className="col-span-1">
            <DeltaFocusedStats data={data} />
          </div>
        </section>

        {/* Section 2: Efficiency Metrics */}
        <section>
          <div className="gap-16 grid grid-cols-1 md:grid-cols-2">
            <div>
              <h2 className="mb-6 font-bold text-3xl">Efficiency Analysis</h2>
              <p className="mb-8 text-lg leading-relaxed">
                Examining the relationship between success rates and completion times 
                provides insights into problem-solving efficiency and learning curves.
              </p>
              <TimeEfficiency data={data} />
            </div>
            <div>
              <h2 className="mb-6 font-bold text-3xl">Time Distribution</h2>
              <p className="mb-8 text-lg leading-relaxed">
                Analysis of completion time distributions reveals patterns in 
                problem-solving approaches and participant behaviors.
              </p>
              <TimeDistribution data={data} />
            </div>
          </div>
        </section>

        {/* Section 3: Temporal Patterns */}
        <section>
          <div className="gap-16 grid grid-cols-1 md:grid-cols-2">
            <div>
              <h2 className="mb-6 font-bold text-3xl">Temporal Density</h2>
              <p className="mb-8 text-lg leading-relaxed">
                Heat map visualization of completion times across different hours 
                reveals temporal patterns and preferred solving periods.
              </p>
              <TimeHeatmap data={data} />
            </div>
            <div>
              <h2 className="mb-6 font-bold text-3xl">Progress Analysis</h2>
              <p className="mb-8 text-lg leading-relaxed">
                Cumulative time analysis shows progression patterns and 
                relative performance across participants over time.
              </p>
              <TimeProgress data={data} />
            </div>
          </div>
        </section>

        {/* Section 4: Comparative Analysis */}
        <section>
          <div className="gap-6 grid grid-cols-1 mb-8">
            <h2 className="font-bold text-3xl">Comparative Metrics</h2>
            <p className="max-w-3xl text-lg leading-relaxed">
              Multi-dimensional comparison of completion patterns reveals 
              relationships between different performance metrics and solving strategies.
            </p>
          </div>
          <TimeComparison data={data} />
        </section>

        {/* Footer / Methodology */}
        <footer className="border-foreground mt-16 pt-8 border-t-2">
          <h3 className="mb-4 font-bold text-xl">Methodology</h3>
          <p className="max-w-3xl text-lg leading-relaxed">
            Data collected from participant submissions over 25 days. 
            Time measurements are calculated between star achievements, 
            normalized to account for different time zones and submission patterns.
          </p>
        </footer>
      </div>
    </div>
  );
}