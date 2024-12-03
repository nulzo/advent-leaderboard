import { LeaderboardOverview } from "@/features/overview/components/overview";
import { PointsChart } from "@/features/analytics/components/points-chart";
import { data } from "@/data/true-data";

export function LeaderboardRoute() {
  return (
    <div className="container mx-auto px-4 py-8 font-sans">
      <h1 className="text-4xl md:text-6xl font-bold mb-12 border-b-4 border-black pb-4">
        Leaderboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 grid grid-cols-1 content-start gap-8">
          <LeaderboardOverview data={data} />
        </div>
        <div className="grid grid-cols-1 content-start gap-8">
          <PointsChart data={data} />
        </div>
      </div>
    </div>
  );
}