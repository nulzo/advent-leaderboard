import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LeaderboardData } from "@/types/members";
import { useEffect, useState } from "react";

function getNextPuzzleTime() {
  const now = new Date();
  const est = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const nextDay = new Date(est);
  nextDay.setDate(est.getDate() + 1);
  nextDay.setHours(0, 0, 0, 0);
  return nextDay;
}

export function LeaderboardOverview({ data }: { data: LeaderboardData }) {
  const [timeToNext, setTimeToNext] = useState<string>("");
  const [daysRemaining, setDaysRemaining] = useState<number>(0);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const est = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
      const dec25 = new Date(est.getFullYear(), 11, 25);
      const remainingDays = Math.ceil((dec25.getTime() - est.getTime()) / (1000 * 60 * 60 * 24));
      setDaysRemaining(Math.max(0, remainingDays));

      const nextPuzzle = getNextPuzzleTime();
      const diff = nextPuzzle.getTime() - est.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeToNext(`${hours}h ${minutes}m`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  const sortedMembers = React.useMemo(() => {
    return Object.values(data.members)
      .filter((m) => m.stars > 0)
      .sort((a, b) => b.local_score - a.local_score);
  }, [data]);

  const totalStars = Object.values(data.members).reduce((acc, m) => acc + m.stars, 0);
  const maxPossibleStars = Object.keys(data.members).length * 50;
  const completionRate = ((totalStars / maxPossibleStars) * 100).toFixed(1);

  return (
    <div className="space-y-16">
      {/* Hero Metrics */}
      <section className="grid grid-cols-2 md:grid-cols-4 border-y-2 border-foreground">
        <div className="p-8 border-r border-foreground last:border-r-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Next Puzzle</div>
          <div className="text-4xl md:text-5xl font-mono font-bold tracking-tight">{timeToNext}</div>
        </div>
        <div className="p-8 border-r border-foreground last:border-r-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Days Left</div>
          <div className="text-4xl md:text-5xl font-mono font-bold tracking-tight">{daysRemaining}</div>
        </div>
        <div className="p-8 border-r border-foreground last:border-r-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Total Stars</div>
          <div className="text-4xl md:text-5xl font-mono font-bold tracking-tight">{totalStars}</div>
        </div>
        <div className="p-8">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Completion</div>
          <div className="text-4xl md:text-5xl font-mono font-bold tracking-tight">{completionRate}%</div>
        </div>
      </section>

      {/* Leader Spotlight */}
      {sortedMembers[0] && (
        <section>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Current Leader</div>
          <div className="flex items-baseline gap-6 border-b-4 border-foreground pb-4">
            <span className="text-6xl md:text-8xl font-bold tracking-tighter">{sortedMembers[0].name}</span>
            <span className="text-2xl md:text-3xl font-mono text-muted-foreground">{sortedMembers[0].local_score} pts</span>
          </div>
        </section>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
        {/* Rankings Table */}
        <div className="lg:col-span-2">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Rankings</div>
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-foreground hover:bg-transparent">
                <TableHead className="w-16 font-bold text-foreground">#</TableHead>
                <TableHead className="font-bold text-foreground">Participant</TableHead>
                <TableHead className="text-right font-bold text-foreground">Score</TableHead>
                <TableHead className="text-right font-bold text-foreground">Stars</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMembers.map((member, index) => (
                <TableRow key={member.id} className="border-b border-border hover:bg-muted/30">
                  <TableCell className="font-mono font-bold">{String(index + 1).padStart(2, '0')}</TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-right font-mono">{member.local_score}</TableCell>
                  <TableCell className="text-right font-mono">{member.stars}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Score Distribution Chart */}
        <div className="lg:col-span-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Score Distribution</div>
          <div className="h-[400px] border-l-2 border-b-2 border-foreground pl-4 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedMembers} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="1 1" horizontal={true} vertical={false} className="stroke-border" />
                <XAxis 
                  type="number" 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}
                  className="fill-muted-foreground"
                />
                <YAxis 
                  type="category"
                  dataKey="name" 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  className="fill-foreground"
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: 'var(--color-muted)', opacity: 0.5 }}
                  contentStyle={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-foreground)',
                    borderWidth: 2,
                    borderRadius: 0,
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-foreground)',
                  }}
                  labelStyle={{ color: 'var(--color-foreground)', fontWeight: 600 }}
                  itemStyle={{ color: 'var(--color-foreground)' }}
                  formatter={(value: number) => [`${value} points`, 'Score']}
                />
                <Bar dataKey="local_score" radius={[0, 0, 0, 0]}>
                  {sortedMembers.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? 'var(--color-foreground)' : 'var(--color-muted-foreground)'} 
                      fillOpacity={index === 0 ? 1 : 0.6}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
