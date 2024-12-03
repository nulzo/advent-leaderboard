
import { LeaderboardTable } from '@/features/leaderboard/components/leaderboard-table'
import { data } from "@/data/true-data";

export function TableRoute() {
  return (
    <div className="space-y-8">
      <h1 className="font-bold text-4xl">Points Progress</h1>
      <LeaderboardTable data={data} />
    </div>
  );
}
