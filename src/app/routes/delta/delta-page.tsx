import { DeltaFocusedStats } from '@/features/delta/components/delta-stats';
import { TimeEfficiency } from '@/features/delta/components/time-efficiency';
import { TimeDistribution } from '@/features/delta/components/time-distribution';
import { TimeHeatmap } from '@/features/delta/components/time-heatmap';
import { TimeProgress } from '@/features/delta/components/time-progress';
import {TimeComparison} from '@/features/delta/components/time-comparison';
import { data } from '@/data/true-data'

export function DeltaRoute() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Delta Focused Stats</h1>
      <DeltaFocusedStats data={data} />
      <TimeEfficiency data={data} />
      <TimeDistribution data={data} />
      <TimeHeatmap data={data} />
      <TimeProgress data={data} />
      <TimeComparison data={data} />
    </div>
  )
}

