import * as React from "react";
import {
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeaderboardData } from "@/types/members";
import { Trophy, Medal, Star, Clock, Award, Calendar, Timer } from "lucide-react";
import { useEffect, useState } from "react";

function getNextPuzzleTime() {
  const now = new Date();
  const est = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const isDecember = est.getMonth() === 11;
  const day = est.getDate();

  if (!isDecember || day > 25 || day < 1) return null;

  const nextDay = new Date(est);
  nextDay.setDate(day + 1);
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

      // Calculate days remaining
      const dec25 = new Date(est.getFullYear(), 11, 25, 23, 59, 59);
      const dec1 = new Date(est.getFullYear(), 11, 1);
      const isWithinEvent = est >= dec1 && est <= dec25;
      const remainingDays = isWithinEvent ?
        Math.ceil((dec25.getTime() - est.getTime()) / (1000 * 60 * 60 * 24)) : 0;
      setDaysRemaining(remainingDays);

      // Calculate time to next puzzle
      const nextPuzzle = getNextPuzzleTime();
      if (nextPuzzle) {
        const diff = nextPuzzle.getTime() - est.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeToNext(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeToNext("No more puzzles");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const sortedMembers = React.useMemo(() => {
    return Object.values(data.members)
      .filter((m) => m.stars > 0)
      .map((member) => {
        const completedPuzzles = Object.values(
          member.completion_day_level
        ).filter((day) => day["1"]?.get_star_ts && day["2"]?.get_star_ts);

        const totalTime = completedPuzzles.reduce((sum, day) => {
          return sum + (day["2"].get_star_ts - day["1"].get_star_ts);
        }, 0);

        const avgTime = completedPuzzles.length > 0 ? totalTime / (completedPuzzles.length * 60) : 0;

        return {
          ...member,
          avgSolveTime: avgTime,
        };
      })
      .sort((a, b) => b.local_score - a.local_score)
      .slice(0, 10);
  }, [data]);

  const countdownSection = (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mb-12">
      <Card className="shadow-lg border-none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-primary" />
            <CardTitle className="font-medium text-lg">Next Puzzle</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-4xl tracking-tight">{timeToNext}</div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <CardTitle className="font-medium text-lg">Event Duration</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-4xl tracking-tight">
            {daysRemaining} days
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const leaderboardSection = (
    <div className="space-y-6 mb-12">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl tracking-tight">Top Performers</h2>
        <span className="text-muted-foreground text-sm">
          Total participants: {Object.keys(data.members).length}
        </span>
      </div>

      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sortedMembers.slice(0, 3).map((member, i) => (
          <Card
            key={member.id}
            className={`relative overflow-hidden transition-all duration-200
    ${i === 0 ? 'bg-yellow-500/5' :
                i === 1 ? 'bg-gray-300/5' :
                  i === 2 ? 'bg-amber-700/5' : 'bg-background'}
    border-none shadow-lg hover:shadow-xl`}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {i === 0 ? <Trophy className="w-6 h-6 text-yellow-500" /> :
                    i === 1 ? <Medal className="w-6 h-6 text-gray-400" /> :
                      <Award className="w-6 h-6 text-amber-700" />}
                  <div>
                    <CardTitle className="font-bold text-xl">{member.name}</CardTitle>
                    <CardDescription>Rank #{i + 1}</CardDescription>
                  </div>
                </div>
                <div className="font-bold text-2xl">{member.local_score}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="gap-4 grid grid-cols-2">
                <div>
                  <div className="mb-1 text-muted-foreground text-sm">Stars</div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-foreground" />
                    <span className="font-bold text-xl">{member.stars}</span>
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-muted-foreground text-sm">Avg Time</div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-foreground" />
                    <span className="font-bold text-xl">
                      {Math.floor(member.avgSolveTime / 60)}h {Math.round(member.avgSolveTime % 60)}m
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const statsSection = (
    <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 mb-12">
      <Card className="bg-background shadow-lg border-none">
        <CardHeader>
          <CardTitle className="font-bold text-lg">Score Distribution</CardTitle>
          <CardDescription>Relative score distribution among top players</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sortedMembers}
                  dataKey="local_score"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  label
                >
                  {sortedMembers.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(var(--primary) / ${0.3 + (index * 0.1)})`}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background shadow-lg border-none">
        <CardHeader>
          <CardTitle className="font-bold text-lg">Stars vs Score</CardTitle>
          <CardDescription>Comparing stars earned to local score achieved</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedMembers}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stars" fill="hsl(var(--primary) / 0.8)" name="Stars" />
                <Bar dataKey="local_score" fill="hsl(var(--primary) / 0.4)" name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
      {countdownSection}
      {leaderboardSection}
      {statsSection}
    </div>
  );
};