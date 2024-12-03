import { LeaderboardTable } from '@/features/leaderboard/components/leaderboard-table'
import { LeaderboardOverview } from '@/features/overview/components/overview'
import { data } from '@/data/true-data';

export function LeaderboardRoute() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Leaderboard Overview</h1>
      <LeaderboardTable data={data} />
      <LeaderboardOverview data={data} />
    </div>
  )
}
