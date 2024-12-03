import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 font-mono">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-8 border-2 border-black p-8">
        <div>
          <div className="text-sm uppercase tracking-wide">Next Puzzle</div>
          <div className="text-4xl font-bold mt-2">{timeToNext}</div>
        </div>
        <div>
          <div className="text-sm uppercase tracking-wide">Days Remaining</div>
          <div className="text-4xl font-bold mt-2">{daysRemaining}</div>
        </div>
      </div>

      {/* Top 3 */}
      <div className="grid grid-cols-3 gap-8">
        {sortedMembers.slice(0, 3).map((member, i) => (
          <Card key={member.id} className="border-2 border-black rounded-none">
            <CardHeader>
              <CardTitle className="text-4xl font-bold">#{i + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{member.name}</div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Score</span>
                  <span className="font-bold">{member.local_score}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stars</span>
                  <span className="font-bold">{member.stars}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Chart */}
      <Card className="border-2 border-black rounded-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedMembers.slice(0, 10)}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="local_score" fill="#000" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Rankings Table */}
      <div className="border-2 border-black p-8">
        <h2 className="text-2xl font-bold mb-6">Full Rankings</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-black">Rank</TableHead>
              <TableHead className="font-bold text-black">Name</TableHead>
              <TableHead className="font-bold text-black">Score</TableHead>
              <TableHead className="font-bold text-black">Stars</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMembers.map((member, index) => (
              <TableRow key={member.id}>
                <TableCell className="font-bold">{index + 1}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.local_score}</TableCell>
                <TableCell>{member.stars}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}