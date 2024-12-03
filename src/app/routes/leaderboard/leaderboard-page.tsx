import { LeaderboardOverview } from '@/features/overview/components/overview'
import { data } from '@/data/true-data';

export function LeaderboardRoute() {
  return (
    <div className="space-y-8">
      <h1 className="font-bold text-4xl"></h1>
      <LeaderboardOverview data={data} />
    </div>
  )
}
