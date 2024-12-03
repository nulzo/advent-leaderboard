// src/features/analytics/components/daily-patterns.tsx
import * as React from "react";
import {
  ComposedChart,
  Line,
  Bar,
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
import { LeaderboardData } from "@/types/members";

export function DailyPatterns({ data }: { data: LeaderboardData }) {
  const processedData = React.useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => {
      const day = i + 1;
      const completions = Object.values(data.members).filter(
        m => m.completion_day_level[day]
      );
      
      const avgTime = completions.reduce((acc, m) => {
        const dayData = m.completion_day_level[day];
        if (dayData["2"]) {
          return acc + (dayData["2"].get_star_ts - dayData["1"].get_star_ts) / 60;
        }
        return acc;
      }, 0) / completions.length;

      return {
        day,
        completions: completions.length,
        avgSolveTime: avgTime || 0,
        difficulty: avgTime ? (avgTime / 60) * completions.length : 0,
      };
    });
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Challenge Patterns</CardTitle>
        <CardDescription>
          Analyzing completion counts, solve times, and relative difficulty
        </CardDescription>
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
                dataKey="completions"
                fill="hsl(var(--primary))"
                name="Completions"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgSolveTime"
                stroke="hsl(var(--chart-1))"
                name="Avg Solve Time (min)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="difficulty"
                stroke="hsl(var(--chart-2))"
                name="Relative Difficulty"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}