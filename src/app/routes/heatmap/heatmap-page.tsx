import { LeaderboardHeatmap } from "@/features/heatmap/components/heatmap"
import { data } from "@/data/true-data"
import { StarSequenceHeatmap } from "@/features/heatmap/components/star-sequence-heatmap"
import { StarTimeMatrix } from "@/features/heatmap/components/star-time-matrix"
import { StarDensityHeatmap } from "@/features/heatmap/components/star-density-heatmap"
import { StarVelocityHeatmap } from "@/features/heatmap/components/star-velocity-heatmap"

export function LeaderboardHeatmapRoute() {
  return (
    <div className="space-y-8">
      <h1 className="font-bold text-4xl">Leaderboard Heatmap</h1>
      <LeaderboardHeatmap data={data} />
      <StarSequenceHeatmap data={data} />
      <StarTimeMatrix data={data} />
      <StarDensityHeatmap data={data} />
      <StarVelocityHeatmap data={data} />
    </div>
  )
}
