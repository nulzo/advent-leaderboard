import { PointsChart } from "@/features/analytics/components/points-chart";
import { LocalScoreChart } from "@/features/analytics/components/local-score-chart";
import { TimeBarChart } from "@/features/analytics/components/time-bar-chart";
import { PerformanceRadar } from "@/features/analytics/components/performance-radar";
import { StarsTreemap } from "@/features/analytics/components/stars-treemap";
import { SolveCorrelation } from "@/features/analytics/components/solve-correlation";
import { CompletionFunnel } from "@/features/analytics/components/completion-funnel";
import { DailyPatterns } from "@/features/analytics/components/daily-patterns";

import { data } from "@/data/true-data";

export function PointsRoute() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Points Progress</h1>
      <PointsChart data={data} />
      <LocalScoreChart data={data} />
      <TimeBarChart data={data} />
      <PerformanceRadar data={data} />
      <StarsTreemap data={data} />
      <SolveCorrelation data={data} />
      <CompletionFunnel data={data} />
      <DailyPatterns data={data} />
    </div>
  );
}
