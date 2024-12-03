import { LeaderboardHeatmap } from "@/features/heatmap/components/heatmap"
import { data } from "@/data/true-data"

export function LeaderboardHeatmapRoute() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Leaderboard Heatmap</h1>
      <LeaderboardHeatmap data={data} />
    </div>
  )
}