// src/features/analytics/components/time-efficiency.tsx
import * as React from "react";
import {
  LineChart,
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

export function TimeEfficiency({ data }: { data: LeaderboardData }) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const processedData = React.useMemo(() => {
    const members = Object.values(data.members)
      .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return Array.from({ length: 25 }, (_, i) => {
      const day = i + 1;
      const dayStats = members.reduce((acc, member) => {
        const stars = member.completion_day_level[day];
        if (stars?.["1"]) {
          acc.attempts++;
          if (stars["2"]) {
            acc.successes++;
            acc.totalTime += (stars["2"].get_star_ts - stars["1"].get_star_ts) / 60;
          }
        }
        return acc;
      }, { attempts: 0, successes: 0, totalTime: 0 });

      return {
        day,
        successRate: dayStats.attempts ? (dayStats.successes / dayStats.attempts) * 100 : 0,
        avgTime: dayStats.successes ? dayStats.totalTime / dayStats.successes : 0
      };
    });
  }, [data, searchTerm]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Efficiency Analysis</CardTitle>
        <CardDescription>
          Success rate vs average completion time
        </CardDescription>
        <Input
          placeholder="Filter members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" label={{ value: "Success Rate (%)", angle: -90, position: "insideLeft" }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: "Avg Time (min)", angle: 90, position: "insideRight" }} />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="successRate"
                stroke="hsl(var(--primary))"
                name="Success Rate"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgTime"
                stroke="hsl(var(--secondary))"
                name="Average Time"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}