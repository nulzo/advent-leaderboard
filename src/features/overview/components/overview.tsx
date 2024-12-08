import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      setDaysRemaining(remainingDays);

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

  return (
    <div className="gap-8 grid grid-cols-4 md:grid-cols-5">
      {/* Left Side: Stats, Top Performers, Rankings */}
      <div className="space-y-12 col-span-3">
        {/* Competition Status */}
        <div className="border-2 border-foreground grid grid-cols-2 p-8 rounded-none">
          <div>
            <div className="font-mono text-sm uppercase tracking-wide">Next Challenge</div>
            <div className="mt-2 font-bold font-mono text-4xl">{timeToNext}</div>
          </div>
          <div>
            <div className="font-mono text-sm uppercase tracking-wide">Remaining Days</div>
            <div className="mt-2 font-bold font-mono text-4xl">{daysRemaining}</div>
          </div>
        </div>

        {/* Top Performers Grid */}
        <div className="gap-8 grid grid-cols-3">
          {sortedMembers.slice(0, 3).map((member, i) => (
            <div key={member.id} className="border-2 border-foreground p-8 rounded-none">
              <div className="font-mono">
                <div className="text-sm uppercase tracking-wide">Rank</div>
                <div className="mt-2 font-bold text-4xl">#{i + 1}</div>
                <div className="mt-4 font-bold text-xl">{member.name}</div>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between">
                    <span>Score</span>
                    <span className="font-bold">{member.local_score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stars</span>
                    <span className="font-bold">{member.stars}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rankings Table */}
        <div className="border-2 border-foreground p-8 rounded-none">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-bold font-mono">Rank</TableHead>
                <TableHead className="font-bold font-mono">Participant</TableHead>
                <TableHead className="text-right font-bold font-mono">Score</TableHead>
                <TableHead className="text-right font-bold font-mono">Stars</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMembers.map((member, index) => (
                <TableRow key={member.id} className="hover:bg-transparent">
                  <TableCell className="font-bold font-mono">{index + 1}</TableCell>
                  <TableCell className="font-mono">{member.name}</TableCell>
                  <TableCell className="text-right font-mono">{member.local_score}</TableCell>
                  <TableCell className="text-right font-mono">{member.stars}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Right Side: Score Distribution Chart */}
      <div className="col-span-2 rounded-none h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedMembers.slice(0, 10)} margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--foreground))" opacity={0.1} />
            <XAxis 
              dataKey="name" 
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
              style={{
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'ui-monospace, monospace'
              }}
            />
            <YAxis 
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
              style={{
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'ui-monospace, monospace'
              }}
            />
            <Tooltip 
              cursor={{ fill: 'hsl(var(--foreground))', opacity: 0.1 }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '2px solid hsl(var(--foreground))',
                borderRadius: 0,
                fontSize: 12,
                fontFamily: 'ui-monospace, monospace'
              }}
            />
            <Bar dataKey="local_score" fill="hsl(var(--foreground))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}