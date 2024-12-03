// src/features/analytics/components/leaderboard-overview.tsx
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
  Label,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeaderboardData } from "@/types/members";
import { Trophy, Medal, Star, Clock, Award } from "lucide-react";

export function LeaderboardOverview({ data }: { data: LeaderboardData }) {
  const sortedMembers = React.useMemo(() => {
    return Object.values(data.members)
      .filter((m) => m.stars > 0)
      .map((member) => {
        // Calculate average solve time
        const completedPuzzles = Object.values(
          member.completion_day_level
        ).filter((day) => day["1"]?.get_star_ts && day["2"]?.get_star_ts);

        const totalTime = completedPuzzles.reduce((sum, day) => {
          return sum + (day["2"].get_star_ts - day["1"].get_star_ts);
        }, 0);

        const avgTime =
          completedPuzzles.length > 0
            ? totalTime / (completedPuzzles.length * 60) // Convert to minutes
            : 0;

        return {
          ...member,
          avgSolveTime: avgTime,
        };
      })
      .sort((a, b) => b.local_score - a.local_score)
      .slice(0, 10); // Top 10 members
  }, [data]);

  const topThreeSection = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {sortedMembers.slice(0, 3).map((member, i) => {
        // Calculate display order and actual rank
        const displayOrder = i === 0 ? 1 : i === 1 ? 0 : 2; // For visual order
        const rank = i + 1; // Actual rank (1, 2, 3)
        const colors = ["#FFD700", "#C0C0C0", "#CD7F32"];
        const icons = [
          <Trophy key="trophy" className="h-8 w-8" />,
          <Medal key="medal" className="h-8 w-8" />,
          <Award key="award" className="h-8 w-8" />,
        ];

        const hours = Math.floor(member.avgSolveTime / 60);
        const minutes = Math.round(member.avgSolveTime % 60);
        const timeDisplay = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

        return (
          <Card
            key={member.id}
            className={`relative overflow-hidden transition-transform duration-200 w-full mb-6 max-w-sm ${
              i === 0
                ? "md:scale-125 z-20 order-2" // First (center)
                : i === 1
                ? "md:scale-100 z-10 order-1" // Second (left)
                : "md:scale-100 z-10 order-3" // Third (right)
            }`}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundColor: colors[i], // Use i instead of displayOrder
                backgroundImage:
                  "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.2) 100%)",
              }}
            />
            <CardHeader className="relative">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {icons[i]} {/* Use i instead of displayOrder */}
                  <div>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <CardDescription>Rank #{rank}</CardDescription>{" "}
                    {/* Use rank instead of index + 1 */}
                  </div>
                </div>
                <div className="text-3xl font-bold">{member.local_score}</div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Stars</span>
                  <span className="text-xl font-bold flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {member.stars}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Avg Time
                  </span>
                  <span className="text-xl font-bold flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {timeDisplay}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const distributionChart = (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Points Distribution</CardTitle>
        <CardDescription>
          Relative score distribution among top players
        </CardDescription>
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
                {sortedMembers.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={`hsl(${
                      (360 / sortedMembers.length) * index
                    }, 70%, 50%)`}
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
  );

  const progressChart = (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Stars vs Score Comparison</CardTitle>
        <CardDescription>
          Comparing stars earned to local score achieved
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedMembers}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#82ca9d" />
              <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="stars" fill="#82ca9d" name="Stars" />
              <Bar
                yAxisId="right"
                dataKey="local_score"
                fill="#8884d8"
                name="Score"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const performanceChart = (
    <Card>
      <CardHeader>
        <CardTitle>Completion Rate</CardTitle>
        <CardDescription>
          Percentage of available stars earned by each player
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="30%"
              outerRadius="100%"
              data={sortedMembers}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                minAngle={15}
                background
                clockWise={true}
                dataKey="stars"
                label={{ fill: "#666", position: "insideStart" }}
              />
              <Legend
                iconSize={10}
                width={120}
                height={140}
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-4xl font-bold mb-8">Leaderboard Overview</h1>
      {topThreeSection}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {distributionChart}
        {progressChart}
      </div>
      {performanceChart}
    </div>
  );
}
