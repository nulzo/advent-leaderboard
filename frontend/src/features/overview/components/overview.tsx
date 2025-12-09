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
      const dec25 = new Date(est.getFullYear(), 11, 12);
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
  const maxPossibleStars = Object.keys(data.members).length * 24;
  const completionRate = ((totalStars / maxPossibleStars) * 100).toFixed(1);

  return (
    <div className="space-y-8 md:space-y-16">
      {/* Hero Metrics - responsive grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 border-y-2 border-foreground">
        <div className="p-4 md:p-8 border-r border-foreground lg:last:border-r-0">
          <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-muted-foreground mb-1 md:mb-2">
            Next Puzzle
          </div>
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono font-bold tracking-tight">
            {timeToNext}
          </div>
        </div>
        <div className="p-4 md:p-8 border-r-0 lg:border-r border-foreground">
          <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-muted-foreground mb-1 md:mb-2">
            Days Left
          </div>
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono font-bold tracking-tight">
            {daysRemaining}
          </div>
        </div>
        <div className="p-4 md:p-8 border-r border-t lg:border-t-0 border-foreground">
          <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-muted-foreground mb-1 md:mb-2">
            Total Stars
          </div>
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono font-bold tracking-tight">
            {totalStars}
          </div>
        </div>
        <div className="p-4 md:p-8 border-t lg:border-t-0">
          <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-muted-foreground mb-1 md:mb-2">
            Completion
          </div>
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono font-bold tracking-tight">
            {completionRate}%
          </div>
        </div>
      </section>

      {/* Leader Spotlight - responsive */}
      {sortedMembers[0] && (
        <section>
          <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-muted-foreground mb-2 md:mb-4">
            Current Leader
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 border-b-4 border-foreground pb-4">
            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tighter break-all sm:break-normal">
              {sortedMembers[0].name}
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl font-mono text-muted-foreground">
              {sortedMembers[0].local_score} pts
            </span>
          </div>
        </section>
      )}

      {/* Two Column Layout - stacks on mobile */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 md:gap-16">
        {/* Rankings Table */}
        <div className="xl:col-span-2 order-2 xl:order-1">
          <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-muted-foreground mb-4 md:mb-6">
            Rankings
          </div>
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-foreground hover:bg-transparent">
                  <TableHead className="w-12 md:w-16 font-bold text-foreground text-xs md:text-sm">#</TableHead>
                  <TableHead className="font-bold text-foreground text-xs md:text-sm">Participant</TableHead>
                  <TableHead className="text-right font-bold text-foreground text-xs md:text-sm">Score</TableHead>
                  <TableHead className="text-right font-bold text-foreground text-xs md:text-sm">★</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMembers.map((member, index) => (
                  <TableRow key={member.id} className="border-b border-border hover:bg-muted/30">
                    <TableCell className="font-mono font-bold text-xs md:text-sm">
                      {String(index + 1).padStart(2, '0')}
                    </TableCell>
                    <TableCell className="font-medium text-xs md:text-sm max-w-[120px] md:max-w-none truncate">
                      {member.name}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs md:text-sm">
                      {member.local_score}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs md:text-sm">
                      {member.stars}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Score Distribution Chart */}
        <div className="xl:col-span-3 order-1 xl:order-2">
          <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-muted-foreground mb-4 md:mb-6">
            Score Distribution
          </div>
          <div className="h-[300px] md:h-[400px] border-l-2 border-b-2 border-foreground pl-2 md:pl-4 pb-2 md:pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={sortedMembers} 
                layout="vertical" 
                margin={{ top: 0, right: 10, bottom: 0, left: 0 }}
              >
                <CartesianGrid 
                  strokeDasharray="1 1" 
                  horizontal={true} 
                  vertical={false} 
                  className="stroke-border" 
                />
                <XAxis 
                  type="number" 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
                  className="fill-muted-foreground"
                />
                <YAxis 
                  type="category"
                  dataKey="name" 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                  className="fill-foreground"
                  width={80}
                  tickFormatter={(value) => value.length > 10 ? `${value.slice(0, 10)}…` : value}
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
