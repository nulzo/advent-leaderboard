import * as React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
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
import { Input } from "@/components/ui/input";
import { LeaderboardData } from "@/types/members";

export function StarStreakCalendar({ data }: { data: LeaderboardData }) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const processedData = React.useMemo(() => {
    const members = Object.values(data.members).filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return Array.from({ length: 25 }, (_, i) => {
      const day = i + 1;
      const dayData = {
        day,
        totalStars: 0,
        streaks: {} as Record<string, number>,
        avgStreak: 0,
      };

      members.forEach((member) => {
        const stars = member.completion_day_level[day];
        const starsCount = stars ? Object.keys(stars).length : 0;
        dayData.totalStars += starsCount;

        // Calculate streak
        let streak = 0;
        for (let d = day; d >= 1; d--) {
          if (member.completion_day_level[d]?.["1"]) {
            streak++;
          } else {
            break;
          }
        }
        dayData.streaks[member.name] = streak;
      });

      dayData.avgStreak =
        Object.values(dayData.streaks).reduce((a, b) => a + b, 0) /
        Math.max(1, members.length);

      return dayData;
    });
  }, [data, searchTerm]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Star Completion Streaks</CardTitle>
        <CardDescription>
          Track consecutive days of star completions
        </CardDescription>
        <Input
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="totalStars"
                fill="hsl(var(--primary))"
                name="Total Stars"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgStreak"
                stroke="hsl(var(--secondary))"
                name="Average Streak"
              />
              {Object.values(data.members)
                .filter((member) =>
                  member.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((member, index) => (
                  <Line
                    key={member.name}
                    yAxisId="right"
                    type="monotone"
                    dataKey={`streaks.${member.name}`}
                    stroke={`hsl(${(360 / Object.keys(data.members).length) * index}, 70%, 50%)`}
                    name={`${member.name}'s Streak`}
                  />
                ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}